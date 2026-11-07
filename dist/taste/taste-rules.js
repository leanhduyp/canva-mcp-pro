export const PRESENTATION_TYPOGRAPHY = {
    fontFamily: "Bai Jamjuree",
    fontFamilyBold: "Bai Jamjuree Bold",
    slideTitlePt: 35,
    subtitlePt: 24,
    cardTitlePt: 26,
    bodyPt: 24,
    heroMetricPt: 56,
    badgePt: 22,
    presenterBadgePt: 44,
};
/**
 * Enterprise Dense Table / Architecture Topology Typography Spec
 * Provides flexibility for complex matrices, tables, and system architectures (14pt-18pt floor)
 */
export const DENSE_TABLE_TYPOGRAPHY = {
    fontFamily: "Bai Jamjuree",
    fontFamilyBold: "Bai Jamjuree Bold",
    slideTitlePt: 35,
    subtitlePt: 22,
    cardTitlePt: 20,
    bodyPt: 16,
    heroMetricPt: 44,
    badgePt: 16,
    presenterBadgePt: 44,
};
// Anti-slop buzzwords from taste-skill copy principles
export const SLOP_BUZZWORDS = [
    "revolutionary",
    "game-changing",
    "seamlessly",
    "delve",
    "supercharge",
    "unleash",
    "tapestry",
    "testament",
    "cutting-edge",
    "beacon",
    "pinnacle",
    "elevate",
    "unlock the power",
    "transformative",
    "paradigm shift",
    "synergy",
    "holistic",
    "state-of-the-art",
];
export function validateSlideCopy(texts) {
    const combined = texts.join(" ");
    const lower = combined.toLowerCase();
    const words = combined.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const slopDetected = [];
    for (const slop of SLOP_BUZZWORDS) {
        if (lower.includes(slop)) {
            slopDetected.push(slop);
        }
    }
    // Check for hard facts: numbers, %, dates, units (MB, ms, GB, $, €)
    const hasHardFact = /\b(\d+(\.\d+)?%?|\$\d+|\d+\s*(ms|s|mb|gb|kb|x))\b/i.test(combined);
    const warnings = [];
    const suggestions = [];
    if (slopDetected.length > 0) {
        warnings.push(`Phát hiện từ ngữ sáo rỗng (AI Slop): ${slopDetected.join(", ")}.`);
        suggestions.push("Thay thế bằng danh từ cụ thể, hành động trực tiếp và số liệu kiểm chứng.");
    }
    if (!hasHardFact) {
        warnings.push("Thiếu số liệu hoặc bằng chứng cụ thể (Hard Fact) trên slide.");
        suggestions.push("Thêm ít nhất 1 con số, tỷ lệ % hoặc đơn vị đo lường cụ thể.");
    }
    if (wordCount > 110) {
        warnings.push(`Mật độ chữ quá cao (${wordCount} từ). Chuẩn trình chiếu Taste-Skill khuyến nghị dưới 90 từ.`);
        suggestions.push("Cắt bỏ câu văn dài dòng, tóm tắt ý chính thành các gạch đầu dòng súc tích.");
    }
    let score = 100;
    score -= slopDetected.length * 15;
    if (!hasHardFact)
        score -= 20;
    if (wordCount > 110)
        score -= 15;
    score = Math.max(0, score);
    return {
        valid: slopDetected.length === 0 && wordCount <= 120,
        score,
        slopDetected,
        hasHardFact,
        wordCount,
        warnings,
        suggestions,
    };
}
export function computeCardStyle(palette, isHero = false, status) {
    // If specific alert status
    if (status === "success") {
        return {
            fillColorHex: "#F0FDF4",
            borderColorHex: "#22C55E",
            borderWidthPt: isHero ? 3.0 : 2.0,
            titleColorHex: "#15803D",
            bodyColorHex: "#14532D",
            accentColorHex: "#16A34A",
            isHero,
        };
    }
    if (status === "danger") {
        return {
            fillColorHex: "#FEF2F2",
            borderColorHex: "#F87171",
            borderWidthPt: isHero ? 3.0 : 2.0,
            titleColorHex: "#B91C1C",
            bodyColorHex: "#7F1D1D",
            accentColorHex: "#DC2626",
            isHero,
        };
    }
    if (status === "warning") {
        return {
            fillColorHex: "#FFFBEB",
            borderColorHex: palette.gold || "#FCD34D",
            borderWidthPt: isHero ? 3.0 : 2.0,
            titleColorHex: "#92400E",
            bodyColorHex: "#78350F",
            accentColorHex: palette.gold || "#D97706",
            isHero,
        };
    }
    // Hero card styling (taste-skill card principles)
    if (isHero) {
        return {
            fillColorHex: palette.surface,
            borderColorHex: palette.accent,
            borderWidthPt: 3.0,
            titleColorHex: palette.accent,
            bodyColorHex: palette.ink,
            accentColorHex: palette.accent,
            isHero: true,
        };
    }
    // Standard clean card
    return {
        fillColorHex: palette.surface,
        borderColorHex: palette.muted,
        borderWidthPt: 1.5,
        titleColorHex: palette.ink,
        bodyColorHex: palette.ink,
        accentColorHex: palette.accent,
        isHero: false,
    };
}
//# sourceMappingURL=taste-rules.js.map