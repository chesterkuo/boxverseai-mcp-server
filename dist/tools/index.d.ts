import type { ZodRawShape } from "zod";
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: ZodRawShape;
    handler: (args: any) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError?: boolean;
    }>;
}
export declare const allTools: ToolDefinition[];
