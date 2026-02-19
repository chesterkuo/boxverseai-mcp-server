export interface ApiResponse<T = unknown> {
    code: number;
    msg: string | null;
    message?: string;
    data: T;
    totalCount?: number;
    totalPage?: number;
}
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
/**
 * Make an authenticated request to the wallet API.
 */
export declare function walletRequest<T = unknown>(method: HttpMethod, path: string, options?: {
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    signParams?: Record<string, unknown>;
}): Promise<ApiResponse<T>>;
/**
 * Make an authenticated request to the AI API.
 */
export declare function aiRequest<T = unknown>(method: HttpMethod, path: string, options?: {
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    signParams?: Record<string, unknown>;
}): Promise<ApiResponse<T>>;
export {};
