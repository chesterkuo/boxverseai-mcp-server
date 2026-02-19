# CLAUDE.md

This file provides guidance to Claude Code when working with the ListenME MCP Server.

## Project Overview

A standalone MCP (Model Context Protocol) server that exposes Boxverse AI ListenME product research task management as 19 MCP tools, enabling AI agents (Claude Desktop, Cursor, etc.) to programmatically manage ListenME tasks and analyze feedback.

## Architecture

- **Runtime:** Node.js / Bun with TypeScript
- **Protocol:** MCP (stdio + SSE transport)
- **Dependencies:** `@modelcontextprotocol/sdk`, `zod`
- **Two API backends:**
  - Wallet API (`api-wallet.boxtradex.io/wallet`) — Task CRUD and operations
  - AI API (`api-ai.boxtradex.io/ai`) — Feedback data and analysis

### Project Structure

```
listenme-mcp-server/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── index.ts                  # Entry point (stdio + SSE transport)
│   ├── auth/
│   │   ├── config.ts             # Config loader (env vars + ~/.listenme/config.json)
│   │   └── client.ts             # HTTP client with API signing
│   ├── utils/
│   │   └── sign.ts               # SHA-256 signing (ported from frontend)
│   ├── types/
│   │   ├── task.ts               # Task-related types
│   │   └── feedback.ts           # Feedback/analysis types
│   └── tools/
│       ├── index.ts              # Tool registry (19 tools)
│       ├── getTaskTypes.ts       # listenme_get_task_types
│       ├── createTask.ts         # listenme_create_task
│       ├── updateTask.ts         # listenme_update_task
│       ├── deleteTask.ts         # listenme_delete_task
│       ├── listTasks.ts          # listenme_list_tasks
│       ├── getTaskDetail.ts      # listenme_get_task_detail
│       ├── getTaskLog.ts         # listenme_get_task_log
│       ├── getTaskRewardList.ts  # listenme_get_task_reward_list
│       ├── manualSubmitTask.ts   # listenme_manual_submit
│       ├── refundTask.ts         # listenme_refund_task
│       ├── rewardReview.ts       # listenme_reward_review
│       ├── getFeedbackOverview.ts
│       ├── getFeedbackList.ts
│       ├── getFeedbackDetail.ts
│       ├── getTopics.ts
│       ├── getFeedbackAnalysis.ts
│       ├── getKeyInsights.ts
│       ├── generateKeyInsights.ts
│       └── updateFeedbackLog.ts
├── docs/
│   ├── TOOLS.md                  # Full tool reference with call examples
│   └── API-RESPONSES.md          # Actual API response samples
└── test/
    ├── run-tests.sh              # Automated test suite
    └── test-commands.md          # Manual test commands
```

## API Signing

All requests are signed using SHA-256, ported from the backend `SignUtil.signBySha256`:

1. Sort parameter keys alphabetically (matches Java `TreeMap` ordering)
2. Concatenate values: arrays as `[v1, v2]`, objects as `JSON.stringify()`, primitives as `.toString()`
3. Append `apiKeySecret`
4. SHA-256 hex digest

**For POST/PUT (create/update):** Nested objects like `parameters` and `rewardInfo` are converted to a deterministic string format matching Java `LinkedTreeMap.toString().replace(" ", "")` before signing:
- Objects: `{key=value,key2=value2}` (no spaces)
- Arrays: `[val1,val2]` (no spaces)
- The `parameters` field must include ALL fields on update (full replace, not partial patch)

**Reference files (in exchange-backend-java repo):**
- Frontend signing: `/home/chester/build-pc/exchange-frontend-boxverse-ai/src/utils/ApiSignGenerator.tsx`
- Backend signing: `exchange-common/src/main/java/com/coindy/exchange/common/SignUtil.java`
- Backend interceptor: `exchange-common-service/.../interceptor/AbstractSignedApiInterceptor.java`
- Gson type adaptor: `exchange-common-service/.../config/GsonDataTypeAdaptor.java` (numbers: int→Long, float→Double)

## Configuration

