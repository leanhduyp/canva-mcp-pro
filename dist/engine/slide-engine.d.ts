import { TastePalette } from "../taste/palettes.js";
export interface KpiSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitleContext?: string;
    presenter?: string;
    palette?: TastePalette;
    kpiMetrics: Array<{
        label: string;
        value: string;
        subtext: string;
        status?: "normal" | "success" | "warning" | "danger";
    }>;
    diagnosticBoxes?: Array<{
        title: string;
        body: string;
        type?: "warning" | "solution" | "insight" | "methodology";
    }>;
}
export interface ComparisonSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    presenter?: string;
    palette?: TastePalette;
    columns: Array<{
        badge: string;
        isHero?: boolean;
        heroAccentColor?: string;
        paramLabel?: string;
        paramVal: string;
        valScore: string;
        struct: string;
        impact: string;
        desc: string;
    }>;
    bottomTakeaway?: string;
}
export interface SplitSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    presenter?: string;
    palette?: TastePalette;
    leftPanel: {
        header: string;
        headerColor?: string;
        points: Array<{
            title: string;
            desc: string;
        }>;
    };
    rightPanel: {
        header: string;
        headerColor?: string;
        points: Array<{
            title: string;
            desc: string;
        }>;
    };
    bottomBanner?: {
        prefix: string;
        content: string;
    };
}
export interface PipelineSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitleContext?: string;
    presenter?: string;
    palette?: TastePalette;
    steps: Array<{
        stepNumber: string;
        title: string;
        desc: string;
        tag?: string;
        isHero?: boolean;
    }>;
    bottomTakeaway?: string;
}
export interface ConfusionMatrixConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitleContext?: string;
    presenter?: string;
    palette?: TastePalette;
    matrix: {
        tp: {
            value: string | number;
            label: string;
            desc?: string;
        };
        tn: {
            value: string | number;
            label: string;
            desc?: string;
        };
        fp: {
            value: string | number;
            label: string;
            desc?: string;
        };
        fn: {
            value: string | number;
            label: string;
            desc?: string;
        };
    };
    metrics: Array<{
        label: string;
        value: string;
        subtext?: string;
        status?: "normal" | "success" | "warning";
    }>;
    clinicalInsight?: {
        title: string;
        body: string;
    };
    bottomTakeaway?: string;
}
export interface NativeChartConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitleContext?: string;
    presenter?: string;
    palette?: TastePalette;
    chartType: "line" | "column" | "bar";
    categories: string[];
    series: Array<{
        name: string;
        values: number[];
    }>;
    sidePanel: {
        header: string;
        points: Array<{
            title: string;
            desc: string;
        }>;
    };
    bottomTakeaway?: string;
}
export interface TimelineSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitleContext?: string;
    presenter?: string;
    palette?: TastePalette;
    steps: Array<{
        stepNumber: number | string;
        label: string;
        description: string;
        isHero?: boolean;
    }>;
    bottomTakeaway?: string;
}
export interface SwotSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitleContext?: string;
    presenter?: string;
    palette?: TastePalette;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    bottomTakeaway?: string;
}
export interface TeamGridSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitleContext?: string;
    presenter?: string;
    palette?: TastePalette;
    members: Array<{
        name: string;
        role: string;
        avatarUrl?: string;
        bio?: string;
    }>;
    bottomTakeaway?: string;
}
export interface CoverSlideConfig {
    presentationPath: string;
    slideNumber: number;
    title: string;
    subtitle?: string;
    presenter?: string;
    palette?: TastePalette;
    department?: string;
    metaTags?: string[];
}
export declare class SlideEngine {
    private tempDir;
    constructor();
    private ensureTempDir;
    exportThumbnail(presentationPath: string, slideNumber: number, outputPath?: string): Promise<string>;
    private getPythonPalettePreamble;
    buildKpiDashboard(config: KpiSlideConfig): Promise<string>;
    buildComparisonMatrix(config: ComparisonSlideConfig): Promise<string>;
    buildSplitArchitecture(config: SplitSlideConfig): Promise<string>;
    buildPipelineSlide(config: PipelineSlideConfig): Promise<string>;
    buildConfusionMatrix(config: ConfusionMatrixConfig): Promise<string>;
    buildNativeChart(config: NativeChartConfig): Promise<string>;
    buildProcessTimeline(config: TimelineSlideConfig): Promise<string>;
    buildSwotMatrix(config: SwotSlideConfig): Promise<string>;
    buildTeamGrid(config: TeamGridSlideConfig): Promise<string>;
    buildCoverSlide(config: CoverSlideConfig): Promise<string>;
    trimSlides(presentationPath: string, maxSlides?: number): Promise<void>;
}
