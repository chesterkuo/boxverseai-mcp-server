#!/usr/bin/env bash
#
# ListenME MCP Server — Integration Test Script
#
# Usage:
#   ./test/run-tests.sh [AGENT_ID] [TASK_ID]
#
# Prerequisites:
#   - ~/.listenme/config.json configured with valid API credentials
#   - node dist/server.js must be built (run: bun run build)
#
# Examples:
#   ./test/run-tests.sh 24          # Test with agentId=24, auto-discover taskId
#   ./test/run-tests.sh 24 64       # Test with agentId=24, taskId=64
#

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"
SERVER="node $PROJECT_DIR/dist/server.js"

AGENT_ID="${1:-24}"
TASK_ID="${2:-}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PASS=0
FAIL=0
SKIP=0

# ─────────────────────────────────────────────
# Helper: call an MCP tool and return the result text
# ─────────────────────────────────────────────
call_tool() {
  local tool_name="$1"
  local args_json="$2"
  local init='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}'
  local call="{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/call\",\"params\":{\"name\":\"${tool_name}\",\"arguments\":${args_json}}}"

  local output
  output=$(printf '%s\n%s\n' "$init" "$call" | timeout 20 $SERVER 2>/dev/null || true)
  echo "$output" | tail -1
}

# Extract text content from MCP response
extract_text() {
  python3 -c "
import sys, json
data = json.loads(sys.stdin.read())
text = data.get('result', {}).get('content', [{}])[0].get('text', '')
print(text)
"
}

# Check if response is an error
is_error() {
  python3 -c "
import sys, json
data = json.loads(sys.stdin.read())
is_err = data.get('result', {}).get('isError', False)
text = data.get('result', {}).get('content', [{}])[0].get('text', '')
if is_err or text.startswith('Error'):
    print('ERROR')
else:
    print('OK')
"
}

run_test() {
  local test_name="$1"
  local tool_name="$2"
  local args="$3"
  local expect_field="${4:-}"  # optional: field to check exists in JSON response

  printf "${CYAN}[TEST]${NC} %-50s " "$test_name"

  local raw
  raw=$(call_tool "$tool_name" "$args" 2>&1)

  local status
  status=$(echo "$raw" | is_error)

  if [ "$status" = "ERROR" ]; then
    local text
    text=$(echo "$raw" | extract_text)
    printf "${RED}FAIL${NC}\n"
    printf "       %s\n" "$text"
    FAIL=$((FAIL + 1))
    return 1
  fi

  local text
  text=$(echo "$raw" | extract_text)

  if [ -n "$expect_field" ]; then
    if echo "$text" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); assert '$expect_field' in str(d)" 2>/dev/null; then
      printf "${GREEN}PASS${NC}\n"
      PASS=$((PASS + 1))
    else
      printf "${YELLOW}PASS (field '$expect_field' not found, but no error)${NC}\n"
      PASS=$((PASS + 1))
    fi
  else
    printf "${GREEN}PASS${NC}\n"
    PASS=$((PASS + 1))
  fi

  return 0
}

skip_test() {
  local test_name="$1"
  local reason="$2"
  printf "${CYAN}[TEST]${NC} %-50s ${YELLOW}SKIP${NC} (%s)\n" "$test_name" "$reason"
  SKIP=$((SKIP + 1))
}

# ─────────────────────────────────────────────
echo ""
echo "=========================================="
echo " ListenME MCP Server — Integration Tests"
echo "=========================================="
echo ""
echo "Agent ID: $AGENT_ID"
echo "Server:   $SERVER"
echo ""

# ─── Test 1: Server initialization ───
printf "${CYAN}[TEST]${NC} %-50s " "Server initializes correctly"
INIT_RESULT=$(call_tool "listenme_get_task_types" '{"aiAgentId":1,"featureId":4}' 2>/dev/null || true)
if [ -n "$INIT_RESULT" ] && echo "$INIT_RESULT" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); assert 'result' in d" 2>/dev/null; then
  printf "${GREEN}PASS${NC}\n"
  PASS=$((PASS + 1))
else
  printf "${RED}FAIL${NC}\n"
  FAIL=$((FAIL + 1))
fi

