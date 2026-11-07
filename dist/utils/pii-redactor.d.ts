/**
 * Enterprise PII Redaction Engine (Vietnam & Global Enterprise Standard)
 * Masks sensitive personal, financial, and infrastructure data:
 * - Vietnam Phone Numbers (all telcos: 03x, 05x, 07x, 08x, 09x, +84, 84, punctuated)
 * - Vietnam National Citizen ID (CCCD: 12 digits) & Enterprise Tax ID (MST: 10 or 13 digits)
 * - JWT Tokens, Bearer Tokens, API Keys, High-Entropy Secrets (32+ chars)
 * - Internal IPv4 addresses (RFC 1918) & Database Connection Strings
 * Compliant with GDPR, SOC2, and Vietnam Decree 13/2023/ND-CP on Personal Data Protection.
 */
export interface RedactionResult {
    sanitized: string;
    redactionCount: number;
    details: {
        emailsRedacted: number;
        phonesRedacted: number;
        tokensRedacted: number;
        cccdRedacted: number;
        mstRedacted: number;
        infraRedacted: number;
    };
}
export declare function redactEmail(email: string): string;
export declare function redactPhone(phone: string): string;
export declare function redactPii(text: string): RedactionResult;
