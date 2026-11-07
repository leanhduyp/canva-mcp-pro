import os
import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

sys.stdout.reconfigure(encoding='utf-8')

# Color Palette: Enterprise Modern Slate & Cyber Cyan
C_BG = RGBColor(0xF8, 0xFA, 0xFC)       # #F8FAFC Slate-50
C_CARD = RGBColor(0xFF, 0xFF, 0xFF)     # White Card
C_INK = RGBColor(0x0F, 0x17, 0x2A)      # Slate-900 High Contrast
C_MUTED = RGBColor(0x47, 0x55, 0x69)    # Slate-600 Muted
C_NAVY = RGBColor(0x15, 0x38, 0x98)     # Primary Brand Navy
C_CYAN = RGBColor(0x00, 0xB0, 0xF0)     # Presenter Cyan Accent
C_BORDER = RGBColor(0xCB, 0xD5, 0xE1)   # Slate-300 Border
C_EMERALD = RGBColor(0x10, 0xB9, 0x81)  # Success Green
C_ROSE = RGBColor(0xEF, 0x44, 0x44)     # Danger / Warning Red
C_AMBER = RGBColor(0xF5, 0x9E, 0x0B)    # Amber Warning
C_BLUE_LIGHT = RGBColor(0xEE, 0xF2, 0xFF)

OUTPUT_PATH = r"C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Ke_Hoach_AI_Agent_Enterprise_2026.pptx"

# Initialize a clean, 100% brand new presentation
prs = pptx.Presentation()
prs.slide_width = Inches(20.0)
prs.slide_height = Inches(11.25)
blank_layout = prs.slide_layouts[6]

def add_base_decorations(slide, title_text, context_text=""):
    """Adds pristine background, top brand stripe, title, and mandatory Presenter Badge"""
    # Background Canvas
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(20.0), Inches(11.25))
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_BG
    bg.line.fill.background()

    # Top Brand Ribbon
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(0.35), Inches(18.0), Inches(0.06))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_CYAN
    bar.line.fill.background()

    # Title Box
    tb = slide.shapes.add_textbox(Inches(1.0), Inches(0.48), Inches(12.8), Inches(1.0))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title_text
    p.font.name = "Calibri"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    # Presenter Badge: Lê Anh Duy (44pt, Cyan #00B0F0) - STRICT COMPLIANCE
    pb = slide.shapes.add_textbox(Inches(14.0), Inches(0.42), Inches(5.0), Inches(0.9))
    ptf = pb.text_frame
    ptf.word_wrap = False
    pp = ptf.paragraphs[0]
    pp.text = "Lê Anh Duy"
    pp.alignment = PP_ALIGN.RIGHT
    pp.font.name = "Calibri"
    pp.font.size = Pt(44)
    pp.font.bold = True
    pp.font.color.rgb = C_CYAN

    # Context Header Box if provided
    if context_text:
        cb = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.60), Inches(18.0), Inches(0.85))
        cb.fill.solid()
        cb.fill.fore_color.rgb = C_CARD
        cb.line.color.rgb = C_BORDER
        cb.line.width = Pt(1.5)
        ctf = cb.text_frame
        ctf.word_wrap = True
        cp = ctf.paragraphs[0]
        cp.text = context_text
        cp.font.name = "Calibri"
        cp.font.size = Pt(24)
        cp.font.bold = True
        cp.font.color.rgb = C_NAVY

print("--- KHỞI TẠO BỘ SLIDE MỚI HOÀN TOÀN TỪ ĐẦU ---")

# ==========================================
# SLIDE 1: Cover Title (Commanding Executive)
# ==========================================
s1 = prs.slides.add_slide(blank_layout)
# Dark Executive Slate Backdrop for Cover
bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(20.0), Inches(11.25))
bg1.fill.solid()
bg1.fill.fore_color.rgb = RGBColor(0x0B, 0x19, 0x2C)
bg1.line.fill.background()

# Top Cyan bar
cbar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.5), Inches(0.8), Inches(17.0), Inches(0.08))
cbar.fill.solid()
cbar.fill.fore_color.rgb = C_CYAN
cbar.line.fill.background()

# Presenter Badge on Cover
pb1 = s1.shapes.add_textbox(Inches(13.5), Inches(0.9), Inches(5.0), Inches(0.9))
ptf1 = pb1.text_frame
pp1 = ptf1.paragraphs[0]
pp1.text = "Lê Anh Duy"
pp1.alignment = PP_ALIGN.RIGHT
pp1.font.name = "Calibri"
pp1.font.size = Pt(44)
pp1.font.bold = True
pp1.font.color.rgb = C_CYAN

# Category Chip
chip1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.6), Inches(6.0), Inches(0.65))
chip1.fill.solid()
chip1.fill.fore_color.rgb = RGBColor(0x1E, 0x3E, 0x62)
chip1.line.fill.background()
cp1 = chip1.text_frame.paragraphs[0]
cp1.text = "CHIẾN LƯỢC CÔNG NGHỆ DOANH NGHIỆP 2026"
cp1.alignment = PP_ALIGN.CENTER
cp1.font.name = "Calibri"
cp1.font.size = Pt(24)
cp1.font.bold = True
cp1.font.color.rgb = C_CYAN

# Main Title
tb1 = s1.shapes.add_textbox(Inches(1.5), Inches(2.6), Inches(17.0), Inches(2.8))
tf1 = tb1.text_frame
tf1.word_wrap = True
p1_1 = tf1.paragraphs[0]
p1_1.text = "KẾ HOẠCH TRIỂN KHAI HẠ TẦNG AI AGENT"
p1_1.font.name = "Calibri"
p1_1.font.size = Pt(48)
p1_1.font.bold = True
p1_1.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
p1_1.space_after = Pt(6)

p1_2 = tf1.add_paragraph()
p1_2.text = "& CHUYỂN ĐỔI SỐ DOANH NGHIỆP 2026"
p1_2.font.name = "Calibri"
p1_2.font.size = Pt(48)
p1_2.font.bold = True
p1_2.font.color.rgb = C_CYAN
p1_2.space_after = Pt(12)

p1_3 = tf1.add_paragraph()
p1_3.text = "Tự động hóa vận hành, giao thức Multi-Agent A2A và bảo mật dữ liệu Air-gapped."
p1_3.font.name = "Calibri"
p1_3.font.size = Pt(26)
p1_3.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)

# Host Card at Bottom
card1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(6.8), Inches(17.0), Inches(2.8))
card1.fill.solid()
card1.fill.fore_color.rgb = RGBColor(0x11, 0x22, 0x3B)
card1.line.color.rgb = C_CYAN
card1.line.width = Pt(2.0)
ctf1 = card1.text_frame
ctf1.word_wrap = True

cp1_h = ctf1.paragraphs[0]
cp1_h.text = "Chủ Trì & Báo Cáo Viên: Lê Anh Duy (Lead AI Architect)"
cp1_h.font.name = "Calibri"
cp1_h.font.size = Pt(30)
cp1_h.font.bold = True
cp1_h.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
cp1_h.space_after = Pt(6)

cp1_sub = ctf1.add_paragraph()
cp1_sub.text = "Đơn Vị: Ban Chỉ Đạo Dự Án Chuyển Đổi Số & Kiến Trúc Hệ Thống Thông Minh"
cp1_sub.font.name = "Calibri"
cp1_sub.font.size = Pt(24)
cp1_sub.font.color.rgb = RGBColor(0xCB, 0xD5, 0xE1)
cp1_sub.space_after = Pt(4)

