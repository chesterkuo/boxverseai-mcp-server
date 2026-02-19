import { z } from "zod";
export declare const updateFeedbackLogTool: {
    name: string;
    description: string;
    inputSchema: {
        taskId: z.ZodString;
        ids: z.ZodArray<z.ZodNumber, "many">;
        isHighlighted: z.ZodOptional<z.ZodBoolean>;
        isExcluded: z.ZodOptional<z.ZodBoolean>;
    };
    handler: (args: {
        taskId: string;
        ids: number[];
        isHighlighted?: boolean;
        isExcluded?: boolean;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
