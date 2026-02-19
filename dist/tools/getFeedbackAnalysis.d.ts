import { z } from "zod";
export declare const getFeedbackAnalysisTool: {
    name: string;
    description: string;
    inputSchema: {
        taskId: z.ZodString;
        analyzeType: z.ZodNumber;
        timeZone: z.ZodDefault<z.ZodNumber>;
        startTime: z.ZodOptional<z.ZodNumber>;
        endTime: z.ZodOptional<z.ZodNumber>;
    };
    handler: (args: {
        taskId: string;
        analyzeType: number;
        timeZone: number;
        startTime?: number;
        endTime?: number;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