cp1_meta = ctf1.add_paragraph()
cp1_meta.text = "Thời Gian: Năm 2026 | Quy Chuẩn: Multi-Agent A2A Mesh | Tiêu Chuẩn SLA: 99.99%"
cp1_meta.font.name = "Calibri"
cp1_meta.font.size = Pt(24)
cp1_meta.font.bold = True
cp1_meta.font.color.rgb = C_CYAN

# ==========================================
# SLIDE 2: Executive Summary (3 Pillars)
# ==========================================
s2 = prs.slides.add_slide(blank_layout)
add_base_decorations(s2, "TỔNG QUAN CHIẾN LƯỢC 3 TRỤ CỘT CHUYỂN ĐỔI SỐ", "Khung chiến lược hành động tổng thể nâng cấp hạ tầng thông minh năm 2026")

pillar_data = [
    ("TRỤ CỘT 1: TỰ ĐỘNG HÓA", C_NAVY, "Cắt giảm 40% giờ công thủ công nhờ tự động hóa xử lý 15 quy trình kế toán, nhân sự và kỹ thuật."),
    ("TRỤ CỘT 2: ĐA AGENT A2A", C_CYAN, "Kết nối mạng lưới 10 Agent chuyên biệt, tự động phân rã tác vụ và chia sẻ ngữ cảnh thời gian thực."),
    ("TRỤ CỘT 3: BẢO MẬT AIR-GAP", C_EMERALD, "Mã hóa AES-256 toàn bộ dữ liệu nội bộ, lưu vết kiểm toán bất biến và đạt 100% chuẩn GDPR/FERPA.")
]

for i, (p_title, p_color, p_desc) in enumerate(pillar_data):
    px = Inches(1.0 + i * 6.2)
    p_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(2.8), Inches(5.8), Inches(5.2))
    p_box.fill.solid()
    p_box.fill.fore_color.rgb = C_CARD
    p_box.line.color.rgb = p_color
    p_box.line.width = Pt(2.5)
    
    # Top accent bar on each card
    cbar_p = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, px, Inches(2.8), Inches(5.8), Inches(0.18))
    cbar_p.fill.solid()
    cbar_p.fill.fore_color.rgb = p_color
    cbar_p.line.fill.background()

    ptf = p_box.text_frame
    ptf.word_wrap = True
    
    pp0 = ptf.paragraphs[0]
    pp0.text = f"0{i+1}"
    pp0.font.name = "Calibri"
    pp0.font.size = Pt(40)
    pp0.font.bold = True
    pp0.font.color.rgb = p_color
    pp0.space_after = Pt(8)

    pp1 = ptf.add_paragraph()
    pp1.text = p_title
    pp1.font.name = "Calibri"
    pp1.font.size = Pt(26)
    pp1.font.bold = True
    pp1.font.color.rgb = C_NAVY
    pp1.space_after = Pt(12)

    pp2 = ptf.add_paragraph()
    pp2.text = p_desc
    pp2.font.name = "Calibri"
    pp2.font.size = Pt(24)
    pp2.font.color.rgb = C_INK

# Bottom Strategy Summary
bot2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(8.35), Inches(18.0), Inches(1.4))
bot2.fill.solid()
bot2.fill.fore_color.rgb = RGBColor(0xEE, 0xF2, 0xFF)
bot2.line.color.rgb = C_NAVY
bot2.line.width = Pt(1.5)
b2_tf = bot2.text_frame
b2_tf.word_wrap = True
b2_p = b2_tf.paragraphs[0]
b2_p.text = "🎯 Định Hướng 2026: Lấy bảo mật dữ liệu làm nền móng và lấy mạng lưới Agent tự chủ làm động lực tăng trưởng đột phá."
b2_p.font.name = "Calibri"
b2_p.font.size = Pt(24)
b2_p.font.bold = True
b2_p.font.color.rgb = C_NAVY

# ==========================================
# SLIDE 3: KPI Dashboard (3 Hero Metrics)
# ==========================================
s3 = prs.slides.add_slide(blank_layout)
add_base_decorations(s3, "DASHBOARD CHỈ SỐ MỤC TIÊU HẠ TẦNG AI AGENT 2026", "Mục tiêu định lượng cam kết cho toàn bộ hệ thống chuyển đổi số doanh nghiệp 2026")

kpi_cards = [
    ("TỐC ĐỘ XỬ LÝ", "X5 LẦN", "Tăng tốc độ tổng hợp báo cáo tài chính & kỹ thuật", C_CYAN),
    ("CHI PHÍ VẬN HÀNH", "-40%", "Cắt giảm chi phí nhân sự và thời gian nhập liệu thủ công", C_EMERALD),
    ("ĐỘ CHÍNH XÁC", "99.8%", "Độ chính xác truy vấn dữ liệu từ kho tri thức 50TB", C_NAVY)
]

for i, (k_lbl, k_val, k_sub, k_col) in enumerate(kpi_cards):
    kx = Inches(1.0 + i * 6.2)
    k_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, kx, Inches(2.8), Inches(5.8), Inches(3.6))
    k_box.fill.solid()
    k_box.fill.fore_color.rgb = C_CARD
    k_box.line.color.rgb = k_col
    k_box.line.width = Pt(2.5)

    ktf = k_box.text_frame
    ktf.word_wrap = True

    kp0 = ktf.paragraphs[0]
    kp0.text = k_lbl
    kp0.alignment = PP_ALIGN.CENTER
    kp0.font.name = "Calibri"
    kp0.font.size = Pt(24)
    kp0.font.bold = True
    kp0.font.color.rgb = C_MUTED
    kp0.space_after = Pt(4)

    kp1 = ktf.add_paragraph()
    kp1.text = k_val
    kp1.alignment = PP_ALIGN.CENTER
    kp1.font.name = "Calibri"
    kp1.font.size = Pt(56)
    kp1.font.bold = True
    kp1.font.color.rgb = k_col
    kp1.space_after = Pt(6)

    kp2 = ktf.add_paragraph()
    kp2.text = k_sub
    kp2.alignment = PP_ALIGN.CENTER
    kp2.font.name = "Calibri"
    kp2.font.size = Pt(24)
    kp2.font.color.rgb = C_INK

# 2 Operational Insight Boxes
diag_boxes = [
    ("Khả Năng Xử Lý Đồng Thời", "Hạ tầng cụm Kubernetes chịu tải 500 yêu cầu/giây với độ trễ phản hồi dưới 50ms.", Inches(1.0), C_NAVY),
    ("Thời Gian Thu Hồi Vốn (Payback)", "Điểm hòa vốn đạt được chính xác sau 12 tháng vận hành chính thức từ nguồn tiết kiệm.", Inches(10.2), C_EMERALD)
]

for d_title, d_body, d_x, d_color in diag_boxes:
    db = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, d_x, Inches(6.75), Inches(8.8), Inches(3.0))
    db.fill.solid()
    db.fill.fore_color.rgb = C_CARD
    db.line.color.rgb = d_color
    db.line.width = Pt(2.0)
    dtf = db.text_frame
    dtf.word_wrap = True

    dp0 = dtf.paragraphs[0]
    dp0.text = f"💡 {d_title}"
    dp0.font.name = "Calibri"
    dp0.font.size = Pt(26)
    dp0.font.bold = True
    dp0.font.color.rgb = d_color
    dp0.space_after = Pt(8)

    dp1 = dtf.add_paragraph()
    dp1.text = d_body
    dp1.font.name = "Calibri"
    dp1.font.size = Pt(24)
    dp1.font.color.rgb = C_INK

# ==========================================
# SLIDE 4: Card Comparison (4 Thế Hệ AI)
# ==========================================
s4 = prs.slides.add_slide(blank_layout)
add_base_decorations(s4, "SO SÁNH 4 THẾ HỆ TIẾN HÓA CỦA TRÍ TUỆ NHÂN TẠO", "Đánh giá sự chuyển dịch từ tự động hóa kịch bản tĩnh đến mạng lưới Multi-Agent tự chủ")

