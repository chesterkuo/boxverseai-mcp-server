import { z } from "zod";
export declare const getTopicsTool: {
    name: string;
    description: string;
    inputSchema: {
        taskId: z.ZodString;
        startTime: z.ZodOptional<z.ZodNumber>;
        endTime: z.ZodOptional<z.ZodNumber>;
    };
    handler: (args: {
        taskId: string;
        startTime?: number;
        endTime?: number;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
