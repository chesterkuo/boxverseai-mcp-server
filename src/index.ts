#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer } from "http";
import { initConfig } from "./auth/config.js";
import { allTools } from "./tools/index.js";

// Handle CLI subcommands
const args = process.argv.slice(2);

if (args[0] === "init") {
  initConfig(args[1], args[2], args[3], args[4]);
  process.exit(0);
}

const server = new McpServer({
  name: "listenme-mcp-server",
  version: "0.1.1",
});

// Register all tools
for (const tool of allTools) {
  server.tool(tool.name, tool.description, tool.inputSchema, async (args) => {
    try {
      const result = await tool.handler(args);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  });
}

// Transport setup
const useSSE =
  args.includes("--sse") ||
  process.env.SSE === "1" ||
  process.env.TRANSPORT === "sse";

if (useSSE) {
  const PORT = parseInt(process.env.SSE_PORT || process.env.PORT || "3001", 10);
  let sseTransport: SSEServerTransport | null = null;

  const httpServer = createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/sse") {
      sseTransport = new SSEServerTransport("/messages", res);
      await server.connect(sseTransport);
    } else if (req.method === "POST" && req.url === "/messages") {
      if (sseTransport) {
        await sseTransport.handlePostMessage(req, res);
      } else {
        res.writeHead(400);
        res.end("No SSE connection established");
      }
    } else if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", tools: allTools.length }));
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  httpServer.listen(PORT, () => {
    console.error(`ListenME MCP Server (SSE) listening on port ${PORT}`);
    console.error(`  SSE endpoint: http://localhost:${PORT}/sse`);
    console.error(`  Health check: http://localhost:${PORT}/health`);
  });
} else {
  // Default: stdio transport
  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
  console.error("ListenME MCP Server running on stdio");
}
