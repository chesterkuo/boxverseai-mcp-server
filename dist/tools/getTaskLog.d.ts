import { z } from "zod";
export declare const getTaskLogTool: {
    name: string;
    description: string;
    inputSchema: {
        aiAgentId: z.ZodNumber;
        featureId: z.ZodDefault<z.ZodNumber>;
        taskId: z.ZodNumber;
        pageNum: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    };
    handler: (args: {
        aiAgentId: number;
        featureId: number;
        taskId: number;
        pageNum: number;
        pageSize: number;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
