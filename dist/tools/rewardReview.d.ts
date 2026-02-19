import { z } from "zod";
export declare const rewardReviewTool: {
    name: string;
    description: string;
    inputSchema: {
        aiAgentId: z.ZodNumber;
        featureId: z.ZodDefault<z.ZodNumber>;
        taskId: z.ZodNumber;
        approved: z.ZodBoolean;
    };
    handler: (args: {
        aiAgentId: number;
        featureId: number;
        taskId: number;
        approved: boolean;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
