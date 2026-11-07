---
name: canva-swot-analyst
description: Kỹ năng phân tích chiến lược SWOT (Điểm mạnh, Điểm yếu, Cơ hội, Thách thức) và tự động tạo slide ma trận 2x2 Grid trực quan với 4 màu đại diện chuẩn Taste-Skill, cỡ chữ >= 24pt và kết luận hành động.
---

# Canva SWOT Analyst Skill

Kỹ năng này giúp AI Agent phân tích chiến lược dự án hoặc hệ thống AI trên 4 khía cạnh toàn diện và tự động tạo slide ma trận 2x2 chuẩn xác.

## 1. 4 Khối Màu Sắc Chuẩn Taste-Skill:
- **S - Strengths (Điểm mạnh)**: Xanh lục Emerald (`#15803D`, nền nhạt `#F0FDF4`, viền `#22C55E`).
- **W - Weaknesses (Điểm yếu)**: Đỏ hồng Rose (`#B91C1C`, nền nhạt `#FEF2F2`, viền `#EF4444`).
- **O - Opportunities (Cơ hội)**: Xanh lam Sky (`#1D4ED8`, nền nhạt `#EFF6FF`, viền `#3B82F6`).
- **T - Threats (Thách thức)**: Hổ phách Amber (`#B45309`, nền nhạt `#FFFBEB`, viền `#F59E0B`).

## 2. Quy tắc Nội dung:
1. Mỗi ô chứa tối đa **3 gạch đầu dòng**. Mỗi câu phải có chủ ngữ rõ ràng và số liệu chứng thực nếu có.
2. Cỡ chữ bullet luôn **$\ge 24\text{ pt}$** để khán giả ở hàng ghế cuối hội trường vẫn đọc rõ.
3. Luôn đính kèm khối **Kết luận / Chiến lược tổng thể** ở đáy slide (`bottom_takeaway`).

## 3. Công cụ MCP tương ứng:
- `canva_add_swot_matrix`: Tạo trực tiếp slide ma trận SWOT 2x2.
- `canva_generate_deck_from_data`: Tự động nhận diện cấu trúc SWOT từ tệp CSV hoặc JSON.
