export interface TastePalette {
    id: string;
    name: string;
    tags: string[];
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    accentInk: string;
    secondary?: string;
    gold?: string;
    note?: string;
}
export interface RGB {
    r: number;
    g: number;
    b: number;
}
export declare function hexToRgb(hex: string): RGB;
export declare const TASTE_PALETTES: Record<string, TastePalette>;
export declare const DEFAULT_PALETTE_ID = "corporate-navy";
export declare function getTastePalette(idOrName?: string): TastePalette;
export declare function listTastePalettes(tagFilter?: string): TastePalette[];
export declare function registerDynamicPalette(palette: TastePalette): TastePalette;
export declare function syncCanvaBrandKitPalette(brandKit: {
    id?: string;
    name?: string;
    colors?: Array<{
        hex: string;
    }>;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
}): TastePalette;
