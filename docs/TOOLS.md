# ListenME MCP Server — Tool Reference

## Overview

19 MCP tools for managing ListenME product research tasks and analyzing feedback on the Boxverse AI platform.

**All tools verified** (2026-02-20) with agentId=69 including full CRUD lifecycle (create → read → update → delete).

**Two API backends:**
- **Wallet API** (`LISTENME_WALLET_BASE_URL`) — Task CRUD and operations
- **AI API** (`LISTENME_AI_BASE_URL`) — Feedback data and analysis

### CRUD Signing Note

For write operations (create/update), nested objects like `parameters` and `rewardInfo` are signed using a deterministic string format that matches Java's `LinkedTreeMap.toString().replace(" ", "")`:
- Objects: `{key=value,key2=value2}` (no spaces)
- Arrays: `[val1,val2]` (no spaces)
- Primitives: `String(value)` with spaces removed

The `parameters` must include ALL fields on update (full replace, not partial patch).

**How MCP tools are called:**

When connected to Claude Desktop, Cursor, or any MCP client, tools are invoked via JSON-RPC over stdio. Each call sends:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": { ... }
  }
}
```

To test manually from terminal (via npx):
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"TOOL_NAME","arguments":ARGS_JSON}}\n' \
  | timeout 15 npx -y @boxverse_ai/listenme-mcp-server 2>/dev/null \
  | tail -1 | python3 -m json.tool
```

Or from the local build:
```bash
cd /home/chester/build-pc/listenme-mcp-server

printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"TOOL_NAME","arguments":ARGS_JSON}}\n' \
  | timeout 15 node dist/server.js 2>/dev/null \
  | tail -1 | python3 -m json.tool
```

---

## Group A: Task Management (Wallet API)

### 1. `listenme_get_task_types`

Get available task types for an AI agent. For ListenME, featureId=4 and taskTypeId=7.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID (4 = ListenME) |

**MCP call example:**
```json
{
  "name": "listenme_get_task_types",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4
  }
}
```

**Terminal test:**
```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"listenme_get_task_types","arguments":{"aiAgentId":69,"featureId":4}}}\n' | timeout 15 node dist/server.js 2>/dev/null | tail -1 | python3 -m json.tool
```

**Returns:** Array of task type configurations including parameters, unlock conditions, pricing, and Flowise agent IDs.

---

### 2. `listenme_create_task`

