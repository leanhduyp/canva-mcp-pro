import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { TastePalette } from "../taste/palettes.js";
import { exportSlidePng } from "../utils/export-utils.js";

const execFileAsync = promisify(execFile);

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
    points: Array<{ title: string; desc: string }>;
  };
  rightPanel: {
    header: string;
    headerColor?: string;
    points: Array<{ title: string; desc: string }>;
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
    tp: { value: string | number; label: string; desc?: string };
    tn: { value: string | number; label: string; desc?: string };
    fp: { value: string | number; label: string; desc?: string };
    fn: { value: string | number; label: string; desc?: string };
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
    points: Array<{ title: string; desc: string }>;
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

export class SlideEngine {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), "canva-mcp-pro");
  }

  private async ensureTempDir() {
    await fs.mkdir(this.tempDir, { recursive: true });
  }

  async exportThumbnail(presentationPath: string, slideNumber: number, outputPath?: string): Promise<string> {
    return exportSlidePng(presentationPath, slideNumber, outputPath);
  }

  private getPythonPalettePreamble(): string {
    return `
import copy

palette = data.get("palette") or {}
def parse_hex(h, default=(0,0,0)):
    if not h: return RGBColor(*default)
    h = str(h).lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    try:
        return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
    except:
        return RGBColor(*default)

col_accent = parse_hex(palette.get("accent"), (0x15, 0x38, 0x98))
col_ink = parse_hex(palette.get("ink"), (0x10, 0x24, 0x52))
col_surface = parse_hex(palette.get("surface"), (0xF8, 0xFA, 0xFC))
col_muted = parse_hex(palette.get("muted"), (0x47, 0x55, 0x69))
col_secondary = parse_hex(palette.get("secondary"), (0x00, 0xB0, 0xF0))
col_gold = parse_hex(palette.get("gold"), (0xF4, 0xB4, 0x00))

# Clear all previous shapes on the slide cleanly via _spTree
for el in list(slide.shapes._spTree):
    if el.tag.endswith("nvGrpSpPr") or el.tag.endswith("grpSpPr"):
        continue
    slide.shapes._spTree.remove(el)

# Standalone Corporate Canvas from Scratch (Zero 3rd-party template dependency)
bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(20.0), Inches(11.25))
bg_shape.name = "Native Canvas Background"
bg_shape.fill.solid()
bg_shape.fill.fore_color.rgb = col_surface
bg_shape.line.fill.background()

top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(0.35), Inches(18.0), Inches(0.06))
top_bar.name = "Top Accent Bar"
top_bar.fill.solid()
top_bar.fill.fore_color.rgb = col_accent
top_bar.line.fill.background()

# Create Slide Title Box
title_box = slide.shapes.add_textbox(Inches(1.00), Inches(0.40), Inches(12.80), Inches(1.10))
title_box.name = "Slide Title"
tf = title_box.text_frame
tf.word_wrap = True
tf.clear()
p = tf.paragraphs[0]
p.text = data["title"]
p.font.name = "Bai Jamjuree Bold"
p.font.size = Pt(35)
p.font.bold = True
p.font.color.rgb = col_accent

# Presenter Badge (Cyan #00B0F0, 44pt)
if data.get("presenter"):
    pres_box = slide.shapes.add_textbox(Inches(14.00), Inches(0.48), Inches(5.20), Inches(0.85))
    pres_box.name = "Presenter Badge"
    tf_p = pres_box.text_frame
    tf_p.word_wrap = False
    p_p = tf_p.paragraphs[0]
    p_p.text = data["presenter"]
    p_p.alignment = PP_ALIGN.RIGHT
    p_p.font.name = "Calibri"
    p_p.font.size = Pt(44)
    p_p.font.bold = True
    p_p.font.color.rgb = col_secondary

# Context Box
if data.get("subtitleContext"):
    tb_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.75), Inches(18.0), Inches(0.80))
    tb_box.name = "Top Box"
    tb_box.fill.solid()
    tb_box.fill.fore_color.rgb = col_surface
    tb_box.line.color.rgb = col_muted
    tb_box.line.width = Pt(1.5)
    tf_tb = tb_box.text_frame
    tf_tb.word_wrap = True
    p = tf_tb.paragraphs[0]
    p.text = data["subtitleContext"]
    p.font.name = "Bai Jamjuree"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = col_accent
`;
  }

  async buildKpiDashboard(config: KpiSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `kpi_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    blank_layout = prs.slide_layouts[6]
    prs.slides.add_slide(blank_layout)

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

metrics = data.get("kpiMetrics", [])
n = len(metrics)
if n > 0:
    card_w = Inches((18.0 - (n - 1) * 0.33) / n)
    card_h = Inches(3.20)
    top_kpi = Inches(2.85)

    for i, m in enumerate(metrics):
        col_left = Inches(1.0 + i * ((18.0 - (n - 1) * 0.33) / n + 0.33))
        c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_left, top_kpi, card_w, card_h)
        c_box.name = f"KPI Card {i+1}"
        c_box.fill.solid()
        
        status = m.get("status", "normal")
        if status == "success":
            c_box.fill.fore_color.rgb = RGBColor(0xF0, 0xFD, 0xF4)
            c_box.line.color.rgb = RGBColor(0x22, 0xC5, 0x5E)
            val_col = RGBColor(0x15, 0x80, 0x3D)
        elif status == "danger" or status == "warning":
            c_box.fill.fore_color.rgb = RGBColor(0xFE, 0xF2, 0xF2)
            c_box.line.color.rgb = RGBColor(0xFC, 0xA5, 0xA5)
            val_col = RGBColor(0xDC, 0x26, 0x26)
        else:
            c_box.fill.fore_color.rgb = col_surface
            c_box.line.color.rgb = col_muted
            val_col = col_accent
        
        c_box.line.width = Pt(2.0)
        tf_c = c_box.text_frame
        tf_c.word_wrap = True
        
        p0 = tf_c.paragraphs[0]
        p0.text = m["label"]
        p0.alignment = PP_ALIGN.CENTER
        p0.font.name = "Bai Jamjuree"
        p0.font.size = Pt(24)
        p0.font.bold = True
        p0.font.color.rgb = col_muted
        p0.space_after = Pt(4)
        
        p1 = tf_c.add_paragraph()
        p1.text = m["value"]
        p1.alignment = PP_ALIGN.CENTER
        p1.font.name = "Bai Jamjuree Bold"
        p1.font.size = Pt(56)
        p1.font.bold = True
        p1.font.color.rgb = val_col
        p1.space_after = Pt(4)
        
        p2 = tf_c.add_paragraph()
        p2.text = m["subtext"]
        p2.alignment = PP_ALIGN.CENTER
        p2.font.name = "Bai Jamjuree"
        p2.font.size = Pt(24)
        p2.font.color.rgb = col_ink

diags = data.get("diagnosticBoxes", [])
if len(diags) >= 1:
    diag_w = Inches(8.85) if len(diags) == 2 else Inches(18.0)
    for i, d in enumerate(diags):
        d_left = Inches(1.0 if i == 0 else 10.15)
        d_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, d_left, Inches(6.30), diag_w, Inches(2.60))
        d_box.name = f"Diag {i+1}"
        d_box.fill.solid()
        if d.get("type") == "warning":
            d_box.fill.fore_color.rgb = RGBColor(0xFF, 0xFB, 0xEB)
            d_box.line.color.rgb = col_gold
            title_col = RGBColor(0x92, 0x40, 0x0E)
            body_col = RGBColor(0x78, 0x35, 0x0F)
        else:
            d_box.fill.fore_color.rgb = col_surface
            d_box.line.color.rgb = col_accent
            title_col = col_accent
            body_col = col_ink
        d_box.line.width = Pt(2.0)
        tf_d = d_box.text_frame
        tf_d.word_wrap = True
        
        p_dt = tf_d.paragraphs[0]
        p_dt.text = d["title"]
        p_dt.font.name = "Bai Jamjuree"
        p_dt.font.size = Pt(26)
        p_dt.font.bold = True
        p_dt.font.color.rgb = title_col
        p_dt.space_after = Pt(6)
        
        p_db = tf_d.add_paragraph()
        p_db.text = d["body"]
        p_db.font.name = "Bai Jamjuree"
        p_db.font.size = Pt(24)
        p_db.font.color.rgb = body_col

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }




  async buildComparisonMatrix(config: ComparisonSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `comp_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

cols = data.get("columns", [])
n = len(cols)
if n > 0:
    col_w = Inches((18.0 - (n - 1) * 0.33) / n)
    col_h = Inches(5.40)
    top_p = Inches(1.75) if not data.get("subtitleContext") else Inches(2.80)

    for i, c in enumerate(cols):
        col_left = Inches(1.0 + i * ((18.0 - (n - 1) * 0.33) / n + 0.33))
        c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_left, top_p, col_w, col_h)
        c_box.name = f"Prune Card {i+1}"
        c_box.fill.solid()
        
        is_hero = c.get("isHero", False)
        if is_hero:
            c_box.fill.fore_color.rgb = RGBColor(0xF0, 0xFD, 0xF4)
            c_box.line.color.rgb = RGBColor(0x22, 0xC5, 0x5E)
            c_box.line.width = Pt(3.0)
            header_bg = RGBColor(0x15, 0x80, 0x3D)
            val_col = RGBColor(0x15, 0x80, 0x3D)
        else:
            c_box.fill.fore_color.rgb = col_surface
            c_box.line.color.rgb = col_muted
            c_box.line.width = Pt(1.5)
            header_bg = col_accent
            val_col = col_accent

        h_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, col_left, top_p, col_w, Inches(0.80))
        h_box.name = f"Prune Header {i+1}"
        h_box.fill.solid()
        h_box.fill.fore_color.rgb = header_bg
        h_box.line.fill.background()
        tf_h = h_box.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.text = c["badge"]
        p_h.alignment = PP_ALIGN.CENTER
        p_h.font.name = "Bai Jamjuree Bold"
        p_h.font.size = Pt(24)
        p_h.font.bold = True
        p_h.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

        tb = slide.shapes.add_textbox(col_left + Inches(0.2), top_p + Inches(0.88), col_w - Inches(0.4), col_h - Inches(0.95))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p0 = tf.paragraphs[0]
        p0.text = c.get("paramLabel", "Tham số:") + " " + c["paramVal"]
        p0.font.name = "Bai Jamjuree"
        p0.font.size = Pt(24)
        p0.font.bold = True
        p0.font.color.rgb = col_ink
        p0.space_after = Pt(4)

        p1 = tf.add_paragraph()
        p1.text = "Validation CV:"
        p1.font.name = "Bai Jamjuree"
        p1.font.size = Pt(24)
        p1.font.color.rgb = col_muted

        p1_val = tf.add_paragraph()
        p1_val.text = c["valScore"]
        p1_val.font.name = "Bai Jamjuree Bold"
        p1_val.font.size = Pt(30)
        p1_val.font.bold = True
        p1_val.font.color.rgb = val_col
        p1_val.space_after = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = f"Cấu trúc: {c['struct']}"
        p2.font.name = "Bai Jamjuree"
        p2.font.size = Pt(24)
        p2.font.bold = True
        p2.font.color.rgb = col_ink

        p2_imp = tf.add_paragraph()
        p2_imp.text = f"Hiệu quả: {c['impact']}"
        p2_imp.font.name = "Bai Jamjuree"
        p2_imp.font.size = Pt(24)
        p2_imp.font.bold = True
        p2_imp.font.color.rgb = val_col
        p2_imp.space_after = Pt(6)

        p3 = tf.add_paragraph()
        p3.text = c["desc"]
        p3.font.name = "Bai Jamjuree"
        p3.font.size = Pt(24)
        p3.font.color.rgb = col_ink

