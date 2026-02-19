import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export interface ListenMeConfig {
  walletBaseUrl: string;
  aiBaseUrl: string;
  apiKey: string;
  apiSecret: string;
  lang: string;
}

const DEFAULT_WALLET_URL = "https://api-wallet.boxtradex.io/wallet";
const DEFAULT_AI_URL = "https://api-ai.boxtradex.io/ai";

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
    DEFAULT_WALLET_URL;

  const aiBaseUrl =
    process.env.LISTENME_AI_BASE_URL ||
    fileConfig.aiBaseUrl ||
    DEFAULT_AI_URL;

  const apiKey =
    process.env.LISTENME_API_KEY || fileConfig.apiKey || "";

  const apiSecret =
    process.env.LISTENME_API_SECRET || fileConfig.apiSecret || "";

  const lang =
    process.env.LISTENME_LANG || fileConfig.lang || "en";

  return { walletBaseUrl, aiBaseUrl, apiKey, apiSecret, lang };
}

/**
 * Create ~/.listenme/config.json with the given credentials.
 */
export function initConfig(
  apiKey: string,
  apiSecret: string,
  walletBaseUrl?: string,
  aiBaseUrl?: string,
): void {
  if (!apiKey || !apiSecret) {
    console.error(
      "Usage: listenme-mcp init <apiKey> <apiSecret> [walletBaseUrl] [aiBaseUrl]",
    );
    process.exit(1);
  }

  const configDir = join(homedir(), ".listenme");
  const configFile = join(configDir, "config.json");

  mkdirSync(configDir, { recursive: true });

  const config: ListenMeConfig = {
    walletBaseUrl: walletBaseUrl || DEFAULT_WALLET_URL,
    aiBaseUrl: aiBaseUrl || DEFAULT_AI_URL,
    apiKey,
    apiSecret,
    lang: "en",
  };

  writeFileSync(configFile, JSON.stringify(config, null, 2) + "\n");
  console.log(`Config saved to ${configFile}`);
}