Create a new ListenME product research task. Returns the created task ID.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskTypeId` | number | no | 7 | Task type ID |
| `name` | string | yes | — | Task name |
| `parameters` | object | yes | — | Task parameters (see below) |
| `startTime` | number | no | — | Start time (Unix ms) |
| `endTime` | number | no | — | End time (Unix ms) |
| `rewardInfo` | object | no | — | Reward configuration |
| `extraDescription` | string | no | — | Additional description |
| `isPublished` | boolean | no | — | Publish immediately |
| `aaWalletBalance` | string | no | "0" | AA wallet balance |

**`parameters` object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `domain` | string | Survey domain URL |
| `productUrl` | string | Product website URL |
| `explanation` | string | Product explanation |
| `question` | string[] | Interview questions |
| `context` | {target, objective, background} | Additional context |
| `brandName` | string | Brand name |
| `socialLink` | {x, discord, telegram} | Social media links |
| `language` | string | Survey language code (`en`, `tw`, etc.) |
| `idealDurationMin` | number | Target interview duration (minutes) |
| `craftAiChatId` | string | Craft AI chat session ID |
| `invitationLimit` | number | Max participants |
| `topics` | array | Discussion topics with labels |
| `recruitmentType` | number | 1=self-recruit, 2=Boxverse recruit |
| `criteriaInfo` | object | Participant screening criteria |

**`rewardInfo` object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `chainId` | string | Blockchain chain ID |
| `tokenAddress` | string | Token contract address |
| `tokenSymbol` | string | Token symbol (e.g. "USDC") |
| `amount` | number | Reward amount per participant |
| `limit` | number | Max reward recipients |
| `currency` | string | Currency code |

**MCP call example (minimal — draft task):**
```json
{
  "name": "listenme_create_task",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskTypeId": 7,
    "name": "Product Usability Survey",
    "parameters": {
      "domain": "https://listenme.boxverse.ai",
      "productUrl": "https://example.com/product",
      "explanation": "We want to understand user pain points with our dashboard.",
      "question": [
        "How often do you use our product?",
        "What is the most frustrating part of the experience?",
        "What would make you recommend this product to a friend?"
      ],
      "language": "en",
      "recruitmentType": 1
    }
  }
}
```

**MCP call example (full — with reward and schedule):**
```json
{
  "name": "listenme_create_task",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskTypeId": 7,
    "name": "Product Usability Survey",
    "parameters": {
      "domain": "https://listenme.boxverse.ai",
      "productUrl": "https://example.com/product",
      "explanation": "Understanding user pain points with our new dashboard.",
      "question": [
        "How often do you use our product?",
        "What is the most frustrating part?",
        "What would you improve first?"
      ],
      "context": {
        "target": "Active users who have used the product for 3+ months",
        "objective": "Identify top 3 usability issues for Q3 roadmap",
        "background": "Dashboard redesign planned for Q3 2026"
      },
      "brandName": "MyProduct",
      "socialLink": { "x": "", "discord": "", "telegram": "" },
      "language": "en",
      "idealDurationMin": 15,
      "invitationLimit": 50,
      "topics": [
        {
          "topic": "Usability",
          "labels": ["Navigation", "Load time", "Visual design", "Error handling"]
        },
        {
          "topic": "Feature requests",
          "labels": ["Dashboard", "Reports", "Integrations", "Mobile"]
        }
      ],
      "recruitmentType": 1,
      "criteriaInfo": []
    },
    "startTime": 1770000000000,
    "endTime": 1772000000000,
    "rewardInfo": {
      "chainId": "8453",
      "tokenAddress": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "tokenSymbol": "USDC",
      "amount": 5,
      "limit": 50,
      "currency": "usd"
    },
    "isPublished": false
  }
}
```

**Returns:** `"Task created successfully. Task ID: 172"`

**Verified:** Task created with status=1 (active), all parameters readable via `get_task_detail`.

---

### 3. `listenme_update_task`

Update an existing task (name, parameters, schedule, reward, publication status).

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID to update |
| `taskTypeId` | number | no | 7 | Task type ID |
| `name` | string | no | — | Updated name |
| `parameters` | object | no | — | Updated parameters |
| `startTime` | number | no | — | Updated start time (Unix ms) |
| `endTime` | number | no | — | Updated end time (Unix ms) |
| `rewardInfo` | object | no | — | Updated reward config |
| `extraDescription` | string | no | — | Updated description |
| `isPublished` | boolean | no | — | Publish the task |

**MCP call example:**
```json
{
  "name": "listenme_update_task",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 168,
    "taskTypeId": 7,
    "name": "Updated Survey Name",
    "isPublished": true
  }
}
```

**Returns:** `"Task 172 updated successfully."`

**Verified:** Name, productUrl, and questions all updated. `parameters` must include ALL fields (full replace, not partial).

---

### 4. `listenme_delete_task`

Delete (draft) or cancel (active) a task.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID to delete/cancel |

**MCP call example:**
```json
{
  "name": "listenme_delete_task",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 168
  }
}
```

**Returns:** `"Task 172 deleted/cancelled successfully."`

**Verified:** Active tasks are cancelled (status=3), not permanently deleted. Cancelled tasks are excluded from default list queries but still readable via `get_task_detail`.

---

### 5. `listenme_list_tasks`

List tasks with filtering and pagination.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number[] | no | [4] | Filter by feature IDs |
| `taskId` | number[] | no | [] | Filter by task IDs |
| `status` | number[] | no | — | Filter by status codes |
| `scope` | string | no | "user" | "user" (dashboard) or "system" (public) |
| `pageNum` | number | no | 1 | Page number |
| `pageSize` | number | no | 20 | Page size |

**Task status codes:**

| Code | Status |
|------|--------|
| 0 | Upcoming |
| 1 | Active |
| 2 | Ended |
| 3 | Cancelled |
| 4 | Deleted |
| 5 | Verifying |
| 6 | Pending distribution |
| 7 | Distributed |
| 8 | Verification failed |

**MCP call example (all ListenME tasks):**
```json
{
  "name": "listenme_list_tasks",
  "arguments": {
    "aiAgentId": 69,
    "featureId": [4],
    "taskId": [],
    "scope": "user",
    "pageNum": 1,
    "pageSize": 20
  }
}
```

**MCP call example (only active tasks):**
```json
{
  "name": "listenme_list_tasks",
  "arguments": {
    "aiAgentId": 69,
    "featureId": [4],
    "taskId": [],
    "status": [1],
    "scope": "user",
    "pageNum": 1,
    "pageSize": 10
  }
}
```

**Returns:** Paginated list with `list[]`, `total`, `pages`, etc.

---

### 6. `listenme_get_task_detail`

Get full task detail including parameters, questions, reward config, and participants.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID |
| `scope` | string | no | "user" | Scope |

**MCP call example:**
```json
{
  "name": "listenme_get_task_detail",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 163,
    "scope": "user"
  }
}
```

**Returns:** Full task object with `parameters.question[]`, `parameters.context`, `parameters.topics[]`, `participants`, `rewardInfo`, etc.

---

### 7. `listenme_get_task_log`

Get task participant activity log.

> **Note:** This endpoint may not be available via external API gateway (returns 10102 error).

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID |
| `pageNum` | number | no | 1 | Page number |
| `pageSize` | number | no | 10 | Page size |

**MCP call example:**
```json
{
  "name": "listenme_get_task_log",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 160,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

---

### 8. `listenme_get_task_reward_list`

Get reward recipient list with contacts, wallet addresses, and feedback scores.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID |

**MCP call example:**
```json
{
  "name": "listenme_get_task_reward_list",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 160
  }
}
```

**Returns:** Array of `{ accountName, walletAddress, userId, userContact: { general: { email, phone, wallet }, social: { x, discord, ... } }, countryCode, feedbackScore, surveyCompleteTime }`

---

### 9. `listenme_manual_submit`

Manually submit a task for verification and reward distribution.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID |

**MCP call example:**
```json
{
  "name": "listenme_manual_submit",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 160
  }
}
```

**Returns:** `"Task 160 submitted successfully."`

---

### 10. `listenme_refund_task`

Request a refund for a task with refundable amount.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID |

**MCP call example:**
```json
{
  "name": "listenme_refund_task",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 160
  }
}
```

**Returns:** `"Refund requested for task 160."`

---

### 11. `listenme_reward_review`

Approve or reject the reward distribution list.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `aiAgentId` | number | yes | — | The AI agent ID |
| `featureId` | number | no | 4 | Feature ID |
| `taskId` | number | yes | — | Task ID |
| `approved` | boolean | yes | — | true=approve, false=reject |

**MCP call example:**
```json
{
  "name": "listenme_reward_review",
  "arguments": {
    "aiAgentId": 69,
    "featureId": 4,
    "taskId": 160,
    "approved": true
  }
}
```

**Returns:** `"Reward review for task 160: approved."`

---

## Group B: Feedback & Analysis (AI API)

### 12. `listenme_get_feedback_overview`

Get feedback summary stats for a task.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |
| `startTime` | number | no | — | Filter start (Unix ms) |
| `endTime` | number | no | — | Filter end (Unix ms) |

**MCP call example:**
```json
{
  "name": "listenme_get_feedback_overview",
  "arguments": {
    "taskId": "160"
  }
}
```

**MCP call example (with time filter):**
```json
{
  "name": "listenme_get_feedback_overview",
  "arguments": {
    "taskId": "160",
    "startTime": 1769000000000,
    "endTime": 1770000000000
  }
}
```

**Returns:**

| Field | Description |
|-------|-------------|
| `total` | Total feedback count |
| `diffOfTotal` | New feedback since last check |
| `mainIssue` | Primary issue category |
| `completedCount` | Valid responses |
| `invalidCount` | Invalid responses |
| `partialCount` | Partial responses |
| `averageDuration` | Average interview duration (seconds) |
| `analyzeStatus` | 0=idle, 1=analyzing |
| `unanalyzedCount` | Pending analysis count |
| `lastestSurveyCompleteTime` | Timestamp of most recent valid response |

---

### 13. `listenme_get_feedback_list`

Get paginated feedback list (v2 API) with full detail per respondent.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |
| `pageNum` | number | no | 1 | Page number |
| `pageSize` | number | no | 20 | Page size |
| `startTime` | number | no | — | Filter start (Unix ms) |
| `endTime` | number | no | — | Filter end (Unix ms) |
| `isHighlighted` | boolean | no | — | Filter by highlighted status |
| `isParticipate` | boolean | no | true | Filter by analysis participation |
| `feedbackLogId` | string | no | — | Get specific feedback by ID |

**MCP call example (paginated list):**
```json
{
  "name": "listenme_get_feedback_list",
  "arguments": {
    "taskId": "160",
    "pageNum": 1,
    "pageSize": 5
  }
}
```

**MCP call example (highlighted only):**
```json
{
  "name": "listenme_get_feedback_list",
  "arguments": {
    "taskId": "160",
    "pageNum": 1,
    "pageSize": 10,
    "isHighlighted": true
  }
}
```

**MCP call example (single item by ID):**
```json
{
  "name": "listenme_get_feedback_list",
  "arguments": {
    "taskId": "160",
    "feedbackLogId": "414"
  }
}
```

**Returns per item:**

| Field | Description |
|-------|-------------|
| `id` | Feedback log ID |
| `feedbackType` | Array of types: 1=text, 2=audio, 3=video |
| `summary` | AI-generated conversation summary |
| `surveyStatus` | 1=invalid, 2=incomplete, 3=valid |
| `durationSeconds` | Interview duration in seconds |
| `countryCode` | Respondent country code |
| `isExcluded` | Whether excluded from analysis |
| `isHighlighted` | Whether highlighted by user |
| `feedback[]` | Array of Q&A elements (see below) |
| `createTime` | Timestamp |
| `userCriteria` | Respondent demographics / screening answers |
| `feedbackScore` | Quality score (may be null) |
| `feedbackScoreSummary` | Score explanation (may be null) |

**`feedback[]` element structure:**

| Field | Description |
|-------|-------------|
| `feedbackElementId` | Unique element ID |
| `question` | AI interviewer question (null for user answers) |
| `feedbackType` | null for questions, 1=text / 2=audio / 3=video for answers |
| `feedbackOfText` | User's answer text (null for questions) |
| `feedbackFileUrl` | Audio/video file path (null for text) |
| `labels` | AI-assigned topic labels for this answer |
| `createTime` | Timestamp |

---

### 14. `listenme_get_feedback_detail`

Get detailed feedback for a single respondent by feedback log ID.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |
| `feedbackLogId` | string | yes | — | Feedback log ID (from `listenme_get_feedback_list` results) |

**MCP call example:**
```json
{
  "name": "listenme_get_feedback_detail",
  "arguments": {
    "taskId": "160",
    "feedbackLogId": "414"
  }
}
```

**Returns:** Single feedback item with full Q&A conversation, same structure as items in `listenme_get_feedback_list`.

---

### 15. `listenme_get_topics`

Get extracted topics from feedback responses.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |
| `startTime` | number | no | — | Filter start (Unix ms) |
| `endTime` | number | no | — | Filter end (Unix ms) |

**MCP call example:**
```json
{
  "name": "listenme_get_topics",
  "arguments": {
    "taskId": "160"
  }
}
```

**Returns per topic:**

| Field | Description |
|-------|-------------|
| `topic` | Topic name |
| `amount` | Number of feedback referencing this topic |
| `sentiment` | Overall sentiment (e.g. "正面", "中性", "負面") |
| `keywords` | Array of extracted keywords |

---

### 16. `listenme_get_feedback_analysis`

Get feedback trend charts/data.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |
| `analyzeType` | number | yes | — | 1=volume, 2=sentiment, 3=category |
| `timeZone` | number | no | 8 | Timezone offset (GMT+N) |
| `startTime` | number | no | — | Filter start (Unix ms) |
| `endTime` | number | no | — | Filter end (Unix ms) |

**MCP call example (volume trend):**
```json
{
  "name": "listenme_get_feedback_analysis",
  "arguments": {
    "taskId": "160",
    "analyzeType": 1,
    "timeZone": 8
  }
}
```

**MCP call example (sentiment trend):**
```json
{
  "name": "listenme_get_feedback_analysis",
  "arguments": {
    "taskId": "160",
    "analyzeType": 2,
    "timeZone": 8
  }
}
```

**MCP call example (category trend):**
```json
{
  "name": "listenme_get_feedback_analysis",
  "arguments": {
    "taskId": "160",
    "analyzeType": 3,
    "timeZone": 8
  }
}
```

**Returns:**

| Field | Description |
|-------|-------------|
| `timestamp` | Array of Unix timestamps for x-axis |
| `labels` | Series labels (e.g. `["正面", "中性", "負面"]` for sentiment) |
| `datasets` | Array of data arrays, one per timestamp |

**Labels by analyzeType:**
- **1 (volume):** `["全部回覆", "有效回覆", "無效回覆", "不完整回覆"]`
- **2 (sentiment):** `["正面", "中性", "負面"]`
- **3 (category):** Topic names (e.g. `["Other"]`)

---

### 17. `listenme_get_key_insights`

Get AI-generated key insights for a task.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |

**MCP call example:**
```json
{
  "name": "listenme_get_key_insights",
  "arguments": {
    "taskId": "160"
  }
}
```

**Returns:**

| Field | Description |
|-------|-------------|
| `keyInsights` | Generated insights text (markdown) |
| `count` | Number of feedback analyzed |
| `updateTime` | When insights were generated |
| `analysisStatus` | 0=not analyzed, 1=analyzing, 2=done, 3=failed |
| `reference[]` | Supporting feedback references |

**`reference[]` element:**

| Field | Description |
|-------|-------------|
| `feedbackOfText` | The quoted feedback text |
| `labels` | Topic labels on this feedback |
| `feedbackLogId` | Link back to feedback list |
| `feedbackElementId` | Specific Q&A element ID |
| `createTime` | Timestamp |

---

### 18. `listenme_generate_key_insights`

Trigger AI key insights generation (async job). Use `listenme_get_key_insights` to poll for results.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |

**MCP call example:**
```json
{
  "name": "listenme_generate_key_insights",
  "arguments": {
    "taskId": "160"
  }
}
```

**Returns:** `"Key insights generation started for task 160. Use listenme_get_key_insights to check progress."`

**Typical workflow:**
1. Call `listenme_generate_key_insights` to start
2. Poll `listenme_get_key_insights` — check `analysisStatus`
3. When `analysisStatus=2`, insights are ready in `keyInsights`

---

### 19. `listenme_update_feedback_log`

Mark/highlight or exclude feedback items from analysis.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `taskId` | string | yes | — | Task ID |
| `ids` | number[] | yes | — | Feedback log IDs to update |
| `isHighlighted` | boolean | no | — | true=highlight, false=unhighlight |
| `isExcluded` | boolean | no | — | true=exclude from analysis, false=include |

**MCP call example (highlight feedback):**
```json
{
  "name": "listenme_update_feedback_log",
  "arguments": {
    "taskId": "160",
    "ids": [414, 415],
    "isHighlighted": true
  }
}
```

**MCP call example (exclude from analysis):**
```json
{
  "name": "listenme_update_feedback_log",
  "arguments": {
    "taskId": "160",
    "ids": [415],
    "isExcluded": true
  }
}
```

**Returns:** `"Updated 2 feedback log(s) for task 160."`

---

## Authentication

All requests are signed with SHA-256:

1. Sort parameter keys alphabetically
2. Concatenate values (arrays as `[v1, v2]`, objects as JSON, primitives as string)
3. Append `apiKeySecret`
4. SHA-256 hex digest

Headers sent per request:
- `X-Api-Key` — API key ID
- `X-Api-Sign` — Computed signature
- `Content-Type: application/json`
- `lang` — Language code (default: `en`)

## Configuration

Environment variables (take priority):
```
LISTENME_WALLET_BASE_URL   # e.g. https://api-wallet.boxtradex.io/wallet
LISTENME_AI_BASE_URL       # e.g. https://api-ai.boxtradex.io/ai
LISTENME_API_KEY            # API key ID
LISTENME_API_SECRET         # API key secret
LISTENME_LANG               # default: en
```

Or config file at `~/.listenme/config.json`:
```json
{
  "walletBaseUrl": "https://api-wallet.boxtradex.io/wallet",
  "aiBaseUrl": "https://api-ai.boxtradex.io/ai",
  "apiKey": "your-api-key-id",
  "apiSecret": "your-api-key-secret",
  "lang": "en"
}
```

## Claude Desktop / Cursor Setup

**Via npx (recommended):**
```json
{
  "mcpServers": {
    "listenme": {
      "command": "npx",
      "args": ["-y", "@boxverse_ai/listenme-mcp-server"],
      "env": {
        "LISTENME_API_KEY": "your-key",
        "LISTENME_API_SECRET": "your-secret"
      }
    }
  }
}
```

If you've already run `npx @boxverse_ai/listenme-mcp-server init <key> <secret>`, you can omit the `env` block.

**Via local build:**
```json
{
  "mcpServers": {
    "listenme": {
      "command": "node",
      "args": ["/home/chester/build-pc/listenme-mcp-server/dist/server.js"],
      "env": {
        "LISTENME_API_KEY": "your-key",
        "LISTENME_API_SECRET": "your-secret"
      }
    }
  }
}
```