if data.get("bottomTakeaway"):
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(7.35), Inches(18.0), Inches(1.60))
    banner.name = "Banner 13"
    banner.fill.solid()
    banner.fill.fore_color.rgb = col_surface
    banner.line.color.rgb = col_muted
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    p.text = data["bottomTakeaway"]
    p.font.name = "Bai Jamjuree"
    p.font.size = Pt(25)
    p.font.color.rgb = col_ink

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }


  async buildSplitArchitecture(config: SplitSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `split_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

lp = data.get("leftPanel", {})
rp = data.get("rightPanel", {})

if "0.5%" in lp.get("header", "") or "DUNG SAI" in lp.get("header", ""):
    w1 = Inches(9.30)
    w2 = Inches(8.30)
    x1 = Inches(1.0)
    x2 = Inches(10.70)
else:
    w1 = Inches(8.80)
    w2 = Inches(8.80)
    x1 = Inches(1.0)
    x2 = Inches(10.20)

top_c = Inches(1.75) if not data.get("subtitleContext") else Inches(2.80)
h_c = Inches(5.40) if not data.get("subtitleContext") else Inches(4.35)

# Card 1 Left
card1 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x1, top_c, w1, h_c)
card1.name = "Card 1 Left"
card1.fill.solid()
card1.fill.fore_color.rgb = col_surface
card1.line.color.rgb = col_accent
card1.line.width = Pt(2.5)

h1 = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x1, top_c, w1, Inches(0.85))
h1.name = "Header 1 Left"
h1.fill.solid()
h1.fill.fore_color.rgb = col_accent
h1.line.fill.background()
tf_h1 = h1.text_frame
tf_h1.word_wrap = True
p_h1 = tf_h1.paragraphs[0]
p_h1.text = lp.get("header", "PANEL 1")
p_h1.alignment = PP_ALIGN.CENTER
p_h1.font.name = "Bai Jamjuree Bold"
p_h1.font.size = Pt(25)
p_h1.font.bold = True
p_h1.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

tb1 = slide.shapes.add_textbox(x1 + Inches(0.2), top_c + Inches(1.0), w1 - Inches(0.4), h_c - Inches(1.10))
tb1.name = "Text 1 Left"
tf1 = tb1.text_frame
tf1.word_wrap = True

for pt in lp.get("points", []):
    p_t = tf1.add_paragraph() if len(tf1.paragraphs[0].text) > 0 else tf1.paragraphs[0]
    r_t = p_t.add_run()
    r_t.text = "• " + pt["title"] + " "
    r_t.font.name = "Bai Jamjuree"
    r_t.font.size = Pt(25)
    r_t.font.bold = True
    r_t.font.color.rgb = col_accent
    
    r_d = p_t.add_run()
    r_d.text = pt["desc"]
    r_d.font.name = "Bai Jamjuree"
    r_d.font.size = Pt(24)
    r_d.font.color.rgb = col_ink
    p_t.space_after = Pt(10)

# Card 2 Right
card2 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x2, top_c, w2, h_c)
card2.name = "Card 2 Right"
card2.fill.solid()

is_green = "TEST" in rp.get("header", "") or "HOLDOUT" in rp.get("header", "")
if is_green:
    card2.fill.fore_color.rgb = RGBColor(0xF0, 0xFD, 0xF4)
    card2.line.color.rgb = RGBColor(0x16, 0xA3, 0x4A)
    h2_col = RGBColor(0x15, 0x80, 0x3D)
    title_pt_col = RGBColor(0x16, 0x65, 0x34)
else:
    card2.fill.fore_color.rgb = col_surface
    card2.line.color.rgb = col_muted
    h2_col = col_accent
    title_pt_col = col_accent

card2.line.width = Pt(2.5)

h2 = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x2, top_c, w2, Inches(0.85))
h2.name = "Header 2 Right"
h2.fill.solid()
h2.fill.fore_color.rgb = h2_col
h2.line.fill.background()
tf_h2 = h2.text_frame
tf_h2.word_wrap = True
p_h2 = tf_h2.paragraphs[0]
p_h2.text = rp.get("header", "PANEL 2")
p_h2.alignment = PP_ALIGN.CENTER
p_h2.font.name = "Bai Jamjuree Bold"
p_h2.font.size = Pt(25)
p_h2.font.bold = True
p_h2.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

tb2 = slide.shapes.add_textbox(x2 + Inches(0.2), top_c + Inches(1.0), w2 - Inches(0.4), h_c - Inches(1.10))
tb2.name = "Text 2 Right"
tf2 = tb2.text_frame
tf2.word_wrap = True

for pt in rp.get("points", []):
    p_t = tf2.add_paragraph() if len(tf2.paragraphs[0].text) > 0 else tf2.paragraphs[0]
    r_t = p_t.add_run()
    r_t.text = "• " + pt["title"] + " "
    r_t.font.name = "Bai Jamjuree"
    r_t.font.size = Pt(25)
    r_t.font.bold = True
    r_t.font.color.rgb = title_pt_col
    
    r_d = p_t.add_run()
    r_d.text = pt["desc"]
    r_d.font.name = "Bai Jamjuree"
    r_d.font.size = Pt(24)
    r_d.font.color.rgb = col_ink
    p_t.space_after = Pt(10)

# Bottom Banner
if data.get("bottomBanner"):
    bb = data["bottomBanner"]
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(7.35), Inches(18.0), Inches(1.60))
    banner.name = "Banner Split"
    banner.fill.solid()
    banner.fill.fore_color.rgb = col_surface
    banner.line.color.rgb = col_muted
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    r_b1 = p.add_run()
    r_b1.text = bb.get("prefix", "🎯 Ý nghĩa phương pháp: ") + " "
    r_b1.font.name = "Bai Jamjuree"
    r_b1.font.size = Pt(26)
    r_b1.font.bold = True
    r_b1.font.color.rgb = col_accent
    r_b2 = p.add_run()
    r_b2.text = bb.get("content", "")
    r_b2.font.name = "Bai Jamjuree"
    r_b2.font.size = Pt(25)
    r_b2.font.color.rgb = col_ink

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }


  // --- NEW LAYOUT 1: PIPELINE / FLOWCHART ---
  async buildPipelineSlide(config: PipelineSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `pipe_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

steps = data.get("steps", [])
n = len(steps)
if n > 0:
    card_w = Inches((18.0 - (n - 1) * 0.40) / n)
    top_pos = Inches(2.80) if data.get("subtitleContext") else Inches(1.85)
    card_h = Inches(4.45) if data.get("subtitleContext") else Inches(5.35)

    for i, s in enumerate(steps):
        col_left = Inches(1.0 + i * ((18.0 - (n - 1) * 0.40) / n + 0.40))
        c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_left, top_pos, card_w, card_h)
        c_box.name = f"Pipe Card {i+1}"
        c_box.fill.solid()

        is_hero = s.get("isHero", False)
        if is_hero:
            c_box.fill.fore_color.rgb = RGBColor(0xF0, 0xFD, 0xF4)
            c_box.line.color.rgb = RGBColor(0x22, 0xC5, 0x5E)
            c_box.line.width = Pt(3.0)
            badge_bg = RGBColor(0x15, 0x80, 0x3D)
            title_col = RGBColor(0x15, 0x80, 0x3D)
        else:
            c_box.fill.fore_color.rgb = col_surface
            c_box.line.color.rgb = col_muted
            c_box.line.width = Pt(1.5)
            badge_bg = col_accent
            title_col = col_accent

        # Step badge header
        b_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_left + Inches(0.20), top_pos + Inches(0.22), Inches(1.05), Inches(0.55))
        b_box.name = f"Badge {i+1}"
        b_box.fill.solid()
        b_box.fill.fore_color.rgb = badge_bg
        b_box.line.fill.background()
        tf_b = b_box.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.text = s.get("stepNumber", f"0{i+1}")
        p_b.alignment = PP_ALIGN.CENTER
        p_b.font.name = "Bai Jamjuree Bold"
        p_b.font.size = Pt(24)
        p_b.font.bold = True
        p_b.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

        if s.get("tag"):
            tag_box = slide.shapes.add_textbox(col_left + Inches(1.35), top_pos + Inches(0.20), card_w - Inches(1.45), Inches(0.55))
            tf_t = tag_box.text_frame
            p_t = tf_t.paragraphs[0]
            p_t.text = s["tag"].upper()
            p_t.font.name = "Bai Jamjuree Bold"
            p_t.font.size = Pt(24)
            p_t.font.bold = True
            p_t.font.color.rgb = col_muted

        # Card text content
        tb = slide.shapes.add_textbox(col_left + Inches(0.20), top_pos + Inches(0.95), card_w - Inches(0.40), card_h - Inches(1.10))
        tf = tb.text_frame
        tf.word_wrap = True

        p_title = tf.paragraphs[0]
        p_title.text = s["title"]
        p_title.font.name = "Bai Jamjuree Bold"
        p_title.font.size = Pt(25)
        p_title.font.bold = True
        p_title.font.color.rgb = title_col
        p_title.space_after = Pt(8)

        p_desc = tf.add_paragraph()
        p_desc.text = s["desc"]
        p_desc.font.name = "Bai Jamjuree"
        p_desc.font.size = Pt(24)
        p_desc.font.color.rgb = col_ink

        # Add connector arrow between cards (except last)
        if i < n - 1:
            arrow_left = col_left + card_w + Inches(0.06)
            arrow = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, arrow_left, top_pos + Inches(1.80), Inches(0.28), Inches(0.45))
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = col_accent
            arrow.line.fill.background()

