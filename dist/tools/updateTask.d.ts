import { z } from "zod";
export declare const updateTaskTool: {
    name: string;
    description: string;
    inputSchema: {
        aiAgentId: z.ZodNumber;
        featureId: z.ZodDefault<z.ZodNumber>;
        taskId: z.ZodNumber;
        taskTypeId: z.ZodDefault<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        startTime: z.ZodOptional<z.ZodNumber>;
        endTime: z.ZodOptional<z.ZodNumber>;
        rewardInfo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        extraDescription: z.ZodOptional<z.ZodString>;
        isPublished: z.ZodOptional<z.ZodBoolean>;
        aaWalletBalance: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    };
    handler: (args: {
        aiAgentId: number;
        featureId: number;
        taskId: number;
        taskTypeId: number;
        name?: string;
        parameters?: Record<string, unknown>;
        startTime?: number;
        endTime?: number;
        rewardInfo?: Record<string, unknown>;
        extraDescription?: string;
        isPublished?: boolean;
        aaWalletBalance?: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
