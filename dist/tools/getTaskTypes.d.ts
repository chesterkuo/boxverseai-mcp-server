import { z } from "zod";
export declare const getTaskTypesTool: {
    name: string;
    description: string;
    inputSchema: {
        aiAgentId: z.ZodNumber;
        featureId: z.ZodDefault<z.ZodNumber>;
    };
    handler: (args: {
        aiAgentId: number;
        featureId: number;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