**Option 1: Environment variables** (take priority)
```bash
LISTENME_WALLET_BASE_URL=https://api-wallet.boxtradex.io/wallet
LISTENME_AI_BASE_URL=https://api-ai.boxtradex.io/ai
LISTENME_API_KEY=<apiKeyId>
LISTENME_API_SECRET=<apiKeySecret>
LISTENME_LANG=en
```

**Option 2: Config file** at `~/.listenme/config.json`
```json
{
  "walletBaseUrl": "https://api-wallet.boxtradex.io/wallet",
  "aiBaseUrl": "https://api-ai.boxtradex.io/ai",
  "apiKey": "<apiKeyId>",
  "apiSecret": "<apiKeySecret>",
  "lang": "en"
}
```

## Claude Desktop / Cursor Integration

Add to MCP client config:
```json
{
  "mcpServers": {
    "listenme": {
      "command": "node",
      "args": ["/home/chester/build-pc/listenme-mcp-server/dist/index.js"],
      "env": {
        "LISTENME_WALLET_BASE_URL": "https://api-wallet.boxtradex.io/wallet",
        "LISTENME_AI_BASE_URL": "https://api-ai.boxtradex.io/ai",
        "LISTENME_API_KEY": "<your-key>",
        "LISTENME_API_SECRET": "<your-secret>"
      }
    }
  }
}
```

Or with bun (no build step needed):
```json
{
  "mcpServers": {
    "listenme": {
      "command": "/home/chester/.bun/bin/bun",
      "args": ["run", "/home/chester/build-pc/listenme-mcp-server/src/index.ts"],
      "env": {
        "LISTENME_WALLET_BASE_URL": "https://api-wallet.boxtradex.io/wallet",
        "LISTENME_AI_BASE_URL": "https://api-ai.boxtradex.io/ai",
        "LISTENME_API_KEY": "<your-key>",
        "LISTENME_API_SECRET": "<your-secret>"
      }
    }
  }
}
```

## Development Commands

```bash
# Install dependencies
/home/chester/.bun/bin/bun install   # or: npm install

# Build
npx tsc

# Type check only
npx tsc --noEmit

# Run directly with bun (no build needed)
/home/chester/.bun/bin/bun run src/index.ts

# Run built version
node dist/index.js

# Run with SSE transport
TRANSPORT=sse PORT=3001 node dist/index.js
```

## MCP Tools (19 total)

### Group A: Task Management (Wallet API)

| # | Tool | Method | Endpoint | Description |
|---|------|--------|----------|-------------|
| 1 | `listenme_get_task_types` | GET | `/v3/ai-agent/{agentId}/task-type` | Get task type configs (featureId=4) |
| 2 | `listenme_create_task` | POST | `/v1/ai-agent/{agentId}/feature/{featureId}/task` | Create a new survey task |
| 3 | `listenme_update_task` | PUT | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}` | Update task settings |
| 4 | `listenme_delete_task` | DELETE | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}` | Delete draft / cancel active task |
| 5 | `listenme_list_tasks` | GET | `/v1/ai-agent/{agentId}/tasks` | List tasks with filters & pagination |
| 6 | `listenme_get_task_detail` | GET | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}/detail` | Full task detail |
| 7 | `listenme_get_task_log` | GET | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}/log` | Task activity log (*) |
| 8 | `listenme_get_task_reward_list` | GET | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}/reward-list` | Reward recipient list |
| 9 | `listenme_manual_submit` | POST | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}/manual-submit` | Submit task for processing |
| 10 | `listenme_refund_task` | POST | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}/refund` | Request task refund |
| 11 | `listenme_reward_review` | POST | `/v1/ai-agent/{agentId}/feature/{featureId}/task/{taskId}/reward/review` | Approve/reject rewards |

(*) `get_task_log` may not be available via external API gateway — returns 10102.

### Group B: Feedback & Analysis (AI API)

| # | Tool | Method | Endpoint | Description |
|---|------|--------|----------|-------------|
| 12 | `listenme_get_feedback_overview` | GET | `/v1/ai-agent-task/{taskId}/feedback-overview` | Feedback summary stats |
| 13 | `listenme_get_feedback_list` | GET | `/v2/ai-agent-task/{taskId}/feedback-list` | Paginated feedback with full detail |
| 14 | `listenme_get_feedback_detail` | GET | `/v2/ai-agent-task/{taskId}/feedback-list?feedbackLogId=` | Single respondent detail |
| 15 | `listenme_get_topics` | GET | `/v1/ai-agent-task/{taskId}/topics` | Extracted feedback topics |
| 16 | `listenme_get_feedback_analysis` | GET | `/v1/ai-agent-task/{taskId}/feedback-analyze` | Trend charts |
| 17 | `listenme_get_key_insights` | GET | `/v1/ai-agent-task/{taskId}/feedback-key-insights` | AI-generated insights |
| 18 | `listenme_generate_key_insights` | POST | `/v1/ai-agent-task/{taskId}/feedback-key-insights` | Trigger insights generation |
| 19 | `listenme_update_feedback_log` | PUT | `/v1/ai-agent-task/{taskId}/feedback-log` | Highlight/exclude feedback |

## Testing

### Automated Test Suite

```bash
# Run all read-only tests (auto-discovers taskId)
./test/run-tests.sh 69

