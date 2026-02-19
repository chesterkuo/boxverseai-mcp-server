import { z } from "zod";
import { walletRequest } from "../auth/client.js";

export const createTaskTool = {
  name: "listenme_create_task",
  description:
    "Create a new ListenME product research task. Returns the created task ID. " +
    "The task will be in draft status unless isPublished=true. " +
    "Parameters should include domain, productUrl, explanation, question array, language, etc.",
  inputSchema: {
    aiAgentId: z.number().describe("The AI agent ID"),
    featureId: z.number().default(4).describe("Feature ID (4 = ListenME)"),
    taskTypeId: z.number().default(7).describe("Task type ID (7 = ListenME survey)"),
    name: z.string().describe("Task name"),
    parameters: z.record(z.unknown()).describe(
      "Task parameters object containing: domain (string), productUrl (string), " +
      "explanation (string), question (string[]), context ({type, value}), " +
      "brandName (string), socialLink ({platform, url}), language (string), " +
      "idealDurationMin (number), invitationLimit (number), topics (array), " +
      "recruitmentType (1=self, 2=Boxverse), criteriaInfo (object)"
    ),
    startTime: z.number().optional().describe("Start time in Unix milliseconds"),
    endTime: z.number().optional().describe("End time in Unix milliseconds"),
    rewardInfo: z.record(z.unknown()).optional().describe(
      "Reward configuration: chainId, tokenAddress, tokenSymbol, amount, limit, currency"
    ),
    extraDescription: z.string().optional().describe("Additional task description"),
    isPublished: z.boolean().optional().describe("Whether to publish immediately"),
    aaWalletBalance: z.string().optional().default("0").describe("AA wallet balance"),
  },
  handler: async (args: {
    aiAgentId: number;
    featureId: number;
    taskTypeId: number;
    name: string;
    parameters: Record<string, unknown>;
    startTime?: number;
    endTime?: number;
    rewardInfo?: Record<string, unknown>;
    extraDescription?: string;
    isPublished?: boolean;
    aaWalletBalance?: string;
  }) => {
    const { aiAgentId, featureId, ...body } = args;
    const path = `/v1/ai-agent/${aiAgentId}/feature/${featureId}/task`;

    // Build sign params: include path variables + body fields
    const signParams: Record<string, unknown> = {
      aiAgentId,
      featureId,
      ...body,
      parameters: convertToString(body.parameters),
    };
    if (body.rewardInfo && !body.extraDescription) {
      signParams.rewardInfo = convertToString(body.rewardInfo);
    }

    const res = await walletRequest<number>("POST", path, {
      body: body as Record<string, unknown>,
      signParams,
    });

    if (res.code < 0) {
      return { content: [{ type: "text" as const, text: `Error (code ${res.code}): ${res.msg ?? res.message}` }] };
    }
    return { content: [{ type: "text" as const, text: `Task created successfully. Task ID: ${res.data}` }] };
  },
};

/** Convert nested objects to a deterministic string for signing (matches frontend convertToString) */
function convertToString(obj: unknown): string {
  if (Array.isArray(obj)) {
    let result = "[";
    for (const item of obj) {
      result += convertToString(item) + ",";
    }
    if (obj.length) result = result.slice(0, -1);
    result += "]";
    return result;
  }
  if (obj !== null && typeof obj === "object") {
    let result = "{";
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      let strValue: string;
      if (value !== null && typeof value === "object") {
        strValue = convertToString(value);
      } else {
        strValue = String(value).replace(/ /g, "");
      }
      result += `${key}=${strValue},`;
    }
    result = result.slice(0, -1) + "}";
    return result;
  }
  return String(obj).replace(/ /g, "");
}
