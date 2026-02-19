import { z } from "zod";
import { walletRequest } from "../auth/client.js";

export const refundTaskTool = {
  name: "listenme_refund_task",
  description:
    "Request a refund for a ListenME task. Only applicable for tasks " +
    "that have a refundable amount.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    taskId: z.number().describe("The task ID to refund"),
  },
  handler: async (args: { aiAgentId: number; featureId: number; taskId: number }) => {
    const { aiAgentId, featureId, taskId } = args;
    const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}/refund`;
    const signParams = {
      aiAgentId: String(aiAgentId),
      featureId: featureId.toString(),
      taskId: String(taskId),
    };

    const res = await walletRequest<boolean>("POST", path, { body: {}, signParams });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: `Refund requested for task ${taskId}.` }] };
  },
};
