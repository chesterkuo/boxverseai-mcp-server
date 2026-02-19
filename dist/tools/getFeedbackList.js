import { z } from "zod";
import { aiRequest } from "../auth/client.js";
export const getFeedbackListTool = {
    name: "listenme_get_feedback_list",
    description: "Get paginated feedback list for a ListenME task (v2 API). Returns detailed feedback " +
        "including summaries, sentiment scores, survey status, duration, and user criteria. " +
        "Can filter by highlighted/excluded status and time range.",
    inputSchema: {
        taskId: z.string().describe("The task ID"),
        pageNum: z.number().optional().default(1).describe("Page number"),
        pageSize: z.number().optional().default(20).describe("Page size"),
        startTime: z.number().optional().describe("Filter start time (Unix ms)"),
        endTime: z.number().optional().describe("Filter end time (Unix ms)"),
        isHighlighted: z.boolean().optional().describe("Filter by highlighted status"),
        isParticipate: z.boolean().optional().default(true).describe("Filter by participation in analysis"),
        feedbackLogId: z.string().optional().describe("Get specific feedback by ID"),
    },
    handler: async (args) => {
        const { taskId, ...rest } = args;
        const path = `/v2/ai-agent-task/${taskId}/feedback-list`;
        const params = {};
        for (const [k, v] of Object.entries(rest)) {
            if (v !== undefined)
                params[k] = v;
        }
        const signParams = { ...params, taskId };
        const res = await aiRequest("GET", path, { params, signParams });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    },
};
