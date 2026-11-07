---
name: canva-kpi-dashboard
description: Kỹ năng thiết kế slide Dashboard số liệu chuyên sâu với các thẻ Hero Metrics lớn (56pt), phân loại trạng thái màu sắc (Thành công, Cảnh báo, Quá khớp) và kèm 2 hộp phân tích chuyên sâu (cỡ chữ >= 24pt).
---

# Canva KPI Dashboard Skill

Kỹ năng này chuyên dùng để trình bày số liệu đo lường hiệu năng của mô hình Machine Learning / Trí tuệ Nhân tạo (ví dụ: Train Score, Validation Score, Sensitivity, Specificity, AUC).

## 1. Cấu trúc Slide Chuẩn Mực:
1. **Dải chỉ số Hero Metrics (2 đến 4 cột ngang)**:
   - Nhãn chỉ số: 20pt bold in hoa (`TRAIN SCORE`, `SENSITIVITY`).
   - Giá trị số liệu: **$56\text{ pt}$ bold** cực kỳ nổi bật.
   - Diễn giải ngắn bên dưới: $\ge 24\text{ pt}$.
   - Trạng thái màu (`status`):
     - `danger`: Báo động (ví dụ: Train 100% nghi ngờ quá khớp).
     - `success`: Tối ưu hóa (ví dụ: Sensitivity 96.8%).
     - `normal`: Trung tính.
2. **Khối hộp nhận định chuyên sâu (1 đến 2 hộp)**:
   - Tiêu đề hộp: $\ge 26\text{ pt}$ bold.
   - Nội dung phân tích: **$\ge 24\text{ pt}$**.
   - Phân loại: `warning` (cảnh báo rủi ro), `solution` (giải pháp đề xuất), `insight` (nhận định sâu), `methodology` (phương pháp luận).

## 2. Công cụ MCP tương ứng:
- `canva_add_kpi_dashboard`: Tạo trực tiếp slide Dashboard chỉ số.
- `canva_generate_deck_from_data`: Tự động đọc dữ liệu đo lường từ file CSV/JSON và tạo Dashboard ngay lập tức.
