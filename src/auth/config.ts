import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export interface ListenMeConfig {
  walletBaseUrl: string;
  aiBaseUrl: string;
  apiKey: string;
  apiSecret: string;
  lang: string;
}

/**
 * Load configuration from environment variables, falling back to
 * ~/.listenme/config.json if env vars are not set.
 */
export function loadConfig(): ListenMeConfig {
  let fileConfig: Partial<ListenMeConfig> = {};

  const configPath = join(homedir(), ".listenme", "config.json");
  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, "utf-8");
      fileConfig = JSON.parse(raw);
    } catch {
      // ignore parse errors
    }
  }

  const walletBaseUrl =
    process.env.LISTENME_WALLET_BASE_URL ||
    fileConfig.walletBaseUrl ||
    "https://api.boxverse.ai/wallet";

  const aiBaseUrl =
    process.env.LISTENME_AI_BASE_URL ||
    fileConfig.aiBaseUrl ||
    "https://api.boxverse.ai/ai";

  const apiKey =
    process.env.LISTENME_API_KEY || fileConfig.apiKey || "";

  const apiSecret =
    process.env.LISTENME_API_SECRET || fileConfig.apiSecret || "";

  const lang =
    process.env.LISTENME_LANG || fileConfig.lang || "en";

  return { walletBaseUrl, aiBaseUrl, apiKey, apiSecret, lang };
}
