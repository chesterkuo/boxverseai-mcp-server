import { z } from "zod";
import { aiRequest } from "../auth/client.js";
import type { FeedbackAnalyzeData } from "../types/feedback.js";

export const getFeedbackAnalysisTool = {
  name: "listenme_get_feedback_analysis",
  description:
    "Get feedback analysis charts/trends for a ListenME task. " +
    "analyzeType: 1=feedback volume trend, 2=sentiment distribution trend, 3=category trend. " +
    "Returns timestamps and datasets for charting.",
  inputSchema: {
    taskId: z.string().describe("The task ID"),
    analyzeType: z
      .number()
      .describe("Analysis type: 1=volume trend, 2=sentiment trend, 3=category trend"),
    timeZone: z.number().default(8).describe("Timezone offset (e.g., 8 for GMT+8)"),
    startTime: z.number().optional().describe("Filter start time (Unix ms)"),
    endTime: z.number().optional().describe("Filter end time (Unix ms)"),
  },
  handler: async (args: {
    taskId: string;
    analyzeType: number;
    timeZone: number;
    startTime?: number;
    endTime?: number;
  }) => {
    const { taskId, ...rest } = args;
    const path = `/v1/ai-agent-task/${taskId}/feedback-analyze`;

    const params: Record<string, unknown> = { taskId };
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) params[k] = v;
    }

    const res = await aiRequest<FeedbackAnalyzeData>("GET", path, {
      params,
      signParams: { ...params },
    });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(res.data, null, 2) }] };
  },
};