# Run with specific agentId and taskId
./test/run-tests.sh 69 160
```

### CRUD Lifecycle Test (verified 2026-02-20)

```bash
# 1. Create
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_create_task","arguments":{"aiAgentId":69,"featureId":4,"taskTypeId":7,"name":"My Survey","parameters":{"domain":"https://listenme.boxverse.ai","productUrl":"https://example.com","explanation":"Product feedback","question":["What do you think?","Suggestions?"],"language":"en","recruitmentType":1}}}}\n' \
  | timeout 20 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
# → "Task created successfully. Task ID: 172"

# 2. Read
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_task_detail","arguments":{"aiAgentId":69,"featureId":4,"taskId":172,"scope":"user"}}}\n' \
  | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool

# 3. Update
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_update_task","arguments":{"aiAgentId":69,"featureId":4,"taskId":172,"taskTypeId":7,"name":"My Survey (Updated)","parameters":{"domain":"https://listenme.boxverse.ai","productUrl":"https://example.com/v2","explanation":"Updated","question":["What do you think?","Suggestions?","Would you recommend?"],"language":"en","recruitmentType":1}}}}\n' \
  | timeout 20 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
# → "Task 172 updated successfully."

# 4. Delete
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_delete_task","arguments":{"aiAgentId":69,"featureId":4,"taskId":172}}}\n' \
  | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
# → "Task 172 deleted/cancelled successfully."
```

### Test Results Summary (2026-02-20, agentId=69)

**Read-only:** 11 passed, 1 failed (get_task_log — gateway limitation)
**CRUD:** All 4 operations verified (create → read → update → delete)

### Verify Tools Registered

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' \
  | timeout 5 node dist/index.js 2>/dev/null \
  | tail -1 | python3 -c "
import sys,json
tools = json.loads(sys.stdin.read())['result']['tools']
print(f'{len(tools)} tools:')
for t in tools: print(f'  - {t[\"name\"]}')
"
```

## Key API Notes

- API responses use `msg` field (not `message`); success code is `>= 0` (code `1` = success with data)
- ListenME feature: `featureId=4`, `taskTypeId=7` (v1: productFeedback, v2: listenMe)
- Feedback detail is available per-respondent via v2 feedback list with `feedbackLogId` parameter
- Active tasks are **cancelled** (status=3) on delete, not permanently removed
- `bun` is at `/home/chester/.bun/bin/bun`
- Test credentials in `~/.listenme/config.json` — test agent: agentId=69, tasks: 160 (ended, 33 feedback), 163 (active, 14 participants)

## Documentation

- `docs/TOOLS.md` — Full tool reference with parameters and MCP call examples for all 19 tools
- `docs/API-RESPONSES.md` — Actual API response samples from live testing
- `test/test-commands.md` — Copy-paste terminal commands for every tool
- `test/run-tests.sh` — Automated integration test suite
