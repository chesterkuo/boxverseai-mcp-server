/**
 * Generate API signature compatible with the backend AbstractSignedApiInterceptor.
 *
 * Algorithm (matching frontend ApiSignGenerator.tsx + backend SignUtil.signBySha256):
 * 1. Sort all param keys alphabetically (TreeMap on backend)
 * 2. Concatenate values in sorted key order:
 *    - null/undefined: skip
 *    - Array: "[val1, val2]" (with spaces after commas)
 *    - Object: JSON.stringify()
 *    - Primitive: .toString()
 * 3. Append apiKeySecret
 * 4. SHA-256 hex digest
 */
export declare function getSign(params: Record<string, unknown>, secret: string): string;
