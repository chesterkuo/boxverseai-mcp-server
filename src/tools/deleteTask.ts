import { z } from "zod";
import { walletRequest } from "../auth/client.js";

export const deleteTaskTool = {
  name: "listenme_delete_task",
  description:
    "Delete or cancel a ListenME task. If the task is in draft status it will be deleted; " +
    "if it is active/running it will be cancelled.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    taskId: z.number().describe("The task ID to delete/cancel"),
  },
  handler: async (args: { aiAgentId: number; featureId: number; taskId: number }) => {
    const { aiAgentId, featureId, taskId } = args;
    const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}`;
    const signParams = { aiAgentId, featureId: String(featureId), taskId: String(taskId) };

    const res = await walletRequest<boolean>("DELETE", path, { signParams });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: `Task ${taskId} deleted/cancelled successfully.` }] };
  },
};
