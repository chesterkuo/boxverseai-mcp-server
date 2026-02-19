import { z } from "zod";
export declare const listTasksTool: {
    name: string;
    description: string;
    inputSchema: {
        aiAgentId: z.ZodNumber;
        featureId: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>>;
        taskId: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>>;
        status: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        scope: z.ZodDefault<z.ZodEnum<["system", "user"]>>;
        pageNum: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    };
    handler: (args: {
        aiAgentId: number;
        featureId: number[];
        taskId: number[];
        status?: number[];
        scope: string;
        pageNum: number;
        pageSize: number;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
