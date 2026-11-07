---
name: canva-brand-auditor
description: Kỹ năng kiểm toán toàn diện tính thẩm mỹ (Taste Audit) cho toàn bộ slide trong bài thuyết trình: quét lỗi cỡ chữ nhỏ (<24pt), phát hiện từ ngữ AI slop, kiểm tra huy hiệu Lê Anh Duy và tính điểm Taste Score (/100).
---

# Canva Brand Auditor Skill

Kỹ năng này chịu trách nhiệm giám định chất lượng (QA) bài thuyết trình theo tiêu chuẩn **Taste-Skill 2.5** và Bộ nhận diện thương hiệu học thuật **Corporate Navy Brand**.

## 1. Khi nào kích hoạt?
- Người dùng yêu cầu: *"Kiểm tra lại bài thuyết trình xem có lỗi gì không"*, *"Audit slide"*, *"Đánh giá chất lượng thẩm mỹ"*, *"Kiểm tra cỡ chữ và từ ngữ slop"*.

## 2. 5 Tiêu chuẩn Đánh giá Vàng (Audit Checklist):

| Tiêu chuẩn | Yêu cầu Kỹ thuật | Trọng số Điểm |
| :--- | :--- | :---: |
| **1. Cỡ chữ tối thiểu** | Body text $\ge 24\text{ pt}$, Hero Metric $\ge 56\text{ pt}$ | 30 điểm |
| **2. Huy hiệu Người trình bày** | Gắn **`Lê Anh Duy`** (44pt, Cyan `#00B0F0`) ở góc trên bên phải | 20 điểm |
| **3. Anti-Slop Copy** | Không chứa từ ngữ thổi phồng sáo rỗng (*game-changing, revolutionary, delve, seamless, tapestry*) | 20 điểm |
| **4. Bằng chứng Số liệu (Hard Facts)** | Slide kỹ thuật phải có số liệu đo lường cụ thể (ví dụ: *96.8%*, *ccp_alpha = 0.0019*) | 15 điểm |
| **5. Giới hạn Nội dung (Word Budget)** | Mỗi slide không quá 90 từ; mỗi ô không quá 3 gạch đầu dòng | 15 điểm |

## 3. Công cụ MCP phối hợp:
- `canva_audit_entire_deck`: Quét toàn diện toàn bộ bài thuyết trình và trả về báo cáo chi tiết từng slide.
- `canva_validate_slide_copy`: Kiểm tra tính trung thực và phát hiện từ ngữ AI slop trên một khối văn bản.
- `canva_auto_fix_from_comment`: Tự động khắc phục các slide có điểm Taste Score dưới 80.
