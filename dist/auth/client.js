import { loadConfig } from "./config.js";
import { getSign } from "../utils/sign.js";
let configCache = null;
function getConfig() {
    if (!configCache) {
        configCache = loadConfig();
    }
    return configCache;
}
/**
 * Build headers for an authenticated API request.
 * The sign is computed from the merged set of:
 *   - query params (for GET)
 *   - body params (for POST/PUT/DELETE)
 *   - path variables (extracted by caller and passed as signParams)
 */
function buildHeaders(signParams) {
    const config = getConfig();
    if (!config.apiKey || !config.apiSecret) {
        throw new Error("Missing LISTENME_API_KEY or LISTENME_API_SECRET. " +
            "Set them as environment variables or in ~/.listenme/config.json");
    }
    return {
        "X-Api-Key": config.apiKey,
        "X-Api-Sign": getSign(signParams, config.apiSecret),
        "Content-Type": "application/json",
        lang: config.lang,
    };
}
/**
 * Make an authenticated request to the wallet API.
 */
export async function walletRequest(method, path, options) {
    const config = getConfig();
    return apiRequest(config.walletBaseUrl, method, path, options);
}
/**
 * Make an authenticated request to the AI API.
 */
export async function aiRequest(method, path, options) {
    const config = getConfig();
    return apiRequest(config.aiBaseUrl, method, path, options);
}
async function apiRequest(baseUrl, method, path, options) {
    const { params, body, signParams } = options ?? {};
    // Build the sign from explicit signParams, or fall back to merging params + body
    const mergedSignParams = {
        ...(signParams ?? { ...params, ...body }),
    };
    const headers = buildHeaders(mergedSignParams);
    // Build URL: concatenate baseUrl + path (baseUrl may contain path prefix like /wallet)
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${normalizedBase}${normalizedPath}`);
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        }
    }
    const fetchOptions = {
        method,
        headers,
    };
    if (body && (method === "POST" || method === "PUT" || method === "DELETE")) {
        fetchOptions.body = JSON.stringify(body);
    }
    const response = await fetch(url.toString(), fetchOptions);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
    }
    return (await response.json());
}
