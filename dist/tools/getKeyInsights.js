import { z } from "zod";
import { aiRequest } from "../auth/client.js";
export const getKeyInsightsTool = {
    name: "listenme_get_key_insights",
    description: "Get the generated key insights for a ListenME task. Returns AI-generated insights text, " +
        "analysis status (0=not analyzed, 1=analyzing, 2=analyzed, 3=failed), " +
        "and reference feedback items.",
    inputSchema: {
        taskId: z.string().describe("The task ID"),
    },
    handler: async (args) => {
        const { taskId } = args;
        const path = `/v1/ai-agent-task/${taskId}/feedback-key-insights`;
        const res = await aiRequest("GET", path, {
            signParams: { taskId },
        });
        if (res.code < 0) {
            return { content: [{ type: "text", text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    },
};
