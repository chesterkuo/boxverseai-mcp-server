# @boxverse_ai/listenme-mcp-server

MCP server for **ListenME** — product research task management via [Boxverse AI](https://boxverse.ai).

Provides 19 tools for managing research tasks, reviewing user feedback, and generating insights through the Model Context Protocol (MCP).

## Quick Start

```bash
npx @boxverse_ai/listenme-mcp-server
```

Or install globally:

```bash
npm install -g @boxverse_ai/listenme-mcp-server
listenme-mcp
```

## Setup

### 1. Initialize config

```bash
npx @boxverse_ai/listenme-mcp-server init <apiKey> <apiSecret>
```

This creates `~/.listenme/config.json` with your credentials.

You can optionally override the base URLs:

```bash
npx @boxverse_ai/listenme-mcp-server init <apiKey> <apiSecret> <walletBaseUrl> <aiBaseUrl>
```

### 2. Or use environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LISTENME_API_KEY` | API key from Boxverse dashboard | — |
| `LISTENME_API_SECRET` | API secret | — |
| `LISTENME_WALLET_BASE_URL` | Wallet API base URL | `https://api-wallet.boxtradex.io/wallet` |
| `LISTENME_AI_BASE_URL` | AI API base URL | `https://api-ai.boxtradex.io/ai` |
| `LISTENME_LANG` | Response language | `en` |

Environment variables take precedence over config file values.

## MCP Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

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

If you've already run `init`, you can omit the `env` block:

```json
{
  "mcpServers": {
    "listenme": {
      "command": "npx",
      "args": ["-y", "@boxverse_ai/listenme-mcp-server"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

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

### SSE Transport

For HTTP-based clients, use SSE mode:

```bash
npx @boxverse_ai/listenme-mcp-server --sse
# or
SSE=1 SSE_PORT=3001 npx @boxverse_ai/listenme-mcp-server
```

Endpoints:
- SSE: `http://localhost:3001/sse`
- Messages: `POST http://localhost:3001/messages`
- Health: `GET http://localhost:3001/health`

## Tools (19)

### Task Management (Wallet API)

| Tool | Description |
|------|-------------|
| `listenme_get_task_types` | List available task type categories |
| `listenme_create_task` | Create a new research task |
| `listenme_update_task` | Update an existing task |
| `listenme_delete_task` | Delete a task |
| `listenme_list_tasks` | List tasks with filtering and pagination |
| `listenme_get_task_detail` | Get full task details |
| `listenme_get_task_log` | Get task submission logs |
| `listenme_get_task_reward_list` | List task rewards |
| `listenme_manual_submit` | Manually submit a task completion |
| `listenme_refund_task` | Refund a task |
| `listenme_reward_review` | Review and approve/reject reward submissions |

### Feedback & Analysis (AI API)

| Tool | Description |
|------|-------------|
| `listenme_get_feedback_overview` | Overview stats for a task's feedback |
| `listenme_get_feedback_list` | List feedback entries with filters |
| `listenme_get_topics` | Get discovered feedback topics |
| `listenme_get_feedback_analysis` | Detailed feedback analysis |
| `listenme_get_key_insights` | Retrieve generated key insights |
| `listenme_generate_key_insights` | Trigger AI insight generation |
| `listenme_get_feedback_detail` | Get a single feedback entry |
| `listenme_update_feedback_log` | Update feedback status/notes |

## License

MIT