gen_cards = [
    ("THẾ HỆ 1", "Script Tĩnh", "50%", "Chỉ chạy quy tắc lặp lại cứng nhắc.", False),
    ("THẾ HỆ 2", "Chatbot LLM", "75%", "Hỏi đáp văn bản nhưng không kết nối công cụ.", False),
    ("THẾ HỆ 3", "Single MCP", "92%", "Gọi tool ngoài và truy vấn cơ sở dữ liệu SQL.", False),
    ("THẾ HỆ 4", "Multi-Agent A2A", "99.8%", "Phân rã tác vụ tự chủ và điều phối đa Agent.", True)
]

for i, (g_badge, g_val, g_score, g_desc, is_hero) in enumerate(gen_cards):
    gx = Inches(1.0 + i * 4.6)
    gw = Inches(4.25)
    gh = Inches(6.2)
    gy = Inches(2.8)

    gbox = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, gx, gy, gw, gh)
    gbox.fill.solid()
    gbox.fill.fore_color.rgb = RGBColor(0xEE, 0xF9, 0xFF) if is_hero else C_CARD
    gbox.line.color.rgb = C_CYAN if is_hero else C_BORDER
    gbox.line.width = Pt(3.5 if is_hero else 1.5)

    gtf = gbox.text_frame
    gtf.word_wrap = True

    gp0 = gtf.paragraphs[0]
    gp0.text = g_badge + (" (TỐI ƯU)" if is_hero else "")
    gp0.alignment = PP_ALIGN.CENTER
    gp0.font.name = "Calibri"
    gp0.font.size = Pt(24)
    gp0.font.bold = True
    gp0.font.color.rgb = C_CYAN if is_hero else C_MUTED
    gp0.space_after = Pt(8)

    gp1 = gtf.add_paragraph()
    gp1.text = g_val
    gp1.alignment = PP_ALIGN.CENTER
    gp1.font.name = "Calibri"
    gp1.font.size = Pt(28)
    gp1.font.bold = True
    gp1.font.color.rgb = C_NAVY
    gp1.space_after = Pt(12)

    gp2 = gtf.add_paragraph()
    gp2.text = f"Hiệu Năng: {g_score}"
    gp2.alignment = PP_ALIGN.CENTER
    gp2.font.name = "Calibri"
    gp2.font.size = Pt(32)
    gp2.font.bold = True
    gp2.font.color.rgb = C_CYAN if is_hero else C_NAVY
    gp2.space_after = Pt(14)

    gp3 = gtf.add_paragraph()
    gp3.text = g_desc
    gp3.font.name = "Calibri"
    gp3.font.size = Pt(24)
    gp3.font.color.rgb = C_INK

# Bottom Takeaway
bot4 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.35), Inches(18.0), Inches(1.15))
bot4.fill.solid()
bot4.fill.fore_color.rgb = C_NAVY
bot4.line.fill.background()
b4_p = bot4.text_frame.paragraphs[0]
b4_p.text = "🎯 Đột Phá Kỹ Thuật: Mô hình Multi-Agent A2A là chuẩn mực vận hành tự chủ cốt lõi cho doanh nghiệp năm 2026."
b4_p.font.name = "Calibri"
b4_p.font.size = Pt(24)
b4_p.font.bold = True
b4_p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

# ==========================================
# SLIDE 5: Process Timeline (Roadmap 5 Bước)
# ==========================================
s5 = prs.slides.add_slide(blank_layout)
add_base_decorations(s5, "LỘ TRÌNH 5 GIAI ĐOẠN TRIỂN KHAI HẠ TẦNG 2026", "Kế hoạch tuần tự 5 giai đoạn bảo đảm tính liên tục của hoạt động sản xuất")

steps_data = [
    ("01", "Khảo Sát", "Rà soát dữ liệu và phân tích nhu cầu 8 phòng ban.", False),
    ("02", "Thử Nghiệm", "Dựng máy chủ MCP Server kết nối cơ sở dữ liệu SQL.", False),
    ("03", "Đóng Gói A2A", "Thiết lập giao thức Agent-to-Agent và phân quyền RBAC.", True),
    ("04", "Triển Khai", "Đồng bộ hạ tầng Hybrid Cloud và Canva REST API.", False),
    ("05", "Tối Ưu Hóa", "Giám sát SLA 99.99%, kiểm toán chi phí và mở rộng.", False)
]

for i, (num, s_title, s_desc, is_hero) in enumerate(steps_data):
    sx = Inches(1.0 + i * 3.65)
    sw = Inches(3.4)
    sh = Inches(5.8)
    sy = Inches(2.9)

    sbox = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, sx, sy, sw, sh)
    sbox.fill.solid()
    sbox.fill.fore_color.rgb = RGBColor(0xEE, 0xF9, 0xFF) if is_hero else C_CARD
    sbox.line.color.rgb = C_CYAN if is_hero else C_BORDER
    sbox.line.width = Pt(3.0 if is_hero else 1.5)

    stf = sbox.text_frame
    stf.word_wrap = True

    # Step Badge Circle
    circle = s5.shapes.add_shape(MSO_SHAPE.OVAL, sx + Inches(0.2), sy + Inches(0.25), Inches(0.9), Inches(0.9))
    circle.fill.solid()
    circle.fill.fore_color.rgb = C_CYAN if is_hero else C_NAVY
    circle.line.fill.background()
    cp = circle.text_frame.paragraphs[0]
    cp.text = num
    cp.alignment = PP_ALIGN.CENTER
    cp.font.name = "Calibri"
    cp.font.size = Pt(28)
    cp.font.bold = True
    cp.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    sp0 = stf.paragraphs[0]
    sp0.text = "\n\n" + s_title
    sp0.font.name = "Calibri"
    sp0.font.size = Pt(26)
    sp0.font.bold = True
    sp0.font.color.rgb = C_NAVY
    sp0.space_after = Pt(12)

    sp1 = stf.add_paragraph()
    sp1.text = s_desc
    sp1.font.name = "Calibri"
    sp1.font.size = Pt(24)
    sp1.font.color.rgb = C_INK

# Bottom Timeline Rule
bot5 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.1), Inches(18.0), Inches(1.2))
bot5.fill.solid()
bot5.fill.fore_color.rgb = RGBColor(0xEE, 0xF2, 0xFF)
bot5.line.color.rgb = C_NAVY
bot5.line.width = Pt(1.5)
b5_p = bot5.text_frame.paragraphs[0]
b5_p.text = "⏱️ Tiến Độ Dự Kiến: Hoàn thành toàn bộ 5 giai đoạn sau 6 tháng thực hiện mà không gây gián đoạn sản xuất."
b5_p.font.name = "Calibri"
b5_p.font.size = Pt(24)
b5_p.font.bold = True
b5_p.font.color.rgb = C_NAVY

# Save first 5 slides checkpoint
prs.save(OUTPUT_PATH)
print("✅ Đã dựng xong 5 slide đầu tiên.")

# ==========================================
# SLIDE 6: SWOT Matrix (2x2 Grid)
# ==========================================
s6 = prs.slides.add_slide(blank_layout)
add_base_decorations(s6, "MA TRẬN SWOT TRIỂN KHAI AI AGENT DOANH NGHIỆP", "Đánh giá 4 khía cạnh kỹ thuật, vận hành và quản trị an toàn thông tin năm 2026")

