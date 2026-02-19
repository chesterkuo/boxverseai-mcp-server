import { z } from "zod";
export declare const refundTaskTool: {
    name: string;
    description: string;
    inputSchema: {
        aiAgentId: z.ZodNumber;
        featureId: z.ZodDefault<z.ZodNumber>;
        taskId: z.ZodNumber;
    };
    handler: (args: {
        aiAgentId: number;
        featureId: number;
        taskId: number;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
