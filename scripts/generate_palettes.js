import fs from "fs";
import path from "path";

const sourcePath = "C:/Users/mrduy/.gemini/config/skills/taste-skill/library/palettes.json";
const targetPath = "C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/src/taste/palettes.ts";

const raw = fs.readFileSync(sourcePath, "utf8");
const palettes = JSON.parse(raw);

// Add IUH brand palette
const iuhBrand = {
  id: "iuh-brand",
  name: "IUH Official Brand (Blue & Gold)",
  tags: ["brand", "academic", "corporate", "light-neutral"],
  bg: "#ffffff",
  surface: "#f8fafc",
  ink: "#102452",
  muted: "#475569",
  accent: "#153898",
  accentInk: "#ffffff",
  secondary: "#00b0f0", // Cyan for Duy's presenter badge & high-contrast highlights
  gold: "#f4b400",      // Gold/amber for warnings & badges
  note: "Bảng màu chuẩn đại học Công Nghiệp TP.HCM (IUH): Xanh đậm học thuật (#153898), Nền sáng dịu mắt (#f8fafc), Chữ xanh đen đậm nét (#102452), Huy hiệu Cyan (#00B0F0) và Điểm nhấn Vàng Hoàng Gia (#F4B400)."
};

// All palettes map
const all = [iuhBrand, ...palettes];

const code = `// Auto-generated from taste-skill palettes.json & IUH brand standards.
// Do not edit directly; regenerate via scripts/generate_palettes.js

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

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "").trim();
  const fullHex = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export const TASTE_PALETTES: Record<string, TastePalette> = ${JSON.stringify(
  all.reduce((acc, p) => {
    acc[p.id] = {
      id: p.id,
      name: p.name,
      tags: p.tags || [],
      bg: p.bg,
      surface: p.surface,
      ink: p.ink,
      muted: p.muted,
      accent: p.accent,
      accentInk: p.accentInk,
      ...(p.secondary ? { secondary: p.secondary } : {}),
      ...(p.gold ? { gold: p.gold } : {}),
      ...(p.note ? { note: p.note } : {}),
    };
    return acc;
  }, {}),
  null,
  2
)};

export const DEFAULT_PALETTE_ID = "iuh-brand";

export function getTastePalette(idOrName?: string): TastePalette {
  if (!idOrName) {
    return TASTE_PALETTES[DEFAULT_PALETTE_ID];
  }
  const clean = idOrName.toLowerCase().trim();
  if (TASTE_PALETTES[clean]) {
    return TASTE_PALETTES[clean];
  }
  // Search by name match
  const found = Object.values(TASTE_PALETTES).find(
    (p) => p.name.toLowerCase().includes(clean) || p.id.includes(clean)
  );
  return found || TASTE_PALETTES[DEFAULT_PALETTE_ID];
}

export function listTastePalettes(tagFilter?: string): TastePalette[] {
  const list = Object.values(TASTE_PALETTES);
  if (!tagFilter) return list;
  const filter = tagFilter.toLowerCase().trim();
  return list.filter((p) => p.tags.some((t) => t.toLowerCase().includes(filter)));
}
`;

fs.writeFileSync(targetPath, code, "utf8");
console.log(`Generated ${all.length} palettes into ${targetPath}`);
