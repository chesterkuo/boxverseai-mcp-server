import { z } from "zod";
export declare const getTaskDetailTool: {
    name: string;
    description: string;
    inputSchema: {
        aiAgentId: z.ZodNumber;
        featureId: z.ZodDefault<z.ZodNumber>;
        taskId: z.ZodNumber;
        scope: z.ZodDefault<z.ZodEnum<["system", "user"]>>;
    };
    handler: (args: {
        aiAgentId: number;
        featureId: number;
        taskId: number;
        scope: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
