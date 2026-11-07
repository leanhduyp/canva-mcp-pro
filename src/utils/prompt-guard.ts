/**
 * Enterprise Prompt Injection Guard & Untrusted Delimiter Sanitizer
 * Protects LLM context from Indirect Prompt Injection attacks in external comments:
 * - Unicode NFKC normalization
 * - Zero-Width Character stripping (invisible character evasion attacks)
 * - Strict Delimiter Breakout Prevention (escapes closing tags like </untrusted_user_comment>)
 * - Bilingual Heuristic Detection (English & Vietnamese with and without accents)
 */

// Zero-width characters and invisible control characters used in evasion attacks
const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g;

// Vietnamese & English Prompt Injection Heuristic Patterns
export const INJECTION_PATTERNS = [
  // English Patterns
  /ignore\s+(?:all\s+)?previous\s+instructions/i,
  /system\s+prompt/i,
  /(?:execute|run)\s+(?:script|code|command|shell)/i,
  /os\.system/i,
  /subprocess/i,
  /(?:rm\s+-rf|del\s+\/f)/i,
  /(?:curl|wget)\s+http/i,
  /__subclasses__/i,
  /__builtins__/i,
  /new\s+role/i,
  /you\s+are\s+now/i,
  /bypass\s+(?:security|filter)/i,

  // Vietnamese Patterns (Có dấu)
  /bỏ\s+qua\s+(?:mọi\s+)?hướng\s+dẫn/i,
  /bỏ\s+qua\s+các\s+lệnh\s+trước/i,
  /quên\s+(?:hết\s+)?các\s+quy\s+tắc/i,
  /thực\s+thi\s+mã/i,
  /chạy\s+lệnh/i,
  /in\s+ra\s+cấu\s+hình/i,
  /hiển\s+thị\s+system\s+prompt/i,
  /xóa\s+toàn\s+bộ/i,
  /ghi\s+đè\s+hệ\s+thống/i,
  /vai\s+trò\s+mới/i,
  /chiếm\s+quyền/i,

  // Vietnamese Patterns (Không dấu)
  /bo\s+qua\s+(?:moi\s+)?huong\s+dan/i,
  /bo\s+qua\s+cac\s+lenh\s+truoc/i,
  /quen\s+(?:het\s+)?cac\s+quy\s+tac/i,
  /thuc\s+thi\s+ma/i,
  /chay\s+lenh/i,
  /in\s+ra\s+cau\s+hinh/i,
  /hien\s+thi\s+system\s+prompt/i,
  /xoa\s+toan\s+bo/i,
  /ghi\s+de\s+he\s+thong/i,
  /vai\s+tro\s+moi/i,
];

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
export function sanitizeDelimiters(text: string, tagName: string = "untrusted_user_comment"): string {
  if (!text) return "";

  // 1. NFKC Unicode normalization
  let normalized = text.normalize("NFKC");

  // 2. Strip Zero-Width and hidden evasion characters
  normalized = normalized.replace(ZERO_WIDTH_REGEX, "");

  // 3. Delimiter Breakout Prevention: neutralize any occurrence of closing tags
  const closingTagRegex = new RegExp(`</\\s*${tagName}[^>]*>`, "gi");
  normalized = normalized.replace(closingTagRegex, `[SANITIZED_TAG: /${tagName}]`);

  // Also escape generic XML/HTML tags that could prematurely close boundary
  normalized = normalized.replace(/<\/\s*untrusted[^>]*>/gi, "[SANITIZED_TAG: /untrusted]");

  return normalized;
}

/**
 * Comprehensive Prompt Injection Scanner with Bilingual Heuristic Patterns
 */
export function inspectPromptInjection(text: string): GuardAnalysisResult {
  if (!text) {
    return {
      isSafe: true,
      sanitizedText: "",
      detectedViolations: [],
      rawNormalizedText: "",
    };
  }

  // Sanitize delimiters & normalize
  const sanitized = sanitizeDelimiters(text);

  // Scan against attack patterns
  const detectedViolations: string[] = [];
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      detectedViolations.push(pattern.source);
    }
  }

  return {
    isSafe: detectedViolations.length === 0,
    sanitizedText: sanitized,
    detectedViolations,
    rawNormalizedText: sanitized,
  };
}