if data.get("bottomTakeaway"):
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(7.45), Inches(18.0), Inches(1.50))
    banner.name = "Banner Pipe"
    banner.fill.solid()
    banner.fill.fore_color.rgb = col_surface
    banner.line.color.rgb = col_muted
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    p.text = data["bottomTakeaway"]
    p.font.name = "Bai Jamjuree"
    p.font.size = Pt(24)
    p.font.color.rgb = col_ink

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }


  // --- NEW LAYOUT 2: CONFUSION MATRIX & CLASSIFICATION METRICS ---
  async buildConfusionMatrix(config: ConfusionMatrixConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `cm_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

m = data.get("matrix", {})

# Left: Confusion Matrix Grid (width 9.10 inches)
grid_x = Inches(1.00)
grid_y = Inches(2.80) if data.get("subtitleContext") else Inches(1.85)
q_w = Inches(4.40)
q_h = Inches(2.05) if data.get("subtitleContext") else Inches(2.55)
gap = Inches(0.20)

# Matrix Header Banner
hdr = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, grid_x, grid_y, Inches(9.00), Inches(0.55))
hdr.fill.solid()
hdr.fill.fore_color.rgb = col_accent
hdr.line.fill.background()
tf_h = hdr.text_frame
p_h = tf_h.paragraphs[0]
p_h.text = "MA TRẬN NHẦM LẪN (TEST SET - 10,000 MẪU)"
p_h.alignment = PP_ALIGN.CENTER
p_h.font.name = "Bai Jamjuree Bold"
p_h.font.size = Pt(24)
p_h.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

top_q = grid_y + Inches(0.65)

def draw_quadrant(name, x, y, title, val, desc, status):
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, q_w, q_h)
    box.name = name
    box.fill.solid()
    if status == "success":
        box.fill.fore_color.rgb = RGBColor(0xF0, 0xFD, 0xF4)
        box.line.color.rgb = RGBColor(0x22, 0xC5, 0x5E)
        v_col = RGBColor(0x15, 0x80, 0x3D)
    elif status == "danger":
        box.fill.fore_color.rgb = RGBColor(0xFE, 0xF2, 0xF2)
        box.line.color.rgb = RGBColor(0xF8, 0x71, 0x71)
        v_col = RGBColor(0xDC, 0x26, 0x26)
    else:
        box.fill.fore_color.rgb = RGBColor(0xFF, 0xFB, 0xEB)
        box.line.color.rgb = col_gold
        v_col = RGBColor(0xB4, 0x53, 0x09)
    box.line.width = Pt(2.0)
    tf = box.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    p0.text = title
    p0.alignment = PP_ALIGN.CENTER
    p0.font.name = "Bai Jamjuree Bold"
    p0.font.size = Pt(24)
    p0.font.color.rgb = v_col
    
    p1 = tf.add_paragraph()
    p1.text = str(val)
    p1.alignment = PP_ALIGN.CENTER
    p1.font.name = "Bai Jamjuree Bold"
    p1.font.size = Pt(40)
    p1.font.color.rgb = v_col
    
    p2 = tf.add_paragraph()
    p2.text = desc or ""
    p2.alignment = PP_ALIGN.CENTER
    p2.font.name = "Bai Jamjuree"
    p2.font.size = Pt(24)
    p2.font.color.rgb = col_ink

# 4 quadrants
tp_info = m.get("tp", {"value": "8,432", "label": "TRUE POSITIVE (TP)", "desc": "Dự báo Đạt - Thực tế Đạt"})
fp_info = m.get("fp", {"value": "412", "label": "FALSE POSITIVE (FP)", "desc": "Sai lầm Loại I (Báo động giả)"})
fn_info = m.get("fn", {"value": "396", "label": "FALSE NEGATIVE (FN)", "desc": "Sai lầm Loại II (Bỏ sót rủi ro)"})
tn_info = m.get("tn", {"value": "760", "label": "TRUE NEGATIVE (TN)", "desc": "Dự báo Không đạt chuẩn xác"})

draw_quadrant("TP Box", grid_x, top_q, tp_info["label"], tp_info["value"], tp_info.get("desc"), "success")
draw_quadrant("FP Box", grid_x + q_w + gap, top_q, fp_info["label"], fp_info["value"], fp_info.get("desc"), "warning")
draw_quadrant("FN Box", grid_x, top_q + q_h + gap, fn_info["label"], fn_info["value"], fn_info.get("desc"), "danger")
draw_quadrant("TN Box", grid_x + q_w + gap, top_q + q_h + gap, tn_info["label"], tn_info["value"], tn_info.get("desc"), "success")

# Right: Metrics & Clinical Insight
rx = Inches(10.60)
metrics = data.get("metrics", [])
nm = len(metrics)
if nm > 0:
    m_w = Inches((8.40 - (min(nm, 2) - 1) * 0.20) / min(nm, 2))
    for i, met in enumerate(metrics[:4]):
        row_i = i // 2
        col_i = i % 2
        mx = rx + col_i * (m_w + Inches(0.20))
        my = grid_y + row_i * Inches(1.30)
        
        m_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, my, m_w, Inches(1.15))
        m_box.name = f"Metric {i+1}"
        m_box.fill.solid()
        m_box.fill.fore_color.rgb = col_surface
        m_box.line.color.rgb = col_muted
        m_box.line.width = Pt(1.5)
        tf_m = m_box.text_frame
        
        p0 = tf_m.paragraphs[0]
        p0.text = met["label"]
        p0.alignment = PP_ALIGN.CENTER
        p0.font.name = "Bai Jamjuree Bold"
        p0.font.size = Pt(24)
        p0.font.color.rgb = col_muted
        
        p1 = tf_m.add_paragraph()
        p1.text = met["value"]
        p1.alignment = PP_ALIGN.CENTER
        p1.font.name = "Bai Jamjuree Bold"
        p1.font.size = Pt(34)
        p1.font.color.rgb = col_accent

# Clinical insight box
ci = data.get("clinicalInsight", {})
if ci:
    c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, rx, grid_y + Inches(2.75), Inches(8.40), Inches(2.40))
    c_box.name = "Clinical Box"
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = col_surface
    c_box.line.color.rgb = col_accent
    c_box.line.width = Pt(2.0)
    tf_c = c_box.text_frame
    tf_c.word_wrap = True
    
    p0 = tf_c.paragraphs[0]
    p0.text = ci.get("title", "CHẨN ĐOÁN HIỆU QUẢ THỰC TIỄN")
    p0.font.name = "Bai Jamjuree Bold"
    p0.font.size = Pt(24)
    p0.font.color.rgb = col_accent
    p0.space_after = Pt(6)
    
    p1 = tf_c.add_paragraph()
    p1.text = ci.get("body", "")
    p1.font.name = "Bai Jamjuree"
    p1.font.size = Pt(24)
    p1.font.color.rgb = col_ink

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }


  // --- NEW LAYOUT 3: NATIVE EXCEL VECTOR CHART ---
  async buildNativeChart(config: NativeChartConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `chart_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

top_c = Inches(2.80) if data.get("subtitleContext") else Inches(1.85)
h_c = Inches(4.90) if data.get("subtitleContext") else Inches(5.40)

# Create Chart Data
chart_data = CategoryChartData()
chart_data.categories = data.get("categories", ["Alpha 0.0", "Alpha 0.001", "Alpha 0.002", "Alpha 0.005"])
for s in data.get("series", []):
    chart_data.add_series(s["name"], s["values"])

c_type = data.get("chartType", "line")
if c_type == "column":
    chart_enum = XL_CHART_TYPE.COLUMN_CLUSTERED
elif c_type == "bar":
    chart_enum = XL_CHART_TYPE.BAR_CLUSTERED
else:
    chart_enum = XL_CHART_TYPE.LINE_MARKERS

chart_shape = slide.shapes.add_chart(
    chart_enum,
    Inches(1.0),
    top_c,
    Inches(10.20),
    h_c,
    chart_data
)
chart = chart_shape.chart
chart.has_legend = True
chart.legend.position = XL_LEGEND_POSITION.TOP
chart.legend.include_in_layout = False
chart.legend.font.name = "Bai Jamjuree Bold"
chart.legend.font.size = Pt(24)

cat_ax = chart.category_axis
cat_ax.format.line.color.rgb = col_muted
cat_ax.tick_labels.font.name = "Bai Jamjuree"
cat_ax.tick_labels.font.size = Pt(24)

val_ax = chart.value_axis
val_ax.format.line.color.rgb = col_muted
val_ax.tick_labels.font.name = "Bai Jamjuree"
val_ax.tick_labels.font.size = Pt(24)

# Right Side Panel
sp = data.get("sidePanel", {})
if sp:
    p_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.60), top_c, Inches(7.40), h_c)
    p_box.name = "Side Card"
    p_box.fill.solid()
    p_box.fill.fore_color.rgb = col_surface
    p_box.line.color.rgb = col_accent
    p_box.line.width = Pt(2.5)
    
    h_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(11.60), top_c, Inches(7.40), Inches(0.80))
    h_box.name = "Side Card Header"
    h_box.fill.solid()
    h_box.fill.fore_color.rgb = col_accent
    h_box.line.fill.background()
    tf_h = h_box.text_frame
    p_h = tf_h.paragraphs[0]
    p_h.text = sp.get("header", "PHÂN TÍCH ĐỒ THỊ")
    p_h.alignment = PP_ALIGN.CENTER
    p_h.font.name = "Bai Jamjuree Bold"
    p_h.font.size = Pt(24)
    p_h.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    tb = slide.shapes.add_textbox(Inches(11.80), top_c + Inches(0.95), Inches(7.00), h_c - Inches(1.10))
    tf = tb.text_frame
    tf.word_wrap = True
    
    for pt in sp.get("points", []):
        p_t = tf.add_paragraph() if len(tf.paragraphs[0].text) > 0 else tf.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = "• " + pt["title"] + " "
        r_t.font.name = "Bai Jamjuree Bold"
        r_t.font.size = Pt(24)
        r_t.font.bold = True
        r_t.font.color.rgb = col_accent
        
        r_d = p_t.add_run()
        r_d.text = pt["desc"]
        r_d.font.name = "Bai Jamjuree"
        r_d.font.size = Pt(24)
        r_d.font.color.rgb = col_ink
        p_t.space_after = Pt(12)

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }


  // --- STEP 1 NEW LAYOUT 1: PROCESS TIMELINE ---
  async buildProcessTimeline(config: TimelineSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `timeline_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

steps = data.get("steps", [])
n = len(steps)
if n > 0:
    has_sub = bool(data.get("subtitleContext"))
    has_bottom = bool(data.get("bottomTakeaway"))

    top_pos = Inches(2.70) if has_sub else Inches(1.85)
    card_h = Inches(4.30) if has_bottom else (Inches(5.20) if has_sub else Inches(6.10))

    card_w = Inches((18.0 - (n - 1) * 0.40) / n)
    badge_size = Inches(1.10)
    badge_y = top_pos
    card_y = top_pos + Inches(1.30)

    # Draw horizontal connector pulse line behind badges
    if n > 1:
        line_start_x = Inches(1.0) + card_w / 2
        line_end_x = Inches(1.0 + (n - 1) * ((18.0 - (n - 1) * 0.40) / n + 0.40)) + card_w / 2
        line_y = badge_y + badge_size / 2
        conn_line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            line_start_x,
            line_y - Pt(2),
            line_end_x - line_start_x,
            Pt(4)
        )
        conn_line.name = "Timeline Connector"
        conn_line.fill.solid()
        conn_line.fill.fore_color.rgb = col_accent
        conn_line.line.fill.background()

    for i, s in enumerate(steps):
        col_left = Inches(1.0 + i * ((18.0 - (n - 1) * 0.40) / n + 0.40))
        is_hero = s.get("isHero", False)

        badge_x = col_left + (card_w - badge_size) / 2
        badge = slide.shapes.add_shape(MSO_SHAPE.OVAL, badge_x, badge_y, badge_size, badge_size)
        badge.name = f"Timeline Badge {i+1}"
        badge.fill.solid()
        if is_hero:
            badge.fill.fore_color.rgb = RGBColor(0x15, 0x80, 0x3D)
            badge.line.color.rgb = RGBColor(0x22, 0xC5, 0x5E)
            badge.line.width = Pt(3.0)
        else:
            badge.fill.fore_color.rgb = col_accent
            badge.line.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            badge.line.width = Pt(2.0)

        tf_badge = badge.text_frame
        tf_badge.word_wrap = False
        p_badge = tf_badge.paragraphs[0]
        step_num = str(s.get("stepNumber", i + 1))
        p_badge.text = step_num
        p_badge.alignment = PP_ALIGN.CENTER
        p_badge.font.name = "Bai Jamjuree Bold"
        p_badge.font.size = Pt(26)
        p_badge.font.bold = True
        p_badge.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_left, card_y, card_w, card_h)
        card.name = f"Timeline Card {i+1}"
        card.fill.solid()
        if is_hero:
            card.fill.fore_color.rgb = RGBColor(0xF0, 0xFD, 0xF4)
            card.line.color.rgb = RGBColor(0x22, 0xC5, 0x5E)
            card.line.width = Pt(3.0)
            title_col = RGBColor(0x15, 0x80, 0x3D)
        else:
            card.fill.fore_color.rgb = col_surface
            card.line.color.rgb = col_muted
            card.line.width = Pt(1.5)
            title_col = col_accent

        tb = slide.shapes.add_textbox(col_left + Inches(0.25), card_y + Inches(0.30), card_w - Inches(0.50), card_h - Inches(0.60))
        tf = tb.text_frame
        tf.word_wrap = True

        p_title = tf.paragraphs[0]
        p_title.text = s.get("label", s.get("title", f"Bước {i+1}"))
        p_title.font.name = "Bai Jamjuree Bold"
        p_title.font.size = Pt(25)
        p_title.font.bold = True
        p_title.font.color.rgb = title_col
        p_title.space_after = Pt(10)

        p_desc = tf.add_paragraph()
        p_desc.text = s.get("description", s.get("desc", ""))
        p_desc.font.name = "Bai Jamjuree"
        p_desc.font.size = Pt(24)
        p_desc.font.color.rgb = col_ink

if data.get("bottomTakeaway"):
    banner_y = card_y + card_h + Inches(0.25)
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), banner_y, Inches(18.0), Inches(1.40))
    banner.name = "Timeline Takeaway"
    banner.fill.solid()
    banner.fill.fore_color.rgb = col_surface
    banner.line.color.rgb = col_muted
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    r1 = p.add_run()
    r1.text = "🎯 Lộ trình hành động: "
    r1.font.name = "Bai Jamjuree"
    r1.font.size = Pt(25)
    r1.font.bold = True
    r1.font.color.rgb = col_accent
    r2 = p.add_run()
    r2.text = data["bottomTakeaway"]
    r2.font.name = "Bai Jamjuree"
    r2.font.size = Pt(24)
    r2.font.color.rgb = col_ink

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }

  // --- STEP 1 NEW LAYOUT 2: SWOT MATRIX ---
  async buildSwotMatrix(config: SwotSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `swot_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

has_sub = bool(data.get("subtitleContext"))
has_bottom = bool(data.get("bottomTakeaway"))

grid_top = Inches(2.70) if has_sub else Inches(1.85)

col_w = Inches(8.80)
gap_x = Inches(0.40)
x1 = Inches(1.00)
x2 = Inches(1.00) + col_w + gap_x

gap_y = Inches(0.25)
if has_bottom:
    row_h = Inches(2.55) if has_sub else Inches(2.95)
else:
    row_h = Inches(3.30) if has_sub else Inches(3.70)

y1 = grid_top
y2 = grid_top + row_h + gap_y

quads = [
    {
        "id": "S",
        "title": "S • STRENGTHS (ĐIỂM MẠNH)",
        "bullets": data.get("strengths", []),
        "x": x1,
        "y": y1,
        "bg": RGBColor(0xF0, 0xFD, 0xF4),
        "border": RGBColor(0x22, 0xC5, 0x5E),
        "header_bg": RGBColor(0x15, 0x80, 0x3D),
    },
    {
        "id": "W",
        "title": "W • WEAKNESSES (ĐIỂM YẾU)",
        "bullets": data.get("weaknesses", []),
        "x": x2,
        "y": y1,
        "bg": RGBColor(0xFE, 0xF2, 0xF2),
        "border": RGBColor(0xEF, 0x44, 0x44),
        "header_bg": RGBColor(0xB9, 0x1C, 0x1C),
    },
    {
        "id": "O",
        "title": "O • OPPORTUNITIES (CƠ HỘI)",
        "bullets": data.get("opportunities", []),
        "x": x1,
        "y": y2,
        "bg": RGBColor(0xEF, 0xF6, 0xFF),
        "border": RGBColor(0x3B, 0x82, 0xF6),
        "header_bg": RGBColor(0x1D, 0x4E, 0xD8),
    },
    {
        "id": "T",
        "title": "T • THREATS (THÁCH THỨC)",
        "bullets": data.get("threats", []),
        "x": x2,
        "y": y2,
        "bg": RGBColor(0xFF, 0xFB, 0xEB),
        "border": RGBColor(0xF5, 0x9E, 0x0B),
        "header_bg": RGBColor(0xB4, 0x53, 0x09),
    },
]

for q in quads:
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, q["x"], q["y"], col_w, row_h)
    card.name = f"SWOT {q['id']} Card"
    card.fill.solid()
    card.fill.fore_color.rgb = q["bg"]
    card.line.color.rgb = q["border"]
    card.line.width = Pt(2.5)

    hdr = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, q["x"], q["y"], col_w, Inches(0.70))
    hdr.name = f"SWOT {q['id']} Header"
    hdr.fill.solid()
    hdr.fill.fore_color.rgb = q["header_bg"]
    hdr.line.fill.background()
    tf_h = hdr.text_frame
    p_h = tf_h.paragraphs[0]
    p_h.text = q["title"]
    p_h.alignment = PP_ALIGN.CENTER
    p_h.font.name = "Bai Jamjuree Bold"
    p_h.font.size = Pt(24)
    p_h.font.bold = True
    p_h.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    tb = slide.shapes.add_textbox(q["x"] + Inches(0.25), q["y"] + Inches(0.78), col_w - Inches(0.50), row_h - Inches(0.85))
    tf = tb.text_frame
    tf.word_wrap = True

    bullets = q["bullets"][:3]
    for b_idx, bullet in enumerate(bullets):
        p_b = tf.add_paragraph() if b_idx > 0 else tf.paragraphs[0]
        r_dot = p_b.add_run()
        r_dot.text = "• "
        r_dot.font.name = "Bai Jamjuree Bold"
        r_dot.font.size = Pt(24)
        r_dot.font.bold = True
        r_dot.font.color.rgb = q["header_bg"]

        r_txt = p_b.add_run()
        r_txt.text = bullet
        r_txt.font.name = "Bai Jamjuree"
        r_txt.font.size = Pt(24)
        r_txt.font.color.rgb = col_ink
        p_b.space_after = Pt(6)

