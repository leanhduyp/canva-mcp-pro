export interface SlideAuditResult {
    slideNumber: number;
    title: string;
    hasPresenterBadge: boolean;
    presenterFound?: string;
    minFontSizePt: number;
    smallFontViolations: Array<{
        shapeName: string;
        fontSizePt: number;
        textSample: string;
    }>;
    slopDetected: string[];
    hasHardFact: boolean;
    wordCount: number;
    score: number;
    status: "EXCELLENT" | "PASSED" | "NEEDS_IMPROVEMENT";
    issues: string[];
    recommendations: string[];
}
export interface DeckAuditReport {
    presentationPath: string;
    totalSlides: number;
    deckScore: number;
    overallStatus: "EXCELLENT" | "PASSED" | "NEEDS_IMPROVEMENT";
    statistics: {
        compliantSlides: number;
        slidesWithSmallFont: number[];
        slidesWithSlop: number[];
        slidesMissingPresenter: number[];
        slidesLackingHardFacts: number[];
    };
    slides: SlideAuditResult[];
    executiveSummary: string[];
    prioritizedActionPlan: string[];
}
export declare function auditEntireDeck(presentationPath: string): Promise<DeckAuditReport>;
