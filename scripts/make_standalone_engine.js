import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/engine/slide-engine.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Replace prs = pptx.Presentation(ppt_path) with existence check
const initReplacement = `if os.path.exists(ppt_path):
    prs = pptx.Presentation(ppt_path)
else:
    prs = pptx.Presentation()
    prs.slide_width = Inches(20.0)
    prs.slide_height = Inches(11.25)`;

content = content.replace(/prs = pptx\.Presentation\(ppt_path\)/g, initReplacement);

// 2. Enhance getPythonPalettePreamble for 100% standalone creation
const oldPreambleLogic = `# Restore IUH template branding (clean background & logo from slide 14)
if ref_bg and ref_logo:
    slide.shapes._spTree.append(copy.deepcopy(ref_bg._element))
    slide.shapes._spTree.append(copy.deepcopy(ref_logo._element))

# Create Slide Title Box
title_box = slide.shapes.add_textbox(Inches(4.90), Inches(0.40), Inches(9.00), Inches(1.10))`;

const newPreambleLogic = `if ref_bg and ref_logo:
    slide.shapes._spTree.append(copy.deepcopy(ref_bg._element))
    slide.shapes._spTree.append(copy.deepcopy(ref_logo._element))
    title_left = Inches(4.90)
    title_width = Inches(9.00)
else:
    # Standalone Corporate Canvas from Scratch
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

    title_left = Inches(1.00)
    title_width = Inches(12.80)

# Create Slide Title Box
title_box = slide.shapes.add_textbox(title_left, Inches(0.40), title_width, Inches(1.10))`;

content = content.replace(oldPreambleLogic, newPreambleLogic);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully upgraded SlideEngine to support 100% standalone PPTX creation from scratch!');
