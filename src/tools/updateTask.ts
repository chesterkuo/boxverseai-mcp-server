import { z } from "zod";
import { walletRequest } from "../auth/client.js";

export const updateTaskTool = {
  name: "listenme_update_task",
  description:
    "Update an existing ListenME task. You can modify the task name, parameters, " +
    "schedule, reward info, and publication status.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    taskId: z.number().describe("The task ID to update"),
    taskTypeId: z.number().default(7).describe("Task type ID"),
    name: z.string().optional().describe("Updated task name"),
    parameters: z.record(z.unknown()).optional().describe("Updated task parameters"),
    startTime: z.number().optional().describe("Updated start time (Unix ms)"),
    endTime: z.number().optional().describe("Updated end time (Unix ms)"),
    rewardInfo: z.record(z.unknown()).optional().describe("Updated reward configuration"),
    extraDescription: z.string().optional().describe("Updated additional description"),
    isPublished: z.boolean().optional().describe("Whether to publish"),
    aaWalletBalance: z.string().optional().default("0").describe("AA wallet balance"),
  },
  handler: async (args: {
    aiAgentId: number;
    featureId: number;
    taskId: number;
    taskTypeId: number;
    name?: string;
    parameters?: Record<string, unknown>;
    startTime?: number;
    endTime?: number;
    rewardInfo?: Record<string, unknown>;
    extraDescription?: string;
    isPublished?: boolean;
    aaWalletBalance?: string;
  }) => {
    const { aiAgentId, featureId, taskId, ...body } = args;
    const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}`;

    const signParams: Record<string, unknown> = {
      aiAgentId,
      featureId,
      taskId,
      ...body,
    };
    if (body.parameters) {
      signParams.parameters = convertToString(body.parameters);
    }
    if (body.rewardInfo && !body.extraDescription) {
      signParams.rewardInfo = convertToString(body.rewardInfo);
    }

    const res = await walletRequest<boolean>("PUT", path, {
      body: body as Record<string, unknown>,
      signParams,
    });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: `Task ${taskId} updated successfully.` }] };
  },
};

function convertToString(obj: unknown): string {
  if (Array.isArray(obj)) {
    let result = "[";
    for (const item of obj) {
      result += convertToString(item) + ",";
    }
    if (obj.length) result = result.slice(0, -1);
    result += "]";
    return result;
  }
  if (obj !== null && typeof obj === "object") {
    let result = "{";
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      let strValue: string;
      if (value !== null && typeof value === "object") {
        strValue = convertToString(value);
      } else {
        strValue = String(value).replace(/ /g, "");
      }
      result += `${key}=${strValue},`;
    }
    result = result.slice(0, -1) + "}";
    return result;
  }
  return String(obj).replace(/ /g, "");
}
