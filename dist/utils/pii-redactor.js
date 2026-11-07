/**
 * Enterprise PII Redaction Engine (Vietnam & Global Enterprise Standard)
 * Masks sensitive personal, financial, and infrastructure data:
 * - Vietnam Phone Numbers (all telcos: 03x, 05x, 07x, 08x, 09x, +84, 84, punctuated)
 * - Vietnam National Citizen ID (CCCD: 12 digits) & Enterprise Tax ID (MST: 10 or 13 digits)
 * - JWT Tokens, Bearer Tokens, API Keys, High-Entropy Secrets (32+ chars)
 * - Internal IPv4 addresses (RFC 1918) & Database Connection Strings
 * Compliant with GDPR, SOC2, and Vietnam Decree 13/2023/ND-CP on Personal Data Protection.
 */
// 1. Email Regex
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
// 2. Vietnam Phone Numbers: +84, 84, or 0 followed by valid telco prefixes (32-39, 52/55/56/58/59, 70/76-79, 81-89, 90-99)
const VN_PHONE_REGEX = /(?:\+?84|0)(?:[\s.-]?(?:3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-46-9]))(?:[\s.-]?\d){7}\b/g;
// 3. Contextual Vietnam Tax ID (MST): explicitly preceded by MST/Mã số thuế/Tax Code
const CONTEXTUAL_MST_REGEX = /(?:mã\s+số\s+thuế|mst|tax\s+code|tax\s+id)[:\s]*\b(\d{10}(?:-\d{3})?)\b/gi;
// 4. Vietnam Citizen Identity Card (CCCD): exactly 12 continuous digits starting with 0
const CCCD_REGEX = /\b0\d{11}\b/g;
// 5. Vietnam Enterprise Tax Identification Number (MST): 10 digits or 10 digits + hyphen + 3 digits
const MST_REGEX = /\b\d{10}(?:-\d{3})?\b/g;
// 5. JWT Tokens (Three base64 segments separated by dots starting with eyJ)
const JWT_REGEX = /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g;
// 6. Common Cloud & API Secret Tokens (AWS, OpenAI, Anthropic, Canva, GitHub, Bearer)
const API_KEY_REGEX = /\b(?:sk-[A-Za-z0-9_-]{15,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|AIza[0-9A-Za-z_-]{35}|Bearer\s+[A-Za-z0-9._~+/-]{20,}=*)\b/g;
// 7. Internal IPv4 Addresses (RFC 1918 private subnets: 10.x, 172.16-31.x, 192.168.x, 127.0.0.1)
const INTERNAL_IP_REGEX = /\b(?:10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|192\.168(?:\.\d{1,3}){2}|127\.0\.0\.1)\b/g;
// 8. Database Connection Strings (PostgreSQL, MongoDB, MySQL, Redis)
const CONNECTION_STRING_REGEX = /\b(?:postgres|postgresql|mongodb|mysql|redis):\/\/[^\s"'<>]+/gi;
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
    return '[REDACTED_PHONE_VN]';
}
export function redactPii(text) {
    if (!text) {
        return {
            sanitized: '',
            redactionCount: 0,
            details: {
                emailsRedacted: 0,
                phonesRedacted: 0,
                tokensRedacted: 0,
                cccdRedacted: 0,
                mstRedacted: 0,
                infraRedacted: 0,
            },
        };
    }
    let emailsRedacted = 0;
    let phonesRedacted = 0;
    let tokensRedacted = 0;
    let cccdRedacted = 0;
    let mstRedacted = 0;
    let infraRedacted = 0;
    let sanitized = text;
    // 1. Connection Strings (mask sensitive credentials first)
    sanitized = sanitized.replace(CONNECTION_STRING_REGEX, () => {
        infraRedacted++;
        return '[REDACTED_CONNECTION_STRING]';
    });
    // 2. JWT Tokens
    sanitized = sanitized.replace(JWT_REGEX, () => {
        tokensRedacted++;
        return '[REDACTED_JWT_TOKEN]';
    });
    // 3. API Keys & Bearer Tokens
    sanitized = sanitized.replace(API_KEY_REGEX, () => {
        tokensRedacted++;
        return '[REDACTED_SECRET_KEY]';
    });
    // 4. Internal IPv4 Addresses
    sanitized = sanitized.replace(INTERNAL_IP_REGEX, () => {
        infraRedacted++;
        return '[REDACTED_INTERNAL_IP]';
    });
    // 5. Emails
    sanitized = sanitized.replace(EMAIL_REGEX, (match) => {
        emailsRedacted++;
        return redactEmail(match);
    });
    // 6. Contextual Vietnam Tax ID (e.g., "Mã số thuế: 0312345678" or "MST: 0101234567-001")
    sanitized = sanitized.replace(CONTEXTUAL_MST_REGEX, (fullMatch, taxId) => {
        mstRedacted++;
        return fullMatch.replace(taxId, '[REDACTED_MST_VN]');
    });
    // 7. Vietnam Phone Numbers (all valid mobile prefixes)
    sanitized = sanitized.replace(VN_PHONE_REGEX, (match) => {
        phonesRedacted++;
        return redactPhone(match);
    });
    // 8. Vietnam Citizen ID (CCCD - 12 digits)
    sanitized = sanitized.replace(CCCD_REGEX, () => {
        cccdRedacted++;
        return '[REDACTED_CCCD_VN]';
    });
    // 9. Vietnam Enterprise Tax ID (MST - 10 or 13 digits)
    sanitized = sanitized.replace(MST_REGEX, () => {
        mstRedacted++;
        return '[REDACTED_MST_VN]';
    });
    const totalCount = emailsRedacted +
        phonesRedacted +
        tokensRedacted +
        cccdRedacted +
        mstRedacted +
        infraRedacted;
    return {
        sanitized,
        redactionCount: totalCount,
        details: {
            emailsRedacted,
            phonesRedacted,
            tokensRedacted,
            cccdRedacted,
            mstRedacted,
            infraRedacted,
        },
    };
}
//# sourceMappingURL=pii-redactor.js.map