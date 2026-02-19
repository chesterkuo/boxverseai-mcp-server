import { z } from "zod";
import { walletRequest } from "../auth/client.js";

export const rewardReviewTool = {
  name: "listenme_reward_review",
  description:
    "Approve or reject the reward distribution list for a ListenME task. " +
    "Set approved=true to confirm distribution, false to reject.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    taskId: z.number().describe("The task ID"),
    approved: z.boolean().describe("true to approve reward distribution, false to reject"),
  },
  handler: async (args: {
    aiAgentId: number;
    featureId: number;
    taskId: number;
    approved: boolean;
  }) => {
    const { aiAgentId, featureId, taskId, approved } = args;
    const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}/reward/review`;

    const signParams = {
      aiAgentId,
      featureId,
      taskId: String(taskId),
      approved,
    };

    const res = await walletRequest<boolean>("POST", path, {
      body: { approved },
      signParams,
    });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return {
      content: [{
        type: "text" as const,
        text: `Reward review for task ${taskId}: ${approved ? "approved" : "rejected"}.`,
      }],
    };
  },
};
