import { z } from "zod";
import { walletRequest } from "../auth/client.js";
import type { RewardListItem } from "../types/task.js";

export const getTaskRewardListTool = {
  name: "listenme_get_task_reward_list",
  description:
    "Get the reward recipient list for a ListenME task, including user contacts, " +
    "wallet addresses, feedback scores, and survey completion times.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    taskId: z.number().describe("The task ID"),
  },
  handler: async (args: { aiAgentId: number; featureId: number; taskId: number }) => {
    const { aiAgentId, featureId, taskId } = args;
    const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}/reward-list`;
    const signParams = {
      aiAgentId: String(aiAgentId),
      featureId: String(featureId),
      taskId: String(taskId),
    };

    const res = await walletRequest<RewardListItem[]>("GET", path, { signParams });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(res.data, null, 2) }] };
  },
};