swot_quads = [
    ("STRENGTHS (ĐIỂM MẠNH)", C_EMERALD, RGBColor(0xEC, 0xFD, 0xF5), Inches(1.0), Inches(2.8),
     "• Tự động hóa 80% tác vụ văn phòng định kỳ.\n• Tốc độ xử lý dữ liệu lớn tăng gấp 5 lần.\n• Độ chính xác truy vấn thông tin đạt 99.8%."),
    
    ("WEAKNESSES (ĐIỂM YẾU)", C_ROSE, RGBColor(0xFF, 0xF1, 0xF2), Inches(10.2), Inches(2.8),
     "• Chi phí đào tạo nhân sự ban đầu khoảng 200 triệu VNĐ.\n• Đòi hỏi chuẩn hóa dữ liệu cũ 50TB.\n• Phụ thuộc vào năng lực hạ tầng tính toán cục bộ."),
    
    ("OPPORTUNITIES (CƠ HỘI)", C_CYAN, RGBColor(0xEE, 0xF9, 0xFF), Inches(1.0), Inches(6.1),
     "• Mở rộng hơn 50 công cụ chuyên biệt qua MCP.\n• Dẫn đầu chuyển đổi số trong ngành năm 2026.\n• Tiết kiệm 450 triệu VNĐ chi phí thuê ngoài."),
    
    ("THREATS (THÁCH THỨC)", C_AMBER, RGBColor(0xFF, 0xFB, 0xEB), Inches(10.2), Inches(6.1),
     "• Nguy cơ rò rỉ dữ liệu nếu thiếu cơ chế Air-gapped.\n• Biến động chuẩn công nghệ API quốc tế.\n• Hiện tượng Data Drift cần giám sát liên tục.")
]

for title_q, col_border, col_bg, qx, qy, content_q in swot_quads:
    qbox = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, qx, qy, Inches(8.8), Inches(3.0))
    qbox.fill.solid()
    qbox.fill.fore_color.rgb = col_bg
    qbox.line.color.rgb = col_border
    qbox.line.width = Pt(2.0)

    qtf = qbox.text_frame
    qtf.word_wrap = True

    qp0 = qtf.paragraphs[0]
    qp0.text = title_q
    qp0.font.name = "Calibri"
    qp0.font.size = Pt(26)
    qp0.font.bold = True
    qp0.font.color.rgb = col_border
    qp0.space_after = Pt(8)

    qp1 = qtf.add_paragraph()
    qp1.text = content_q
    qp1.font.name = "Calibri"
    qp1.font.size = Pt(24)
    qp1.font.color.rgb = C_INK

# Bottom Takeaway
bot6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.35), Inches(18.0), Inches(1.2))
bot6.fill.solid()
bot6.fill.fore_color.rgb = C_NAVY
bot6.line.fill.background()
b6_p = bot6.text_frame.paragraphs[0]
b6_p.text = "🎯 Chiến Lược: Tối ưu hóa điểm mạnh để nắm bắt cơ hội, đồng thời kiểm soát 100% rủi ro qua cơ chế Air-gapped."
b6_p.font.name = "Calibri"
b6_p.font.size = Pt(24)
b6_p.font.bold = True
b6_p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

# ==========================================
# SLIDE 7: Team Grid (Lưới 6 Chuyên Gia 3x2)
# ==========================================
s7 = prs.slides.add_slide(blank_layout)
add_base_decorations(s7, "BAN ĐIỀU HÀNH DỰ ÁN HẠ TẦNG AI AGENT ENTERPRISE", "Đội ngũ 6 chuyên gia nòng cốt phụ trách 100% các mảng kiến trúc, dữ liệu và kiểm định")

members_data = [
    ("Duy Lê", "Lead AI Architect", "Chủ trì thiết kế kiến trúc hệ thống và giao thức A2A với 10+ năm kinh nghiệm."),
    ("Minh Tran", "Senior AI Engineer", "Phát triển các mô hình LLM chuyên biệt và 20+ MCP Servers nội bộ."),
    ("Linh Pham", "Data Specialist", "Chuẩn hóa luồng dữ liệu lớn 50TB và cơ sở tri thức Vector DB doanh nghiệp."),
    ("Hoang Nguyen", "Security Lead", "Giám sát an ninh mạng, mã hóa dữ liệu AES-256 và tuân thủ GDPR/FERPA."),
    ("Phuong Do", "Cloud Architect", "Vận hành hạ tầng cụm 64 node Docker, Kubernetes và Cloud Gateway."),
    ("Anh Vu", "QA & Audit Lead", "Kiểm định tự động chất lượng bài trình chiếu và kiểm thử hệ thống đạt 99.9%.")
]

for idx, (m_name, m_role, m_bio) in enumerate(members_data):
    col_idx = idx % 3
    row_idx = idx // 3
    mx = Inches(1.0 + col_idx * 6.2)
    my = Inches(2.8 + row_idx * 3.3)

    mbox = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, my, Inches(5.8), Inches(3.0))
    mbox.fill.solid()
    mbox.fill.fore_color.rgb = C_CARD
    mbox.line.color.rgb = C_BORDER
    mbox.line.width = Pt(1.5)

    # Avatar Circle with Initials
    av = s7.shapes.add_shape(MSO_SHAPE.OVAL, mx + Inches(0.3), my + Inches(0.4), Inches(1.2), Inches(1.2))
    av.fill.solid()
    av.fill.fore_color.rgb = C_NAVY if idx == 0 else RGBColor(0x1E, 0x3E, 0x62)
    av.line.color.rgb = C_CYAN
    av.line.width = Pt(2.0)
    av_tf = av.text_frame
    av_p = av_tf.paragraphs[0]
    av_p.text = m_name[:2].upper()
    av_p.alignment = PP_ALIGN.CENTER
    av_p.font.name = "Calibri"
    av_p.font.size = Pt(26)
    av_p.font.bold = True
    av_p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # Info Textbox
    tb_m = s7.shapes.add_textbox(mx + Inches(1.65), my + Inches(0.25), Inches(3.9), Inches(2.5))
    mtf = tb_m.text_frame
    mtf.word_wrap = True

    mp0 = mtf.paragraphs[0]
    mp0.text = m_name
    mp0.font.name = "Calibri"
    mp0.font.size = Pt(26)
    mp0.font.bold = True
    mp0.font.color.rgb = C_NAVY
    mp0.space_after = Pt(2)

    mp1 = mtf.add_paragraph()
    mp1.text = m_role
    mp1.font.name = "Calibri"
    mp1.font.size = Pt(24)
    mp1.font.bold = True
    mp1.font.color.rgb = C_CYAN
    mp1.space_after = Pt(6)

    mp2 = mtf.add_paragraph()
    mp2.text = m_bio
    mp2.font.name = "Calibri"
    mp2.font.size = Pt(24)
    mp2.font.color.rgb = C_INK

# Bottom Team Takeaway
bot7 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.6), Inches(18.0), Inches(1.15))
bot7.fill.solid()
bot7.fill.fore_color.rgb = RGBColor(0xEE, 0xF2, 0xFF)
bot7.line.color.rgb = C_NAVY
bot7.line.width = Pt(1.5)
b7_p = bot7.text_frame.paragraphs[0]
b7_p.text = "🎯 Năng Lực Đội Ngũ: Ban dự án gồm 6 chuyên gia nòng cốt với 100% chứng chỉ quốc tế về AI, Data & Cloud Architecture."
b7_p.font.name = "Calibri"
b7_p.font.size = Pt(24)
b7_p.font.bold = True
b7_p.font.color.rgb = C_NAVY

# Save checkpoint
prs.save(OUTPUT_PATH)
print("✅ Đã dựng xong 7 slide đầu tiên.")

