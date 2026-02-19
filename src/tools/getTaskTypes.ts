import { z } from "zod";
import { walletRequest } from "../auth/client.js";
import type { TaskTypeItem } from "../types/task.js";

export const getTaskTypesTool = {
  name: "listenme_get_task_types",
  description:
    "Get available task types for a given AI agent. For ListenME, featureId=4 and taskTypeId=7. " +
    "Returns task type configurations including parameters, unlock conditions, and limits.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
  },
  handler: async (args: { aiAgentId: number; featureId: number }) => {
    const { aiAgentId, featureId } = args;
    const path = `/v3/ai-agent/${aiAgentId}/task-type`;
    const params: Record<string, unknown> = { featureId };
    const signParams = { aiAgentId, featureId };

    const res = await walletRequest<TaskTypeItem[]>("GET", path, {
      params,
      signParams,
    });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(res.data, null, 2) }] };
  },
};
