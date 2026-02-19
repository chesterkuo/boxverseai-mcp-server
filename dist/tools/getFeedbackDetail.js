import { z } from "zod";
import { aiRequest } from "../auth/client.js";
export const getFeedbackDetailTool = {
    name: "listenme_get_feedback_detail",
    description: "Get detailed feedback for a single respondent by feedbackLogId. Returns the full " +
        "conversation (questions + answers), sentiment scores, survey status, duration, " +
        "user criteria, and highlight/exclude status. Use listenme_get_feedback_list first " +
        "to find feedbackLogId values.",
    inputSchema: {
        taskId: z.string().describe("The task ID"),
        feedbackLogId: z.string().describe("The feedback log ID (from listenme_get_feedback_list results)"),
    },
    handler: async (args) => {
        const { taskId, feedbackLogId } = args;
        const path = `/v2/ai-agent-task/${taskId}/feedback-list`;
        const params = {
            feedbackLogId,
            pageNum: 1,
            pageSize: 1,
        };
        const signParams = { ...params, taskId };
        const res = await aiRequest("GET", path, {
            params,
            signParams,
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        const list = res.data?.list;
        if (!list || list.length === 0) {
            return { content: [{ type: "text", text: `No feedback found with feedbackLogId=${feedbackLogId}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(list[0], null, 2) }] };
    },
};
