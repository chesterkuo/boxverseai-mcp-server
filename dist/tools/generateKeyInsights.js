import { z } from "zod";
import { aiRequest } from "../auth/client.js";
export const generateKeyInsightsTool = {
    name: "listenme_generate_key_insights",
    description: "Trigger AI generation of key insights for a ListenME task. This starts an " +
        "asynchronous analysis job. Use listenme_get_key_insights to check status and " +
        "retrieve results once analysis is complete.",
    inputSchema: {
        taskId: z.string().describe("The task ID to generate insights for"),
    },
    handler: async (args) => {
        const { taskId } = args;
        const path = `/v1/ai-agent-task/${taskId}/feedback-key-insights`;
        const res = await aiRequest("POST", path, {
            body: {},
            signParams: { taskId },
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return {
            content: [{
                    type: "text",
                    text: `Key insights generation started for task ${taskId}. Use listenme_get_key_insights to check progress.`,
                }],
        };
    },
};