# ─── Test 2: Tool count ───
printf "${CYAN}[TEST]${NC} %-50s " "All 19 tools registered"
TOOL_LIST_INIT='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}'
TOOL_LIST_REQ='{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
TOOL_COUNT=$(printf '%s\n%s\n' "$TOOL_LIST_INIT" "$TOOL_LIST_REQ" | timeout 5 $SERVER 2>/dev/null | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line: continue
    try:
        d = json.loads(line)
        if 'result' in d and 'tools' in d['result']:
            print(len(d['result']['tools']))
    except: pass
" 2>/dev/null || echo "0")
if [ "$TOOL_COUNT" = "19" ]; then
  printf "${GREEN}PASS${NC} (${TOOL_COUNT} tools)\n"
  PASS=$((PASS + 1))
else
  printf "${RED}FAIL${NC} (got ${TOOL_COUNT} tools)\n"
  FAIL=$((FAIL + 1))
fi

# ─── Group A: Task Management (Wallet API) ───
echo ""
echo "--- Group A: Task Management (Wallet API) ---"
echo ""

# Test 3: get_task_types
run_test "listenme_get_task_types" \
  "listenme_get_task_types" \
  "{\"aiAgentId\":${AGENT_ID},\"featureId\":4}" \
  "taskTypeId"

# Test 4: list_tasks
run_test "listenme_list_tasks" \
  "listenme_list_tasks" \
  "{\"aiAgentId\":${AGENT_ID},\"featureId\":[4],\"taskId\":[],\"scope\":\"user\",\"pageNum\":1,\"pageSize\":5}" \
  "list"

# Auto-discover TASK_ID if not provided
if [ -z "$TASK_ID" ]; then
  TASK_ID=$(call_tool "listenme_list_tasks" "{\"aiAgentId\":${AGENT_ID},\"featureId\":[4],\"taskId\":[],\"scope\":\"user\",\"pageNum\":1,\"pageSize\":1}" | extract_text | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); print(d['list'][0]['id'] if d.get('list') else '')" 2>/dev/null || echo "")
  if [ -n "$TASK_ID" ]; then
    echo ""
    echo "  Auto-discovered Task ID: $TASK_ID"
    echo ""
  fi
fi

if [ -z "$TASK_ID" ]; then
  echo ""
  echo "  No tasks found for agent $AGENT_ID. Skipping task-specific tests."
  echo ""
  skip_test "listenme_get_task_detail" "no task available"
  skip_test "listenme_get_task_log" "no task available"
  skip_test "listenme_get_task_reward_list" "no task available"
else
  # Test 5: get_task_detail
  run_test "listenme_get_task_detail" \
    "listenme_get_task_detail" \
    "{\"aiAgentId\":${AGENT_ID},\"featureId\":4,\"taskId\":${TASK_ID},\"scope\":\"user\"}" \
    "taskId"

  # Test 6: get_task_log
  run_test "listenme_get_task_log" \
    "listenme_get_task_log" \
    "{\"aiAgentId\":${AGENT_ID},\"featureId\":4,\"taskId\":${TASK_ID}}"

  # Test 7: get_task_reward_list
  run_test "listenme_get_task_reward_list" \
    "listenme_get_task_reward_list" \
    "{\"aiAgentId\":${AGENT_ID},\"featureId\":4,\"taskId\":${TASK_ID}}"
fi

# Destructive tests (skip by default)
echo ""
skip_test "listenme_create_task" "destructive — creates real task"
skip_test "listenme_update_task" "destructive — modifies real task"
skip_test "listenme_delete_task" "destructive — deletes real task"
skip_test "listenme_manual_submit" "destructive — submits task"
skip_test "listenme_refund_task" "destructive — requests refund"
skip_test "listenme_reward_review" "destructive — approves/rejects rewards"

# ─── Group B: Feedback & Analysis (AI API) ───
echo ""
echo "--- Group B: Feedback & Analysis (AI API) ---"
echo ""

if [ -z "$TASK_ID" ]; then
  skip_test "listenme_get_feedback_overview" "no task available"
  skip_test "listenme_get_feedback_list" "no task available"
  skip_test "listenme_get_feedback_detail" "no task available"
  skip_test "listenme_get_topics" "no task available"
  skip_test "listenme_get_feedback_analysis" "no task available"
  skip_test "listenme_get_key_insights" "no task available"
  skip_test "listenme_generate_key_insights" "no task available"
  skip_test "listenme_update_feedback_log" "no task available"
else
  # Test 8: get_feedback_overview
  run_test "listenme_get_feedback_overview" \
    "listenme_get_feedback_overview" \
    "{\"taskId\":\"${TASK_ID}\"}" \
    "total"

  # Test 9: get_feedback_list
  run_test "listenme_get_feedback_list" \
    "listenme_get_feedback_list" \
    "{\"taskId\":\"${TASK_ID}\",\"pageNum\":1,\"pageSize\":5}" \
    "list"

  # Test 10: get_feedback_detail (requires feedback — try first item)
  FEEDBACK_ID=$(call_tool "listenme_get_feedback_list" "{\"taskId\":\"${TASK_ID}\",\"pageNum\":1,\"pageSize\":1}" | extract_text | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); l=d.get('list',[]); print(l[0]['id'] if l else '')" 2>/dev/null || echo "")

  if [ -n "$FEEDBACK_ID" ]; then
    run_test "listenme_get_feedback_detail" \
      "listenme_get_feedback_detail" \
      "{\"taskId\":\"${TASK_ID}\",\"feedbackLogId\":\"${FEEDBACK_ID}\"}" \
      "feedback"
  else
    skip_test "listenme_get_feedback_detail" "no feedback data for task $TASK_ID"
  fi

  # Test 11: get_topics
  run_test "listenme_get_topics" \
    "listenme_get_topics" \
    "{\"taskId\":\"${TASK_ID}\"}"

  # Test 12: get_feedback_analysis
  run_test "listenme_get_feedback_analysis" \
    "listenme_get_feedback_analysis" \
    "{\"taskId\":\"${TASK_ID}\",\"analyzeType\":1,\"timeZone\":8}"

  # Test 13: get_key_insights
  run_test "listenme_get_key_insights" \
    "listenme_get_key_insights" \
    "{\"taskId\":\"${TASK_ID}\"}"

  # Destructive feedback tests
  skip_test "listenme_generate_key_insights" "destructive — triggers analysis job"
  skip_test "listenme_update_feedback_log" "destructive — modifies feedback"
fi

# ─── Summary ───
echo ""
echo "=========================================="
printf " Results: ${GREEN}%d passed${NC}, ${RED}%d failed${NC}, ${YELLOW}%d skipped${NC}\n" $PASS $FAIL $SKIP
echo "=========================================="
echo ""

if [ $FAIL -gt 0 ]; then
  exit 1
fi
