/**
 * PII Redaction Utility for Enterprise Data Safety
 * Masks sensitive user data (Emails, Phone numbers, API Keys, Tokens)
 * Compliant with GDPR, SOC2, and Enterprise AI Safety Standards
 */
// Regex Patterns
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}\b/g;
const TOKEN_REGEX = /\b(?:sk-[A-Za-z0-9-_]{15,}|Bearer\s+[A-Za-z0-9._~+/-]+=*|ghp_[A-Za-z0-9]{36}|AIza[0-9A-Za-z-_]{35})\b/g;
export function redactEmail(email) {
    const parts = email.split('@');
    if (parts.length !== 2)
        return '[REDACTED_EMAIL]';
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) {
        return `*@${domain}`;
    }
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
}
export function redactPhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 8)
        return phone; // Don't mask short numbers like years/dates
    return '[REDACTED_PHONE]';
}
export function redactPii(text) {
    if (!text) {
        return {
            sanitized: '',
            redactionCount: 0,
            details: { emailsRedacted: 0, phonesRedacted: 0, tokensRedacted: 0 },
        };
    }
    let emailsRedacted = 0;
    let phonesRedacted = 0;
    let tokensRedacted = 0;
    // 1. Redact API Keys / Tokens
    let sanitized = text.replace(TOKEN_REGEX, () => {
        tokensRedacted++;
        return '[REDACTED_SECRET_KEY]';
    });
    // 2. Redact Emails
    sanitized = sanitized.replace(EMAIL_REGEX, (match) => {
        emailsRedacted++;
        return redactEmail(match);
    });
    // 3. Redact Phone numbers (cẩn trọng tránh nhầm lẫn với số năm ví dụ 2026)
    sanitized = sanitized.replace(PHONE_REGEX, (match) => {
        const digits = match.replace(/\D/g, '');
        if (digits.length >= 9 && digits.length <= 13) {
            phonesRedacted++;
            return '[REDACTED_PHONE]';
        }
        return match;
    });
    const totalCount = emailsRedacted + phonesRedacted + tokensRedacted;
    return {
        sanitized,
        redactionCount: totalCount,
        details: {
            emailsRedacted,
            phonesRedacted,
            tokensRedacted,
        },
    };
}
//# sourceMappingURL=pii-redactor.js.map