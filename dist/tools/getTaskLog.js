import { z } from "zod";
import { walletRequest } from "../auth/client.js";
export const getTaskLogTool = {
    name: "listenme_get_task_log",
    description: "Get the activity log for a ListenME task, showing participant activities and status changes.",
    inputSchema: {
        aiAgentId: z.number().describe("The AI agent ID"),
        featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
        taskId: z.number().describe("The task ID"),
        pageNum: z.number().optional().default(1).describe("Page number"),
        pageSize: z.number().optional().default(10).describe("Page size"),
    },
    handler: async (args) => {
        const { aiAgentId, featureId, taskId, pageNum, pageSize } = args;
        const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task/${taskId}/log`;
        const params = { pageNum, pageSize };
        // Sign includes path variables + query params
        const signParams = {
            aiAgentId: String(aiAgentId),
            featureId: String(featureId),
            pageNum,
            pageSize,
            taskId: String(taskId),
        };
        const res = await walletRequest("GET", path, { params, signParams });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    },
};
