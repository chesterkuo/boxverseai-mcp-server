import { z } from "zod";
export declare const getFeedbackListTool: {
    name: string;
    description: string;
    inputSchema: {
        taskId: z.ZodString;
        pageNum: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        startTime: z.ZodOptional<z.ZodNumber>;
        endTime: z.ZodOptional<z.ZodNumber>;
        isHighlighted: z.ZodOptional<z.ZodBoolean>;
        isParticipate: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        feedbackLogId: z.ZodOptional<z.ZodString>;
    };
    handler: (args: {
        taskId: string;
        pageNum: number;
        pageSize: number;
        startTime?: number;
        endTime?: number;
        isHighlighted?: boolean;
        isParticipate?: boolean;
        feedbackLogId?: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
