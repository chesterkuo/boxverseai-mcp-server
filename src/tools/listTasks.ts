import { z } from "zod";
import { walletRequest } from "../auth/client.js";
import type { TaskItem } from "../types/task.js";

export const listTasksTool = {
  name: "listenme_list_tasks",
  description:
    "List tasks for an AI agent. Can filter by featureId (4 for ListenME), " +
    "task status, and pagination. Returns task summaries including status, " +
    "reward info, and schedule.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z
      .array(z.number())
      .optional()
      .default([4])
      .describe("Filter by feature IDs (default: [4] for ListenME)"),
    taskId: z.array(z.number()).optional().default([]).describe("Filter by specific task IDs"),
    status: z.array(z.number()).optional().describe(
      "Filter by status: 0=upcoming, 1=active, 2=ended, 3=cancelled, 4=deleted, " +
      "5=verifying, 6=pending distribution, 7=distributed, 8=verification failed"
    ),
    scope: z.enum(["system", "user"]).default("user").describe("Scope: 'user' for dashboard, 'system' for public"),
    pageNum: z.number().optional().default(1).describe("Page number"),
    pageSize: z.number().optional().default(20).describe("Page size"),
  },
  handler: async (args: {
    aiAgentId: number;
    featureId: number[];
    taskId: number[];
    status?: number[];
    scope: string;
    pageNum: number;
    pageSize: number;
  }) => {
    const { aiAgentId, featureId, taskId, status, scope, pageNum, pageSize } = args;
    const path = `/v1/ai-agent/${aiAgentId}/tasks`;

    const featureIds = featureId.length > 0 ? featureId.join(", ") : "";
    const taskIds = taskId.length > 0 ? taskId.join(", ") : "";
    const statusStr = status && status.length > 0 ? status.join(", ") : "";

    const params: Record<string, unknown> = {
      scope,
      pageNum,
      pageSize,
      ...(featureIds ? { featureId: featureIds } : {}),
      ...(taskIds ? { taskId: taskIds } : {}),
      ...(statusStr ? { status: statusStr } : {}),
    };

    const signParams: Record<string, unknown> = {
      aiAgentId,
      scope,
      pageNum,
      pageSize,
      ...(featureIds ? { featureId: featureIds } : {}),
      ...(taskIds ? { taskId: taskIds } : {}),
      ...(statusStr ? { status: statusStr } : {}),
    };

    const res = await walletRequest<{ list: TaskItem[]; totalCount: number }>("GET", path, {
      params,
      signParams,
    });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(res.data, null, 2) }] };
  },
};