if data.get("bottomTakeaway"):
    banner_y = y2 + row_h + Inches(0.20)
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), banner_y, Inches(18.0), Inches(1.40))
    banner.name = "SWOT Takeaway"
    banner.fill.solid()
    banner.fill.fore_color.rgb = col_surface
    banner.line.color.rgb = col_muted
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    r1 = p.add_run()
    r1.text = "🎯 Chiến lược tổng thể: "
    r1.font.name = "Bai Jamjuree"
    r1.font.size = Pt(25)
    r1.font.bold = True
    r1.font.color.rgb = col_accent
    r2 = p.add_run()
    r2.text = data["bottomTakeaway"]
    r2.font.name = "Bai Jamjuree"
    r2.font.size = Pt(24)
    r2.font.color.rgb = col_ink

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }

  // --- STEP 1 NEW LAYOUT 3: TEAM GRID ---
  async buildTeamGrid(config: TeamGridSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `team_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
import os
import urllib.request
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    prs.slides.add_slide(prs.slide_layouts[6])

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

members = data.get("members", [])
m_count = len(members)

has_sub = bool(data.get("subtitleContext"))
has_bottom = bool(data.get("bottomTakeaway"))

grid_top = Inches(2.70) if has_sub else Inches(1.85)

if m_count <= 3:
    num_rows = 1
    num_cols = max(1, m_count)
elif m_count == 4:
    num_rows = 2
    num_cols = 2
else:
    num_rows = 2
    num_cols = 3

col_gap = Inches(0.40)
card_w = Inches((18.0 - (num_cols - 1) * 0.40) / num_cols)

if num_rows == 1:
    card_h = Inches(4.30) if has_bottom else (Inches(5.20) if has_sub else Inches(6.10))
    row_gap = Inches(0)
else:
    row_gap = Inches(0.25)
    if has_bottom:
        card_h = Inches(2.65) if has_sub else Inches(3.05)
    else:
        card_h = Inches(3.30) if has_sub else Inches(3.70)

avatar_size = Inches(1.20) if num_rows == 2 else Inches(1.40)

for idx_m, m in enumerate(members):
    r_idx = idx_m // num_cols
    c_idx = idx_m % num_cols

    col_x = Inches(1.00) + c_idx * (card_w + col_gap)
    row_y = grid_top + r_idx * (card_h + row_gap)

    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x, row_y, card_w, card_h)
    card.name = f"Team Card {idx_m+1}"
    card.fill.solid()
    card.fill.fore_color.rgb = col_surface
    card.line.color.rgb = col_accent
    card.line.width = Pt(2.0)

    av_x = col_x + Inches(0.30)
    av_y = row_y + Inches(0.30)

    avatar_placed = False
    avatar_url = m.get("avatarUrl")
    if avatar_url:
        try:
            temp_av_path = os.path.join(os.path.dirname(ppt_path), f"temp_avatar_{idx_m}.png")
            req = urllib.request.Request(avatar_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=3) as resp, open(temp_av_path, 'wb') as out_f:
                out_f.write(resp.read())

            pic = slide.shapes.add_picture(temp_av_path, av_x, av_y, avatar_size, avatar_size)
            spPr = pic._element.spPr
            geom = spPr.find('{http://schemas.openxmlformats.org/drawingml/2006/main}prstGeom')
            if geom is not None:
                geom.attrib['prst'] = 'ellipse'

            ring = slide.shapes.add_shape(MSO_SHAPE.OVAL, av_x, av_y, avatar_size, avatar_size)
            ring.fill.background()
            ring.line.color.rgb = col_secondary
            ring.line.width = Pt(2.5)
            avatar_placed = True

            try:
                os.remove(temp_av_path)
            except:
                pass
        except Exception:
            avatar_placed = False

    if not avatar_placed:
        words = [part for part in m.get("name", "U").split() if part]
        initials = (words[0][0] + (words[-1][0] if len(words) > 1 else "")) if words else "AD"

        badge = slide.shapes.add_shape(MSO_SHAPE.OVAL, av_x, av_y, avatar_size, avatar_size)
        badge.name = f"Initials Badge {idx_m+1}"
        badge.fill.solid()
        badge.fill.fore_color.rgb = col_accent
        badge.line.color.rgb = col_secondary
        badge.line.width = Pt(2.5)
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.text = initials.upper()
        p_b.alignment = PP_ALIGN.CENTER
        p_b.font.name = "Bai Jamjuree Bold"
        p_b.font.size = Pt(24)
        p_b.font.bold = True
        p_b.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    info_x = av_x + avatar_size + Inches(0.25)
    info_w = card_w - (avatar_size + Inches(0.85))
    info_box = slide.shapes.add_textbox(info_x, row_y + Inches(0.25), info_w, card_h - Inches(0.50))
    tf_info = info_box.text_frame
    tf_info.word_wrap = True

    p_name = tf_info.paragraphs[0]
    p_name.text = m.get("name", "Họ Tên")
    p_name.font.name = "Bai Jamjuree Bold"
    p_name.font.size = Pt(26)
    p_name.font.bold = True
    p_name.font.color.rgb = col_accent
    p_name.space_after = Pt(4)

    p_role = tf_info.add_paragraph()
    p_role.text = m.get("role", "Vai trò")
    p_role.font.name = "Bai Jamjuree Bold"
    p_role.font.size = Pt(24)
    p_role.font.bold = True
    p_role.font.color.rgb = col_secondary
    p_role.space_after = Pt(6)

    if m.get("bio"):
        p_bio = tf_info.add_paragraph()
        p_bio.text = m["bio"]
        p_bio.font.name = "Bai Jamjuree"
        p_bio.font.size = Pt(24)
        p_bio.font.color.rgb = col_ink

if data.get("bottomTakeaway"):
    banner_y = (grid_top + num_rows * (card_h + row_gap)) + Inches(0.15)
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), banner_y, Inches(18.0), Inches(1.35))
    banner.name = "Team Takeaway"
    banner.fill.solid()
    banner.fill.fore_color.rgb = col_surface
    banner.line.color.rgb = col_muted
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    r1 = p.add_run()
    r1.text = "🎯 Năng lực đội ngũ: "
    r1.font.name = "Bai Jamjuree"
    r1.font.size = Pt(25)
    r1.font.bold = True
    r1.font.color.rgb = col_accent
    r2 = p.add_run()
    r2.text = data["bottomTakeaway"]
    r2.font.name = "Bai Jamjuree"
    r2.font.size = Pt(24)
    r2.font.color.rgb = col_ink

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }

  async buildCoverSlide(config: CoverSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `cover_${Date.now()}.py`);
    const dataJson = JSON.stringify(config);

    const pythonCode = `
import sys
import json
import os
import copy
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

data = json.loads('''${dataJson.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')
ppt_path = data["presentationPath"]
if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    blank_layout = prs.slide_layouts[6]
    prs.slides.add_slide(blank_layout)

slide = prs.slides[idx]

${this.getPythonPalettePreamble()}

# Remove standard top slide title & top box from preamble for Cover Slide
for sh in list(slide.shapes):
    if sh.name == "Slide Title" or sh.name == "Top Box":
        slide.shapes._spTree.remove(sh._element)

# Main Cover Title (Hero Title 46pt bold)
title_box = slide.shapes.add_textbox(Inches(1.50), Inches(2.20), Inches(17.00), Inches(2.60))
title_box.name = "Cover Title Box"
tf_title = title_box.text_frame
tf_title.word_wrap = True
p_title = tf_title.paragraphs[0]
p_title.text = data["title"]
p_title.font.name = "Bai Jamjuree Bold"
p_title.font.size = Pt(46)
p_title.font.bold = True
p_title.font.color.rgb = col_accent
p_title.space_after = Pt(8)

if data.get("subtitle"):
    p_sub = tf_title.add_paragraph()
    p_sub.text = data["subtitle"]
    p_sub.font.name = "Bai Jamjuree"
    p_sub.font.size = Pt(28)
    p_sub.font.bold = True
    p_sub.font.color.rgb = col_muted

# Presenter & Organization Card
card_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.50), Inches(6.40), Inches(17.00), Inches(2.60))
card_box.name = "Cover Presenter Card"
card_box.fill.solid()
card_box.fill.fore_color.rgb = col_surface
card_box.line.color.rgb = col_secondary
card_box.line.width = Pt(2.5)

tf_c = card_box.text_frame
tf_c.word_wrap = True

p_c1 = tf_c.paragraphs[0]
p_c1.text = f"Chủ Trì & Báo Cáo Viên: {data.get('presenter', 'Lê Anh Duy')}"
p_c1.font.name = "Bai Jamjuree Bold"
p_c1.font.size = Pt(30)
p_c1.font.bold = True
p_c1.font.color.rgb = col_accent
p_c1.space_after = Pt(6)

p_c2 = tf_c.add_paragraph()
p_c2.text = data.get("department", "Ban Chỉ Đạo Dự Án Chuyển Đổi Số & Kiến Trúc Hạ Tầng AI Enterprise")
p_c2.font.name = "Bai Jamjuree"
p_c2.font.size = Pt(24)
p_c2.font.bold = True
p_c2.font.color.rgb = col_ink
p_c2.space_after = Pt(4)

meta_str = " | ".join(data.get("metaTags", ["Kế Hoạch Năm 2026", "Chuẩn Hạ Tầng: Multi-Agent A2A Mesh", "Bảo Mật: Air-gapped"]))
p_c3 = tf_c.add_paragraph()
p_c3.text = f"Hệ Thống: {meta_str}"
p_c3.font.name = "Bai Jamjuree"
p_c3.font.size = Pt(24)
p_c3.font.color.rgb = col_muted

prs.save(ppt_path)
print("SUCCESS")
`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }

  async trimSlides(presentationPath: string, maxSlides: number = 20): Promise<void> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, `trim_${Date.now()}.py`);
    const pythonCode = `
import sys
import pptx
sys.stdout.reconfigure(encoding='utf-8')

prs = pptx.Presentation(r'${presentationPath.replace(/\\/g, "/")}')
while len(prs.slides) > ${maxSlides}:
    idx = len(prs.slides) - 1
    rId = prs.slides._sldIdLst[idx].rId
    prs.part.drop_rel(rId)
    del prs.slides._sldIdLst[idx]
prs.save(r'${presentationPath.replace(/\\/g, "/")}')
print("TRIMMED")
`;
    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
  }
}
