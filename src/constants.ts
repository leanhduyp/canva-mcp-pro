import path from "path";

export const CANVA_API_BASE_URL = "https://api.canva.com/rest/v1";

export const DEFAULT_THEME = {
  primaryColor: "#153898",      // Navy Blue
  secondaryColor: "#00B0F0",    // Cyan Accent
  accentColor: "#F4B400",       // Gold
  backgroundColor: "#F8FAFC",   // Clean Slate-50
  textColor: "#0F172A",         // High Contrast Slate-900
  titleFont: "Bai Jamjuree Bold",
  bodyFont: "Bai Jamjuree",
  presenterFont: "Calibri",
};

export const SLIDE_DIMENSIONS = {
  widthInches: 20.0,
  heightInches: 11.25,
  widthPixels: 1920,
  heightPixels: 1080,
};

export const DEFAULT_PRESENTATION_PATH =
  process.env.DEFAULT_PRESENTATION_PATH ||
  "C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Ke_Hoach_AI_Agent_Enterprise_2026.pptx";
