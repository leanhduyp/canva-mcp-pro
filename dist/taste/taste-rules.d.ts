import { TastePalette } from "./palettes.js";
export interface TypographySpec {
    fontFamily: string;
    fontFamilyBold: string;
    slideTitlePt: number;
    subtitlePt: number;
    cardTitlePt: number;
    bodyPt: number;
    heroMetricPt: number;
    badgePt: number;
    presenterBadgePt: number;
}
export declare const PRESENTATION_TYPOGRAPHY: TypographySpec;
export declare const SLOP_BUZZWORDS: string[];
export interface CopyValidationResult {
    valid: boolean;
    score: number;
    slopDetected: string[];
    hasHardFact: boolean;
    wordCount: number;
    warnings: string[];
    suggestions: string[];
}
export declare function validateSlideCopy(texts: string[]): CopyValidationResult;
export interface CardStyleSpec {
    fillColorHex: string;
    borderColorHex: string;
    borderWidthPt: number;
    titleColorHex: string;
    bodyColorHex: string;
    accentColorHex: string;
    isHero: boolean;
}
export declare function computeCardStyle(palette: TastePalette, isHero?: boolean, status?: "normal" | "success" | "warning" | "danger"): CardStyleSpec;
