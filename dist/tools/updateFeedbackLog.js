import { z } from "zod";
import { aiRequest } from "../auth/client.js";
export const updateFeedbackLogTool = {
    name: "listenme_update_feedback_log",
    description: "Update feedback log properties: highlight or exclude feedback items from analysis. " +
        "Use this to mark important feedback or exclude low-quality responses.",
    inputSchema: {
        taskId: z.string().describe("The task ID"),
        ids: z.array(z.number()).describe("Array of feedback log IDs to update"),
        isHighlighted: z.boolean().optional().describe("Set to true to highlight, false to unhighlight"),
        isExcluded: z.boolean().optional().describe("Set to true to exclude from analysis, false to include"),
    },
    handler: async (args) => {
        const { taskId, ids, isHighlighted, isExcluded } = args;
        const path = `/v1/ai-agent-task/${taskId}/feedback-log`;
        const body = { ids };
        if (isHighlighted !== undefined)
            body.isHighlighted = isHighlighted;
        if (isExcluded !== undefined)
            body.isExcluded = isExcluded;
        const signParams = { taskId, ...body };
        const res = await aiRequest("PUT", path, {
            body,
            signParams,
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return {
            content: [{
                    type: "text",
                    text: `Updated ${res.data} feedback log(s) for task ${taskId}.`,
                }],
        };
    },
};
