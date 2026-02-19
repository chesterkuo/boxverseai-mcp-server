import { z } from "zod";
import { walletRequest } from "../auth/client.js";
export const getTaskTypesTool = {
    name: "listenme_get_task_types",
    description: "Get available task types for a given AI agent. For ListenME, featureId=4 and taskTypeId=7. " +
        "Returns task type configurations including parameters, unlock conditions, and limits.",
    inputSchema: {
        aiAgentId: z.number().describe("The AI agent ID"),
        featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    },
    handler: async (args) => {
        const { aiAgentId, featureId } = args;
        const path = `/v3/ai-agent/${aiAgentId}/task-type`;
        const params = { featureId };
        const signParams = { aiAgentId, featureId };
        const res = await walletRequest("GET", path, {
            params,
            signParams,
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    },
};