# Helper for Split Slides
def build_clean_split_slide(slide_num, title, left_head, left_bullets, right_head, right_bullets, takeaway):
    s = prs.slides.add_slide(blank_layout)
    add_base_decorations(s, title, "Quy chuẩn kỹ thuật và kiến trúc vận hành hệ thống năm 2026")

    # Left Panel
    lp = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.8), Inches(8.8), Inches(6.2))
    lp.fill.solid()
    lp.fill.fore_color.rgb = C_CARD
    lp.line.color.rgb = C_NAVY
    lp.line.width = Pt(2.0)
    
    # Top Stripe
    s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(2.8), Inches(8.8), Inches(0.15)).fill.solid()
    
    ltf = lp.text_frame
    ltf.word_wrap = True
    lp0 = ltf.paragraphs[0]
    lp0.text = left_head
    lp0.font.name = "Calibri"
    lp0.font.size = Pt(26)
    lp0.font.bold = True
    lp0.font.color.rgb = C_NAVY
    lp0.space_after = Pt(12)

    for b_title, b_desc in left_bullets:
        bp_t = ltf.add_paragraph()
        bp_t.text = f"▶ {b_title}"
        bp_t.font.name = "Calibri"
        bp_t.font.size = Pt(24)
        bp_t.font.bold = True
        bp_t.font.color.rgb = C_CYAN
        
        bp_d = ltf.add_paragraph()
        bp_d.text = b_desc
        bp_d.font.name = "Calibri"
        bp_d.font.size = Pt(24)
        bp_d.font.color.rgb = C_INK
        bp_d.space_after = Pt(10)

    # Right Panel
    rp = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.2), Inches(2.8), Inches(8.8), Inches(6.2))
    rp.fill.solid()
    rp.fill.fore_color.rgb = C_CARD
    rp.line.color.rgb = C_CYAN
    rp.line.width = Pt(2.0)

    rtf = rp.text_frame
    rtf.word_wrap = True
    rp0 = rtf.paragraphs[0]
    rp0.text = right_head
    rp0.font.name = "Calibri"
    rp0.font.size = Pt(26)
    rp0.font.bold = True
    rp0.font.color.rgb = C_CYAN
    rp0.space_after = Pt(12)

    for b_title, b_desc in right_bullets:
        bp_t = rtf.add_paragraph()
        bp_t.text = f"▶ {b_title}"
        bp_t.font.name = "Calibri"
        bp_t.font.size = Pt(24)
        bp_t.font.bold = True
        bp_t.font.color.rgb = C_NAVY

        bp_d = rtf.add_paragraph()
        bp_d.text = b_desc
        bp_d.font.name = "Calibri"
        bp_d.font.size = Pt(24)
        bp_d.font.color.rgb = C_INK
        bp_d.space_after = Pt(10)

    # Takeaway Banner
    bot = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.25), Inches(18.0), Inches(1.2))
    bot.fill.solid()
    bot.fill.fore_color.rgb = RGBColor(0xEE, 0xF2, 0xFF)
    bot.line.color.rgb = C_NAVY
    bot.line.width = Pt(1.5)
    b_p = bot.text_frame.paragraphs[0]
    b_p.text = f"🎯 Kết Luận Chiến Lược: {takeaway}"
    b_p.font.name = "Calibri"
    b_p.font.size = Pt(24)
    b_p.font.bold = True
    b_p.font.color.rgb = C_NAVY

# ==========================================
# SLIDE 8: Architecture Diagram (Phân Tầng 3 Lớp)
# ==========================================
build_clean_split_slide(
    8,
    "KIẾN TRÚC PHÂN TẦNG 3 LỚP HỆ THỐNG AI AGENT",
    "TẦNG TƯƠNG TÁC AGENT & GIAO THỨC TRUNG CHUYỂN",
    [
        ("Tầng Ứng Dụng Agent", "Điều phối các tác nhân AI phân tích, soạn thảo và kiểm toán tự chủ."),
        ("Tầng Giao Thức MCP Gateway", "Chuẩn hóa bản tin JSON-RPC qua stdio và Streamable HTTP tốc độ cao.")
    ],
    "TẦNG DỮ LIỆU DOANH NGHIỆP & BẢO MẬT",
    [
        ("Tầng Kết Nối Dữ Liệu SQL & ERP", "Truy vấn an toàn kho dữ liệu 50TB mà không lộ thông tin mật."),
        ("Tường Lửa An Ninh Zero-Trust", "Xác thực OAuth2 PKCE và mã hóa hai đầu mút độ trễ dưới 15ms.")
    ],
    "Tách biệt rõ ràng giữa logic nghiệp vụ và tầng dữ liệu giúp hệ thống mở rộng không giới hạn."
)

# ==========================================
# SLIDE 9: Protocol Analysis (So Sánh 3 Giao Thức)
# ==========================================
s9 = prs.slides.add_slide(blank_layout)
add_base_decorations(s9, "PHÂN TÍCH SO SÁNH 3 GIAO THỨC KẾT NỐI AI", "Lựa chọn chuẩn giao tiếp tối ưu cho hệ thống doanh nghiệp thế hệ mới")

proto_cards = [
    ("ACP PROTOCOL", "REST API Cũ", "Độ trễ cao (>300ms)", "Mô hình Client-Server tĩnh, khó chia sẻ ngữ cảnh.", False),
    ("MCP PROTOCOL", "JSON-RPC 2.0", "Độ trễ thấp (<20ms)", "Chuẩn hóa kết nối Tool & Resource, kiểm soát RBAC chặt chẽ.", False),
    ("A2A PROTOCOL", "Mesh Network", "Độ trễ tối ưu (<10ms)", "Tương tác thời gian thực đa Agent, phân rã tác vụ tự chủ 99.8%.", True)
]

for i, (p_name, p_mech, p_lat, p_desc, is_hero) in enumerate(proto_cards):
    px = Inches(1.0 + i * 6.2)
    pbox = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(2.8), Inches(5.8), Inches(6.2))
    pbox.fill.solid()
    pbox.fill.fore_color.rgb = RGBColor(0xEE, 0xF9, 0xFF) if is_hero else C_CARD
    pbox.line.color.rgb = C_CYAN if is_hero else C_BORDER
    pbox.line.width = Pt(3.0 if is_hero else 1.5)

    ptf = pbox.text_frame
    ptf.word_wrap = True

    pp0 = ptf.paragraphs[0]
    pp0.text = p_name + (" (KHUYẾN NGHỊ)" if is_hero else "")
    pp0.alignment = PP_ALIGN.CENTER
    pp0.font.name = "Calibri"
    pp0.font.size = Pt(26)
    pp0.font.bold = True
    pp0.font.color.rgb = C_CYAN if is_hero else C_NAVY
    pp0.space_after = Pt(10)

    pp1 = ptf.add_paragraph()
    pp1.text = f"Cơ Chế: {p_mech}"
    pp1.font.name = "Calibri"
    pp1.font.size = Pt(24)
    pp1.font.bold = True
    pp1.font.color.rgb = C_INK
    pp1.space_after = Pt(6)

    pp2 = ptf.add_paragraph()
    pp2.text = f"Hiệu Năng: {p_lat}"
    pp2.font.name = "Calibri"
    pp2.font.size = Pt(24)
    pp2.font.bold = True
    pp2.font.color.rgb = C_CYAN if is_hero else C_NAVY
    pp2.space_after = Pt(12)

    pp3 = ptf.add_paragraph()
    pp3.text = p_desc
    pp3.font.name = "Calibri"
    pp3.font.size = Pt(24)
    pp3.font.color.rgb = C_INK

