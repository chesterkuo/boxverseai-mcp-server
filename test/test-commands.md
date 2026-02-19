# ListenME MCP Server — Manual Test Commands

All commands tested with agentId=69 on 2026-02-20. Replace IDs as needed.

```bash
cd /home/chester/build-pc/listenme-mcp-server
```

## Quick Test Template

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"TOOL_NAME","arguments":ARGS_JSON}}\n' \
  | timeout 15 node dist/index.js 2>/dev/null \
  | tail -1 | python3 -m json.tool
```

---

## Group A: Task Management (Wallet API)

### 1. Get Task Types
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_task_types","arguments":{"aiAgentId":69,"featureId":4}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 2. List Tasks
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_list_tasks","arguments":{"aiAgentId":69,"featureId":[4],"taskId":[],"scope":"user","pageNum":1,"pageSize":20}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 3. Get Task Detail
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_task_detail","arguments":{"aiAgentId":69,"featureId":4,"taskId":163,"scope":"user"}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 4. Get Task Log
> Note: May return 10102 error via external API gateway.
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_task_log","arguments":{"aiAgentId":69,"featureId":4,"taskId":160,"pageNum":1,"pageSize":10}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 5. Get Task Reward List
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_task_reward_list","arguments":{"aiAgentId":69,"featureId":4,"taskId":160}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 6. Create Task (VERIFIED)
> Creates a draft task. Returns new task ID.
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_create_task","arguments":{"aiAgentId":69,"featureId":4,"taskTypeId":7,"name":"MCP Test Survey","parameters":{"domain":"https://listenme.boxverse.ai","productUrl":"https://example.com","explanation":"Testing MCP create task","question":["What do you think about this product?","Any suggestions for improvement?"],"language":"en","recruitmentType":1}}}}\n' | timeout 20 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```
Expected: `"Task created successfully. Task ID: <number>"`

### 7. Update Task (VERIFIED)
> Updates name, parameters, questions. Must include ALL parameter fields (full replace).
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_update_task","arguments":{"aiAgentId":69,"featureId":4,"taskId":TASK_ID,"taskTypeId":7,"name":"MCP Test Survey (Updated)","parameters":{"domain":"https://listenme.boxverse.ai","productUrl":"https://example.com/v2","explanation":"Testing MCP update task","question":["What do you think about this product?","Any suggestions for improvement?","Would you recommend it to a friend?"],"language":"en","recruitmentType":1}}}}\n' | timeout 20 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```
Expected: `"Task TASK_ID updated successfully."`

### 8. Delete Task (VERIFIED)
> Cancels active tasks (status→3). Draft tasks may be fully deleted.
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_delete_task","arguments":{"aiAgentId":69,"featureId":4,"taskId":TASK_ID}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```
Expected: `"Task TASK_ID deleted/cancelled successfully."`

### Full CRUD Lifecycle Test
```bash
# 1. Create
printf '...(create)...' | timeout 20 node dist/index.js 2>/dev/null | tail -1
# → note the returned Task ID

# 2. Read — verify
printf '...(get_task_detail with new ID)...' | timeout 15 node dist/index.js 2>/dev/null | tail -1

# 3. Update — change name + add question
printf '...(update_task with new ID)...' | timeout 20 node dist/index.js 2>/dev/null | tail -1

# 4. Read — verify changes
printf '...(get_task_detail again)...' | timeout 15 node dist/index.js 2>/dev/null | tail -1

# 5. Delete — cancel
printf '...(delete_task with new ID)...' | timeout 15 node dist/index.js 2>/dev/null | tail -1

# 6. Read — confirm status=3 (cancelled)
printf '...(get_task_detail again)...' | timeout 15 node dist/index.js 2>/dev/null | tail -1
```

### 9. Manual Submit
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_manual_submit","arguments":{"aiAgentId":69,"featureId":4,"taskId":TASK_ID}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 10. Refund Task
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_refund_task","arguments":{"aiAgentId":69,"featureId":4,"taskId":TASK_ID}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 11. Reward Review
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_reward_review","arguments":{"aiAgentId":69,"featureId":4,"taskId":TASK_ID,"approved":true}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

---

## Group B: Feedback & Analysis (AI API)

### 12. Get Feedback Overview
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_feedback_overview","arguments":{"taskId":"160"}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 13. Get Feedback List (paginated)
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_feedback_list","arguments":{"taskId":"160","pageNum":1,"pageSize":5}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 14. Get Feedback Detail (single respondent)
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_feedback_detail","arguments":{"taskId":"160","feedbackLogId":"414"}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 15. Get Topics
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_topics","arguments":{"taskId":"160"}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 16. Get Feedback Analysis (charts)
```bash
# analyzeType: 1=volume trend, 2=sentiment trend, 3=category trend
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_feedback_analysis","arguments":{"taskId":"160","analyzeType":1,"timeZone":8}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 17. Get Key Insights
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_key_insights","arguments":{"taskId":"160"}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 18. Generate Key Insights (triggers async job)
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_generate_key_insights","arguments":{"taskId":"160"}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

### 19. Update Feedback Log (highlight/exclude)
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_update_feedback_log","arguments":{"taskId":"160","ids":[414],"isHighlighted":true}}}\n' | timeout 15 node dist/index.js 2>/dev/null | tail -1 | python3 -m json.tool
```

---

## Utility Commands

### List all registered tools
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | timeout 5 node dist/index.js 2>/dev/null | tail -1 | python3 -c "import sys,json; tools=json.loads(sys.stdin.read())['result']['tools']; [print(f'  {t[\"name\"]}') for t in tools]"
```

### Run automated test suite
```bash
chmod +x test/run-tests.sh
./test/run-tests.sh 69          # with agentId=69
./test/run-tests.sh 69 160      # with agentId=69, taskId=160
```

### Health check (SSE mode)
```bash
TRANSPORT=sse PORT=3001 node dist/index.js &
curl http://localhost:3001/health
```
