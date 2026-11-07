/**
 * PII Redaction Utility for Enterprise Data Safety
 * Masks sensitive user data (Emails, Phone numbers, API Keys, Tokens)
 * Compliant with GDPR, SOC2, and Enterprise AI Safety Standards
 */
export interface RedactionResult {
    sanitized: string;
    redactionCount: number;
    details: {
        emailsRedacted: number;
        phonesRedacted: number;
        tokensRedacted: number;
    };
}
export declare function redactEmail(email: string): string;
export declare function redactPhone(phone: string): string;
export declare function redactPii(text: string): RedactionResult;
