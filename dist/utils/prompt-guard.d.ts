/**
 * Enterprise Prompt Injection Guard & Untrusted Delimiter Sanitizer
 * Protects LLM context from Indirect Prompt Injection attacks in external comments:
 * - Unicode NFKC normalization
 * - Zero-Width Character stripping (invisible character evasion attacks)
 * - Strict Delimiter Breakout Prevention (escapes closing tags like </untrusted_user_comment>)
 * - Bilingual Heuristic Detection (English & Vietnamese with and without accents)
 */
export declare const INJECTION_PATTERNS: RegExp[];
export interface GuardAnalysisResult {
    isSafe: boolean;
    sanitizedText: string;
    detectedViolations: string[];
    rawNormalizedText: string;
}
/**
 * Normalizes Unicode, removes invisible evasion characters,
 * and neutralizes delimiter breakout tags.
 */
export declare function sanitizeDelimiters(text: string, tagName?: string): string;
/**
 * Comprehensive Prompt Injection Scanner with Bilingual Heuristic Patterns
 */
export declare function inspectPromptInjection(text: string): GuardAnalysisResult;
