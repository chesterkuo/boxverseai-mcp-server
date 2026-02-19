import { z } from "zod";
import { walletRequest } from "../auth/client.js";
export const getTaskDetailTool = {
    name: "listenme_get_task_detail",
    description: "Get detailed information about a specific ListenME task, including parameters, " +
        "reward configuration, schedule, participants, and transaction hashes.",
    inputSchema: {
        aiAgentId: z.number().describe("The AI agent ID"),
        featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
        taskId: z.number().describe("The task ID"),
        scope: z.enum(["system", "user"]).default("user").describe("Scope: 'user' for dashboard"),
    },
    handler: async (args) => {
        const { aiAgentId, featureId, taskId, scope } = args;
        const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}/detail`;
        const signParams = {
            aiAgentId: String(aiAgentId),
            featureId: String(featureId),
            taskId: String(taskId),
            scope,
        };
        const res = await walletRequest("GET", path, {
            params: { scope },
            signParams,
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    },
};
