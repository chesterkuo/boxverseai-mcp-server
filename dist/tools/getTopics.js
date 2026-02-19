import { z } from "zod";
import { aiRequest } from "../auth/client.js";
export const getTopicsTool = {
    name: "listenme_get_topics",
    description: "Get extracted topics from feedback for a ListenME task. Returns topic names, " +
        "feedback counts, sentiment, and associated keywords.",
    inputSchema: {
        taskId: z.string().describe("The task ID"),
        startTime: z.number().optional().describe("Filter start time (Unix ms)"),
        endTime: z.number().optional().describe("Filter end time (Unix ms)"),
    },
    handler: async (args) => {
        const { taskId, startTime, endTime } = args;
        const path = `/v1/ai-agent-task/${taskId}/topics`;
        const params = { taskId };
        if (startTime !== undefined)
            params.startTime = startTime;
        if (endTime !== undefined)
            params.endTime = endTime;
        const res = await aiRequest("GET", path, {
            params,
            signParams: { ...params },
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    },
};
