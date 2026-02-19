import { z } from "zod";
import { walletRequest } from "../auth/client.js";

export const manualSubmitTaskTool = {
  name: "listenme_manual_submit",
  description:
    "Manually submit a ListenME task for processing. This triggers verification " +
    "and reward distribution workflow.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    taskId: z.number().describe("The task ID to submit"),
  },
  handler: async (args: { aiAgentId: number; featureId: number; taskId: number }) => {
    const { aiAgentId, featureId, taskId } = args;
    const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}/manual-submit`;
    const signParams = {
      aiAgentId: String(aiAgentId),
      featureId: String(featureId),
      taskId: String(taskId),
    };

    const res = await walletRequest("POST", path, { body: {}, signParams });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: `Task ${taskId} submitted successfully.` }] };
  },
};