bot9 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.35), Inches(18.0), Inches(1.2))
bot9.fill.solid()
bot9.fill.fore_color.rgb = C_NAVY
bot9.line.fill.background()
b9_p = bot9.text_frame.paragraphs[0]
b9_p.text = "🎯 Đánh Giá: Kết hợp giao thức MCP và A2A Protocol tạo nên hạ tầng kết nối mạnh mẽ và bảo mật nhất năm 2026."
b9_p.font.name = "Calibri"
b9_p.font.size = Pt(24)
b9_p.font.bold = True
b9_p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

# ==========================================
# SLIDE 10: Canvas & Canva Integration
# ==========================================
build_clean_split_slide(
    10,
    "TÍCH HỢP HỆ THỐNG CANVAS VÀ CANVA CLOUD REST API",
    "TRÍCH XUẤT DỮ LIỆU TỪ CANVAS LMS",
    [
        ("Trích Xuất Kết Quả Học Tập", "Tự động lấy điểm số và kết quả 5,000 học viên qua Canvas REST API."),
        ("Chuẩn Hóa JSON Đầu Vào", "Chuyển đổi dữ liệu bảng tính thô sang định dạng JSON có cấu trúc trong 3 giây.")
    ],
    "ĐỒNG BỘ HAI CHIỀU LÊN CANVA CLOUD",
    [
        ("Sinh Thiết Kế Tự Động", "Đẩy slide và infographic lên Canva Cloud qua token bảo mật chính thức."),
        ("Vòng Lặp Phản Hồi Trực Tiếp", "Nhận bình luận của giảng viên và tự động cập nhật bài giảng trong 10 giây.")
    ],
    "Quy trình khép kín tự động hóa từ dữ liệu học tập đến ấn phẩm trình chiếu trực quan đa phương tiện."
)

# ==========================================
# SLIDE 11: Security & Compliance
# ==========================================
build_clean_split_slide(
    11,
    "TIÊU CHUẨN BẢO MẬT & TUÂN THỦ PHÁP LÝ QUỐC TẾ",
    "CƠ CHẾ BẢO MẬT KỸ THUẬT NỘI BỘ",
    [
        ("Xác Thực OAuth2 & RBAC", "Phân quyền truy cập tài nguyên nghiêm ngặt theo vai trò người dùng."),
        ("Hạ Tầng Cụm Air-Gapped", "Tách biệt máy chủ xử lý dữ liệu mật khỏi mạng internet công cộng.")
    ],
    "TUÂN THỦ PHÁP LÝ FERPA & GDPR",
    [
        ("Ẩn Danh Dữ Liệu Định Danh PII", "Mã hóa thông tin cá nhân học viên/nhân viên trước khi đưa vào mô hình."),
        ("Nhật Ký Kiểm Toán Bất Biến", "Lưu vết 100% lịch sử truy vấn của AI phục vụ thanh tra nội bộ.")
    ],
    "Đáp ứng 100% các tiêu chuẩn an ninh thông tin khắt khe nhất của ngành giáo dục và tài chính quốc tế."
)

# ==========================================
# SLIDE 12: Cost & ROI Table
# ==========================================
s12 = prs.slides.add_slide(blank_layout)
add_base_decorations(s12, "PHÂN TÍCH HIỆU QUẢ ĐẦU TƯ TÀI CHÍNH & CHỈ SỐ ROI", "Đánh giá ngân sách triển khai và lợi ích kinh tế định lượng giai đoạn 2026 - 2028")

roi_kpis = [
    ("VỐN ĐẦU TƯ BAN ĐẦU", "1.2 TỶ VNĐ", "Chi phí máy chủ, bản quyền phần mềm và đào tạo", C_NAVY),
    ("THỜI GIAN HÒA VỐN", "12 THÁNG", "Thu hồi vốn qua cắt giảm 1,800 giờ lao động thủ công", C_EMERALD),
    ("TỶ SUẤT HOÀN VỐN (ROI)", "+320%", "Lợi nhuận ròng tích lũy dự kiến sau 3 năm vận hành", C_CYAN)
]

for i, (r_lbl, r_val, r_sub, r_col) in enumerate(roi_kpis):
    rx = Inches(1.0 + i * 6.2)
    rbox = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, rx, Inches(2.8), Inches(5.8), Inches(3.6))
    rbox.fill.solid()
    rbox.fill.fore_color.rgb = C_CARD
    rbox.line.color.rgb = r_col
    rbox.line.width = Pt(2.5)

    rtf = rbox.text_frame
    rtf.word_wrap = True

    rp0 = rtf.paragraphs[0]
    rp0.text = r_lbl
    rp0.alignment = PP_ALIGN.CENTER
    rp0.font.name = "Calibri"
    rp0.font.size = Pt(24)
    rp0.font.bold = True
    rp0.font.color.rgb = C_MUTED
    rp0.space_after = Pt(4)

    rp1 = rtf.add_paragraph()
    rp1.text = r_val
    rp1.alignment = PP_ALIGN.CENTER
    rp1.font.name = "Calibri"
    rp1.font.size = Pt(56)
    rp1.font.bold = True
    rp1.font.color.rgb = r_col
    rp1.space_after = Pt(6)

    rp2 = rtf.add_paragraph()
    rp2.text = r_sub
    rp2.alignment = PP_ALIGN.CENTER
    rp2.font.name = "Calibri"
    rp2.font.size = Pt(24)
    rp2.font.color.rgb = C_INK

# Financial Insight Cards
s12_insights = [
    ("Cơ Cấu Tiết Giảm Chi Phí", "Cắt giảm 450 triệu VNĐ chi phí thuê ngoài dịch vụ thiết kế và nhập liệu mỗi năm.", Inches(1.0)),
    ("Giá Trị Thặng Dư Kinh Tế", "Dự án tạo ra giá trị kinh tế tương đương 3.8 tỷ VNĐ cho doanh nghiệp trong 3 năm đầu.", Inches(10.2))
]

for in_title, in_desc, in_x in s12_insights:
    ibox = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, in_x, Inches(6.75), Inches(8.8), Inches(3.0))
    ibox.fill.solid()
    ibox.fill.fore_color.rgb = C_CARD
    ibox.line.color.rgb = C_BORDER
    ibox.line.width = Pt(2.0)
    itf = ibox.text_frame
    itf.word_wrap = True
    
    ip0 = itf.paragraphs[0]
    ip0.text = f"💰 {in_title}"
    ip0.font.name = "Calibri"
    ip0.font.size = Pt(26)
    ip0.font.bold = True
    ip0.font.color.rgb = C_NAVY
    ip0.space_after = Pt(8)

    ip1 = itf.add_paragraph()
    ip1.text = in_desc
    ip1.font.name = "Calibri"
    ip1.font.size = Pt(24)
    ip1.font.color.rgb = C_INK

# Save checkpoint
prs.save(OUTPUT_PATH)
print("✅ Đã dựng xong 12 slide.")

# ==========================================
# SLIDE 13: Technical Spec (Canva MCP Pro v3.0)
# ==========================================
build_clean_split_slide(
    13,
    "THÔNG SỐ KỸ THUẬT MÁY CHỦ CANVA MCP PRO v3.0",
    "CẤU TRÚC PHẦN MỀM & GIAO THỨC LÕI",
    [
        ("TypeScript SDK v2", "Phát triển trên nền tảng Model Context Protocol chuẩn hóa quốc tế."),
        ("Hybrid Rendering Engine", "Kết hợp Python-pptx ngoại tuyến và Canva Connect REST API 2 chiều.")
    ],
    "MÔI TRƯỜNG SANDBOX & BẢNG MÀU",
    [
        ("Local Code Sandbox", "Thực thi script Python/JS tính toán tọa độ vector tức thì với độ trễ <15ms."),
        ("Thư Viện 57 Bảng Màu", "Tích hợp chuẩn nhận diện thương hiệu doanh nghiệp và các palette quốc tế.")
    ],
    "Đạt hiệu năng xử lý dưới 15ms cho mỗi thao tác dựng hình vector trực tiếp tại máy cục bộ."
)

