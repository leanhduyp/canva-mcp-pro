import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/engine/slide-engine.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add CoverSlideConfig interface if not present
if (!content.includes('export interface CoverSlideConfig')) {
  const interfaceCode = `
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
`;
  content = content.replace('export class SlideEngine {', interfaceCode + '\nexport class SlideEngine {');
}

// 2. Add buildCoverSlide and trimSlides before the final closing brace
const methodsCode = `
  async buildCoverSlide(config: CoverSlideConfig): Promise<string> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, \`cover_\${Date.now()}.py\`);
    const dataJson = JSON.stringify(config);

    const pythonCode = \`
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

data = json.loads('''\${dataJson.replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'")}\''')
ppt_path = data["presentationPath"]
prs = pptx.Presentation(ppt_path)
idx = data["slideNumber"] - 1

while len(prs.slides) <= idx:
    blank_layout = prs.slide_layouts[6]
    prs.slides.add_slide(blank_layout)

slide = prs.slides[idx]

\${this.getPythonPalettePreamble()}

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
\`;

    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
    return config.presentationPath;
  }

  async trimSlides(presentationPath: string, maxSlides: number = 20): Promise<void> {
    await this.ensureTempDir();
    const scriptPath = path.join(this.tempDir, \`trim_\${Date.now()}.py\`);
    const pythonCode = \`
import sys
import pptx
sys.stdout.reconfigure(encoding='utf-8')

prs = pptx.Presentation(r'\${presentationPath.replace(/\\\\/g, "/")}')
while len(prs.slides) > \${maxSlides}:
    idx = len(prs.slides) - 1
    rId = prs.slides._sldIdLst[idx].rId
    prs.part.drop_rel(rId)
    del prs.slides._sldIdLst[idx]
prs.save(r'\${presentationPath.replace(/\\\\/g, "/")}')
print("TRIMMED")
\`;
    await fs.writeFile(scriptPath, pythonCode, "utf-8");
    await execFileAsync("python", [scriptPath]);
    await fs.unlink(scriptPath).catch(() => {});
  }
}
`;

if (!content.includes('buildCoverSlide')) {
  // Replace last closing brace of class
  const lastBraceIdx = content.lastIndexOf('}');
  content = content.substring(0, lastBraceIdx) + methodsCode;
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Added buildCoverSlide and trimSlides to SlideEngine!');
} else {
  console.log('buildCoverSlide already present.');
}
