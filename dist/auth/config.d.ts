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
export declare function loadConfig(): ListenMeConfig;