# ==========================================
# SLIDE 14: Quality Audit (Deck-Auditor Pipeline)
# ==========================================
build_clean_split_slide(
    14,
    "QUY TRÌNH KIỂM DUYỆT TỰ ĐỘNG DECK-AUDITOR",
    "QUY CHUẨN THIẾT KẾ VÀ KHÔNG GIAN SLIDE",
    [
        ("Cỡ Chữ Tối Thiểu 24pt", "Tuyệt đối không sử dụng chữ nhỏ dưới 24pt trong toàn bộ phần nội dung slide."),
        ("Cân Bằng Khoảng Trống An Toàn", "Duy trì lề tối thiểu 0.8 inch để ngăn chặn hoàn toàn hiện tượng tràn văn bản.")
    ],
    "KIỂM ĐỊNH NỘI DUNG VÀ SỐ LIỆU THỰC CHỨNG",
    [
        ("Bộ Lọc Chặn Anti-Slop", "Loại bỏ hoàn toàn các từ sáo rỗng AI và quảng cáo vô căn cứ."),
        ("Bắt Buộc Số Liệu Cụ Thể", "Mỗi slide bắt buộc phải có tỷ lệ %, số đo mẫu hoặc mốc thời gian kiểm chứng.")
    ],
    "Tự động chấm điểm thẩm mỹ và từ chối xuất bản các bài trình chiếu dưới 85 điểm Taste Score."
)

# ==========================================
# SLIDE 15: Case Study 1 (Báo Cáo Tài Chính)
# ==========================================
build_clean_split_slide(
    15,
    "ĐIỂN HÌNH 1: TỰ ĐỘNG HÓA BÁO CÁO TÀI CHÍNH HÀNG THÁNG",
    "HIỆN TRẠNG QUY TRÌNH THỦ CÔNG CŨ",
    [
        ("Mất 24 Giờ Tổng Hợp Dữ Liệu", "Chuyên viên mất 3 ngày làm việc để ghép dữ liệu kế toán từ file CSV vào slide."),
        ("Tỷ Lệ Sai Sót Số Liệu 3.5%", "Thường xuyên nhầm lẫn số liệu các chỉ số tài chính do thao tác thủ công.")
    ],
    "KẾT QUẢ ĐỘT PHÁ VỚI DATA-TO-SLIDE",
    [
        ("Rút Ngắn Thời Gian Còn 5 Phút", "Tool tự động đọc tệp dữ liệu CSV/JSON và sinh 15 slide hoàn chỉnh."),
        ("Độ Chính Xác Đạt Tuyệt Đối 100%", "Loại bỏ hoàn toàn lỗi sao chép dữ liệu của con người, tiết kiệm 280 giờ công.")
    ],
    "Tiết kiệm 280 giờ công mỗi năm cho phòng tài chính và kiểm toán nội bộ của doanh nghiệp."
)

# ==========================================
# SLIDE 16: Case Study 2 (Canva Comments Loop)
# ==========================================
build_clean_split_slide(
    16,
    "ĐIỂN HÌNH 2: VÒNG LẶP SỬA SLIDE QUA CANVA COMMENTS API",
    "QUY TRÌNH PHÊ DUYỆT TRUYỀN THỐNG",
    [
        ("Chờ Đợi 48 Giờ Qua Email", "Ý kiến góp ý bị phân tán qua nhiều luồng email và ứng dụng nhắn tin rời rạc."),
        ("Xung Đột Phiên Bản Slide", "Dễ ghi đè nhầm lẫn giữa các bản thảo bài thuyết trình của nhiều người sửa.")
    ],
    "TỰ ĐỘNG HÓA VỚI AUTO-FIX COMMENT",
    [
        ("Lắng Nghe Bình Luận Cloud", "Tool canva_read_design_comments tự động quét góp ý của lãnh đạo."),
        ("Tự Động Sửa Slide Trong 15 Giây", "Cập nhật trực tiếp vào slide và phản hồi xác nhận hoàn tất lên Canva Cloud.")
    ],
    "Giảm 90% thời gian duyệt bài trình chiếu giữa ban lãnh đạo và chuyên viên kỹ thuật."
)

# ==========================================
# SLIDE 17: Risk Mitigation (Phương Án Dự Phòng)
# ==========================================
s17 = prs.slides.add_slide(blank_layout)
add_base_decorations(s17, "DANH MỤC RỦI RO HẠ TẦNG & PHƯƠNG ÁN DỰ PHÒNG KHẨN CẤP", "4 nhóm rủi ro vận hành trọng yếu và kịch bản ứng phó kỹ thuật tức thì")

risks_quads = [
    ("RỦI RO MẤT MẠNG", C_ROSE, RGBColor(0xFF, 0xF1, 0xF2), Inches(1.0), Inches(2.8),
     "Mất kết nối Internet:\nTự động chuyển sang chế độ Local Engine ngoại tuyến 100% ngay lập tức mà không gián đoạn thuyết trình."),
    
    ("RỦI RO QUÁ TẢI", C_AMBER, RGBColor(0xFF, 0xFB, 0xEB), Inches(10.2), Inches(2.8),
     "Lưu lượng tăng đột biến:\nKích hoạt cụm Docker phụ và thuật toán cân bằng tải Auto-scaling đảm bảo độ trễ <50ms."),
    
    ("RỦI RO DỮ LIỆU TRÔI DẠT", C_CYAN, RGBColor(0xEE, 0xF9, 0xFF), Inches(1.0), Inches(6.1),
     "Hiện tượng Data Drift:\nThiết lập bộ kiểm định phân phối mẫu dữ liệu định kỳ mỗi tuần để hiệu chỉnh prompt."),
    
    ("RỦI RO TẤN CÔNG MẠNG", C_NAVY, RGBColor(0xEE, 0xF2, 0xFF), Inches(10.2), Inches(6.1),
     "Xâm nhập trái phép:\nCách ly nút mạng nghi vấn trong 5 giây và phục hồi dữ liệu từ bản sao lưu WORM bảo mật.")
]

for r_title, r_border, r_bg, rx, ry, r_desc in risks_quads:
    rbox = s17.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, rx, ry, Inches(8.8), Inches(3.0))
    rbox.fill.solid()
    rbox.fill.fore_color.rgb = r_bg
    rbox.line.color.rgb = r_border
    rbox.line.width = Pt(2.0)

    rtf = rbox.text_frame
    rtf.word_wrap = True

    rp0 = rtf.paragraphs[0]
    rp0.text = f"🛡️ {r_title}"
    rp0.font.name = "Calibri"
    rp0.font.size = Pt(26)
    rp0.font.bold = True
    rp0.font.color.rgb = r_border
    rp0.space_after = Pt(8)

    rp1 = rtf.add_paragraph()
    rp1.text = r_desc
    rp1.font.name = "Calibri"
    rp1.font.size = Pt(24)
    rp1.font.color.rgb = C_INK

bot17 = s17.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.35), Inches(18.0), Inches(1.2))
bot17.fill.solid()
bot17.fill.fore_color.rgb = C_NAVY
bot17.line.fill.background()
b17_p = bot17.text_frame.paragraphs[0]
b17_p.text = "🎯 Cam Kết Vận Hành: Hệ thống bảo đảm chỉ số sẵn sàng cao đạt 99.99% trong mọi tình huống khẩn cấp."
b17_p.font.name = "Calibri"
b17_p.font.size = Pt(24)
b17_p.font.bold = True
b17_p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

