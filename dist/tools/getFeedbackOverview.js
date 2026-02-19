import { z } from "zod";
import { aiRequest } from "../auth/client.js";
export const getFeedbackOverviewTool = {
    name: "listenme_get_feedback_overview",
    description: "Get feedback overview/summary for a ListenME task. Returns total feedback count, " +
        "new feedback diff, main issue, completion stats, average duration, and analysis status.",
    inputSchema: {
        taskId: z.string().describe("The task ID"),
        startTime: z.number().optional().describe("Filter start time (Unix ms)"),
        endTime: z.number().optional().describe("Filter end time (Unix ms)"),
    },
    handler: async (args) => {
        const { taskId, startTime, endTime } = args;
        const path = `/v1/ai-agent-task/${taskId}/feedback-overview`;
        const params = { taskId };
        if (startTime !== undefined)
            params.startTime = startTime;
        if (endTime !== undefined)
            params.endTime = endTime;
        const signParams = { ...params };
        const res = await aiRequest("GET", path, {
            params,
            signParams,
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    },
};
