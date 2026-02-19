import { z } from "zod";
export declare const getFeedbackDetailTool: {
    name: string;
    description: string;
    inputSchema: {
        taskId: z.ZodString;
        feedbackLogId: z.ZodString;
    };
    handler: (args: {
        taskId: string;
        feedbackLogId: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
