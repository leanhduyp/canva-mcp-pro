import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=================================================")
print("BẮT ĐẦU XÓA TOÀN BỘ BRAND & TEMPLATE CỦA IUH")
print("=================================================")

# 1. Update src/taste/palettes.ts
p_path = r"C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/src/taste/palettes.ts"
if os.path.exists(p_path):
    with open(p_path, "r", encoding="utf-8") as f:
        p_content = f.read()
    
    p_content = p_content.replace('// Auto-generated from taste-skill palettes.json & IUH brand standards.', '// Auto-generated from taste-skill palettes.json & Corporate Enterprise standards.')
    p_content = p_content.replace('"iuh-brand": {', '"corporate-navy": {')
    p_content = p_content.replace('"id": "iuh-brand"', '"id": "corporate-navy"')
    p_content = p_content.replace('"name": "IUH Official Brand (Blue & Gold)"', '"name": "Corporate Navy & Gold (Enterprise Standard)"')
    p_content = p_content.replace('Bảng màu chuẩn đại học Công Nghiệp TP.HCM (IUH):', 'Bảng màu chuẩn doanh nghiệp hiện đại:')
    p_content = p_content.replace('export const DEFAULT_PALETTE_ID = "iuh-brand";', 'export const DEFAULT_PALETTE_ID = "corporate-navy";')
    
    if 'palettes["iuh-brand"]' not in p_content:
        p_content = p_content.replace(
            'export const DEFAULT_PALETTE_ID = "corporate-navy";',
            '// Backward compatibility alias\npalettes["iuh-brand"] = palettes["corporate-navy"];\n\nexport const DEFAULT_PALETTE_ID = "corporate-navy";'
        )

    with open(p_path, "w", encoding="utf-8") as f:
        f.write(p_content)
    print("✅ Đã cập nhật src/taste/palettes.ts: Đổi iuh-brand thành corporate-navy.")

# 2. Update src/engine/slide-engine.ts
se_path = r"C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/src/engine/slide-engine.ts"
if os.path.exists(se_path):
    with open(se_path, "r", encoding="utf-8") as f:
        se_content = f.read()

    old_logic = """# Find reference template background & IUH logo specifically from slide 14 (index 13) or 11
ref_bg = None
ref_logo = None
for ref_idx in [13, 11, 12, 10]:
    if len(prs.slides) > ref_idx:
        s_ref = prs.slides[ref_idx]
        logos = [sh for sh in s_ref.shapes if sh.name == "Group 4" and sh.width > Inches(3.0)]
        bgs = [sh for sh in s_ref.shapes if sh.name == "Group 2" and sh.height > Inches(9.0)]
        if logos and bgs:
            ref_bg = bgs[0]
            ref_logo = logos[0]
            break

# Clear all previous shapes on the slide cleanly via _spTree
for el in list(slide.shapes._spTree):
    if el.tag.endswith("nvGrpSpPr") or el.tag.endswith("grpSpPr"):
        continue
    slide.shapes._spTree.remove(el)

# Restore IUH template branding (clean background & logo from slide 14)
if ref_bg and ref_logo:
    slide.shapes._spTree.append(copy.deepcopy(ref_bg._element))
    slide.shapes._spTree.append(copy.deepcopy(ref_logo._element))

# Create Slide Title Box
title_box = slide.shapes.add_textbox(Inches(4.90), Inches(0.40), Inches(9.00), Inches(1.10))"""

    new_logic = """# Clear all previous shapes on the slide cleanly via _spTree
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
title_box = slide.shapes.add_textbox(Inches(1.00), Inches(0.40), Inches(12.80), Inches(1.10))"""

    se_content = se_content.replace(old_logic, new_logic)

    with open(se_path, "w", encoding="utf-8") as f:
        f.write(se_content)
    print("✅ Đã cập nhật src/engine/slide-engine.ts: Xóa bỏ 100% hook logo & background IUH.")

# 3. Update src/tools/taste-tools.ts, visual-tools.ts, connect-tools.ts
base_dir = r"C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro"
for tool_rel in ["src/tools/taste-tools.ts", "src/tools/visual-tools.ts", "src/tools/connect-tools.ts"]:
    tool_file = os.path.join(base_dir, tool_rel)
    if os.path.exists(tool_file):
        with open(tool_file, "r", encoding="utf-8") as f:
            t_content = f.read()
        t_content = t_content.replace("IUH Brand", "Corporate Brand")
        t_content = t_content.replace("'iuh-brand'", "'corporate-navy'")
        t_content = t_content.replace('"iuh-brand"', '"corporate-navy"')
        with open(tool_file, "w", encoding="utf-8") as f:
            f.write(t_content)
        print(f"✅ Đã làm sạch: {tool_rel}")

# 4. Update manifest.json
m_file = os.path.join(base_dir, "manifest.json")
if os.path.exists(m_file):
    with open(m_file, "r", encoding="utf-8") as f:
        m_content = f.read()
    m_content = m_content.replace("mrduy@iuh.edu.vn", "mrduy@enterprise-ai.vn")
    m_content = m_content.replace("Industrial University of Ho Chi Minh City (IUH)", "Enterprise AI Architecture & Open-Source Team")
    with open(m_file, "w", encoding="utf-8") as f:
        f.write(m_content)
    print("✅ Đã làm sạch manifest.json.")

# 5. Update skills
for skill_rel in ["skills/canva-brand-auditor/SKILL.md", "skills/canva-deck-builder/SKILL.md"]:
    skill_file = os.path.join(base_dir, skill_rel)
    if os.path.exists(skill_file):
        with open(skill_file, "r", encoding="utf-8") as f:
            s_content = f.read()
        s_content = s_content.replace("iuh-brand", "corporate-navy")
        s_content = s_content.replace("IUH Brand", "Corporate Navy")
        with open(skill_file, "w", encoding="utf-8") as f:
            f.write(s_content)
        print(f"✅ Đã làm sạch: {skill_rel}")

# 6. Update evals/canva_mcp_eval.xml
eval_file = os.path.join(base_dir, "evals/canva_mcp_eval.xml")
if os.path.exists(eval_file):
    with open(eval_file, "r", encoding="utf-8") as f:
        e_content = f.read()
    e_content = e_content.replace("Bảng màu chuẩn IUH Official Brand", "Bảng màu chuẩn Corporate Navy & Gold")
    e_content = e_content.replace("ID: iuh-brand", "ID: corporate-navy")
    e_content = e_content.replace("bảng màu iuh-brand", "bảng màu corporate-navy")
    with open(eval_file, "w", encoding="utf-8") as f:
        f.write(e_content)
    print("✅ Đã cập nhật evals/canva_mcp_eval.xml.")

# 7. Update scripts/build_mcpb.js
b_mcpb = os.path.join(base_dir, "scripts/build_mcpb.js")
if os.path.exists(b_mcpb):
    with open(b_mcpb, "r", encoding="utf-8") as f:
        b_content = f.read()
    b_content = b_content.replace("mrduy@iuh.edu.vn", "mrduy@enterprise-ai.vn")
    b_content = b_content.replace("Industrial University of Ho Chi Minh City (IUH)", "Enterprise AI Architecture & Open-Source Team")
    with open(b_mcpb, "w", encoding="utf-8") as f:
        f.write(b_content)
    print("✅ Đã cập nhật scripts/build_mcpb.js.")

print("\n🎉 ĐÃ XÓA SẠCH 100% CÁC THÀNH PHẦN LIÊN QUAN ĐẾN IUH TRÊN TOÀN BỘ PROJECT!")
