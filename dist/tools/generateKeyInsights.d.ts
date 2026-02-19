import { z } from "zod";
export declare const generateKeyInsightsTool: {
    name: string;
    description: string;
    inputSchema: {
        taskId: z.ZodString;
    };
    handler: (args: {
        taskId: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