# ==========================================
# SLIDE 18: Resource Allocation (Phân Bổ Tài Nguyên)
# ==========================================
s18 = prs.slides.add_slide(blank_layout)
add_base_decorations(s18, "PHÂN BỔ TÀI NGUYÊN MÁY CHỦ & HẠ TẦNG MẠNG", "Thiết lập hạn ngạch phần cứng bảo đảm hiệu năng tối đa cho toàn hệ thống")

res_cards = [
    ("DOCKER KUBERNETES", "64 vCPU / 256GB RAM", "Chạy các tác vụ tính toán nặng và huấn luyện mô hình Agent.", False),
    ("HTTP TRANSPORT", "Băng thông 10 Gbps", "Đảm bảo truyền tải luồng dữ liệu JSON-RPC thời gian thực <10ms.", True),
    ("CLOUD GATEWAY", "Tải 10,000 req/min", "Kiểm soát truy cập API và ngăn chặn tấn công mạng từ bên ngoài.", False)
]

for i, (r_name, r_spec, r_desc, is_hero) in enumerate(res_cards):
    rx = Inches(1.0 + i * 6.2)
    rbox = s18.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, rx, Inches(2.8), Inches(5.8), Inches(6.2))
    rbox.fill.solid()
    rbox.fill.fore_color.rgb = RGBColor(0xEE, 0xF9, 0xFF) if is_hero else C_CARD
    rbox.line.color.rgb = C_CYAN if is_hero else C_BORDER
    rbox.line.width = Pt(3.0 if is_hero else 1.5)

    rtf = rbox.text_frame
    rtf.word_wrap = True

    rp0 = rtf.paragraphs[0]
    rp0.text = r_name + (" (TRỌNG YẾU)" if is_hero else "")
    rp0.alignment = PP_ALIGN.CENTER
    rp0.font.name = "Calibri"
    rp0.font.size = Pt(26)
    rp0.font.bold = True
    rp0.font.color.rgb = C_CYAN if is_hero else C_NAVY
    rp0.space_after = Pt(10)

    rp1 = rtf.add_paragraph()
    rp1.text = f"Cấu Hình: {r_spec}"
    rp1.font.name = "Calibri"
    rp1.font.size = Pt(26)
    rp1.font.bold = True
    rp1.font.color.rgb = C_CYAN if is_hero else C_NAVY
    rp1.space_after = Pt(14)

    rp2 = rtf.add_paragraph()
    rp2.text = r_desc
    rp2.font.name = "Calibri"
    rp2.font.size = Pt(24)
    rp2.font.color.rgb = C_INK

bot18 = s18.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.35), Inches(18.0), Inches(1.2))
bot18.fill.solid()
bot18.fill.fore_color.rgb = C_NAVY
bot18.line.fill.background()
b18_p = bot18.text_frame.paragraphs[0]
b18_p.text = "🎯 Hiệu Quả: Phân bổ tài nguyên thông minh tối ưu hóa 35% chi phí thuê hạ tầng máy chủ đám mây."
b18_p.font.name = "Calibri"
b18_p.font.size = Pt(24)
b18_p.font.bold = True
b18_p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

# ==========================================
# SLIDE 19: Action Plan Q1-Q4 (Kế Hoạch 4 Quý)
# ==========================================
s19 = prs.slides.add_slide(blank_layout)
add_base_decorations(s19, "KẾ HOẠCH HÀNH ĐỘNG CHI TIẾT 4 QUÝ NĂM 2026", "Các mốc bàn giao then chốt để đưa toàn bộ hệ thống vào vận hành chính thức")

quarters = [
    ("QUÝ 1", "Khảo Sát & Chuẩn Bị", "Hoàn thiện kiến trúc và mua sắm cụm máy chủ 64 vCPU.", False),
    ("QUÝ 2", "Triển Khai Thử Nghiệm", "Vận hành thử nghiệm tại 2 ban với 50 người dùng.", False),
    ("QUÝ 3", "Tích Hợp Đa Nền Tảng", "Kết nối Canva Cloud REST API và hệ thống Canvas LMS.", True),
    ("QUÝ 4", "Vận Hành Tự Chủ", "Chuyển giao công nghệ và chính thức vận hành toàn diện.", False)
]

for i, (q_name, q_title, q_desc, is_hero) in enumerate(quarters):
    qx = Inches(1.0 + i * 4.6)
    qbox = s19.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, qx, Inches(2.8), Inches(4.25), Inches(6.2))
    qbox.fill.solid()
    qbox.fill.fore_color.rgb = RGBColor(0xEE, 0xF9, 0xFF) if is_hero else C_CARD
    qbox.line.color.rgb = C_CYAN if is_hero else C_BORDER
    qbox.line.width = Pt(3.0 if is_hero else 1.5)

    qtf = qbox.text_frame
    qtf.word_wrap = True

    qp0 = qtf.paragraphs[0]
    qp0.text = q_name
    qp0.alignment = PP_ALIGN.CENTER
    qp0.font.name = "Calibri"
    qp0.font.size = Pt(32)
    qp0.font.bold = True
    qp0.font.color.rgb = C_CYAN if is_hero else C_NAVY
    qp0.space_after = Pt(10)

    qp1 = qtf.add_paragraph()
    qp1.text = q_title
    qp1.font.name = "Calibri"
    qp1.font.size = Pt(26)
    qp1.font.bold = True
    qp1.font.color.rgb = C_NAVY
    qp1.space_after = Pt(12)

    qp2 = qtf.add_paragraph()
    qp2.text = q_desc
    qp2.font.name = "Calibri"
    qp2.font.size = Pt(24)
    qp2.font.color.rgb = C_INK

bot19 = s19.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(9.35), Inches(18.0), Inches(1.2))
bot19.fill.solid()
bot19.fill.fore_color.rgb = C_NAVY
bot19.line.fill.background()
b19_p = bot19.text_frame.paragraphs[0]
b19_p.text = "🎯 Cam Kết Tiến Độ: Bảo đảm hoàn thành 100% mục tiêu chuyển đổi số đúng tiến độ trong năm 2026."
b19_p.font.name = "Calibri"
b19_p.font.size = Pt(24)
b19_p.font.bold = True
b19_p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

# ==========================================
# SLIDE 20: Closing & Q&A
# ==========================================
build_clean_split_slide(
    20,
    "KẾT LUẬN & PHIÊN THẢO LUẬN HỎI ĐÁP (Q&A)",
    "CAM KẾT HÀNH ĐỘNG CỦA BAN DỰ ÁN",
    [
        ("Chuyển Giao Công Nghệ 100%", "Bàn giao đầy đủ mã nguồn, tài liệu API và đào tạo chuyên sâu."),
        ("Hỗ Trợ Kỹ Thuật 24/7", "Duy trì SLA 99.99% và xử lý mọi sự cố khẩn cấp trong vòng 15 phút.")
    ],
    "THÔNG TIN LIÊN HỆ & THẢO LUẬN (Q&A)",
    [
        ("Chủ Trì & Diễn Giả", "Lê Anh Duy (Lead AI Architect & Systems Engineer)."),
        ("Kênh Trao Đổi Kỹ Thuật", "Email: duyle@enterprise-ai.vn | Hotline: 090-888-2026 | Ban R&D.")
    ],
    "Trân trọng cảm ơn Ban Lãnh Đạo và các Chuyên gia. Xin mời quý đại biểu bước vào phiên thảo luận Q&A!"
)

# Save final presentation
prs.save(OUTPUT_PATH)
print(f"🎉 ĐÃ HOÀN TẤT TẠO BỘ 20 SLIDE MỚI HOÀN TOÀN TẠI:\n{OUTPUT_PATH}")
