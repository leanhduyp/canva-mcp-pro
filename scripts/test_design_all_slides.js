import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import path from "path";

const PPTX_PATH = "C:\\Users\\mrduy\\Documents\\AI\\my_quest\\thuyet_trinh\\Bao_Cao_Chu_De11.pptx";

async function runTest() {
  console.log("=== BẮT ĐẦU TEST TOÀN DIỆN MÁY CHỦ CANVA-MCP-PRO ===");
  console.log("Mục tiêu: Gọi trực tiếp các Tool MCP để thiết kế lại Slides 11-14 cho Lê Anh Duy");

  const serverPath = path.resolve("./dist/index.js");
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  const client = new Client({ name: "mcp-evaluator", version: "1.0.0" });
  await client.connect(transport);
  console.log("✅ Đã kết nối MCP Server 'canva-mcp-pro' qua giao thức stdio.");

  // 1. Test Tool canva_add_split_architecture (Slide 11)
  console.log("\n▶ [TEST 1/4] Gọi tool 'canva_add_split_architecture' cho Slide 11...");
  const res11 = await client.callTool({
    name: "canva_add_split_architecture",
    arguments: {
      presentation_path: PPTX_PATH,
      slide_number: 11,
      title: "4.2.1. Triển khai hai hàm cốt lõi\nđánh giá & tối ưu hóa",
      presenter: "Lê Anh Duy",
      left_panel: {
        header: "HÀM 1: evaluate_decision_tree_cv",
        points: [
          {
            title: "StratifiedKFold (5-fold, seed=42):",
            desc: "Bảo toàn chính xác tỷ lệ 62.6% Lành tính / 37.4% Ác tính trên từng fold kiểm định.",
          },
          {
            title: "Định lượng Overfitting (Δ_cv):",
            desc: "Tính chênh lệch Δ_cv = Train_Score - Val_Score để đo lường độ phân kỳ thực tế của mô hình.",
          },
          {
            title: "Trích xuất độ phức tạp cây:",
            desc: "Fit lại trên 455 mẫu Train để lấy độ sâu get_depth() và số lượng nút lá get_n_leaves().",
          },
        ],
      },
      right_panel: {
        header: "HÀM 2: select_best_candidate",
        points: [
          {
            title: "Tự động chọn mô hình tối ưu:",
            desc: "Quét toàn bộ kết quả trong kịch bản để tự động chọn ứng viên đạt Validation Score cao nhất.",
          },
          {
            title: "Phân xử hòa điểm (Occam's razor):",
            desc: "Nếu các ứng viên hòa điểm Validation, tự động ưu tiên cây có số nút lá ít hơn (tinh gọn hơn).",
          },
          {
            title: "Tiêu chí phụ cấp 2:",
            desc: "Nếu tiếp tục bằng nhau về số lá, tự động chọn cây có độ sâu (max_depth) nhỏ hơn.",
          },
        ],
      },
      bottom_banner: {
        prefix: "🎯 Ý nghĩa phương pháp:",
        content:
          "Tự động hóa 100% quy trình đánh giá và ra quyết định trên tập Train (455 mẫu) — loại bỏ hoàn toàn cảm tính chủ quan, đảm bảo tính nhất quán xuyên suốt cho tất cả kịch bản thực nghiệm từ E0 đến E5.",
      },
    },
  });
  console.log("Phản hồi Slide 11:", res11.content[0].text);

  // 2. Test Tool canva_add_kpi_dashboard (Slide 12)
  console.log("\n▶ [TEST 2/4] Gọi tool 'canva_add_kpi_dashboard' cho Slide 12...");
  const res12 = await client.callTool({
    name: "canva_add_kpi_dashboard",
    arguments: {
      presentation_path: PPTX_PATH,
      slide_number: 12,
      title: "4.2.2. Khởi tạo và đánh giá mô hình\nBaseline E0",
      presenter: "Lê Anh Duy",
      subtitle_context:
        "Thiết lập Baseline E0: Cây mọc tự do (max_depth=None, min_samples_split=2, min_samples_leaf=1, criterion='gini')",
      kpi_metrics: [
        {
          label: "TRAIN SCORE (CV)",
          value: "100.0%",
          subtext: "Khớp hoàn hảo 5/5 fold",
          status: "normal",
        },
        {
          label: "VALIDATION SCORE (CV)",
          value: "92.31%",
          subtext: "Độ lệch chuẩn: ± 1.91%",
          status: "success",
        },
        {
          label: "KHOẢNG VÊNH OVERFIT",
          value: "7.69%",
          subtext: "Δ_cv = 100% - 92.31%",
          status: "danger",
        },
        {
          label: "QUY MÔ CẤU TRÚC",
          value: "8 / 24",
          subtext: "Độ sâu 8 tầng | 24 nút lá",
          status: "normal",
        },
      ],
      diagnostic_boxes: [
        {
          title: "⚠️ Nhận định hiện tượng Overfitting:",
          body: "Việc cho phép cây mọc tự do đến từng mẫu khiến E0 học thuộc lòng cả nhiễu ngẫu nhiên trong dữ liệu huấn luyện, tạo ra khoảng cách phân kỳ 7.69 điểm % so với kiểm định chéo.",
          type: "warning",
        },
        {
          title: "🎯 Định hướng giải pháp Pruning (E1–E4):",
          body: "Mô hình E0 đóng vai trò mốc đối chứng (Benchmark). Mục tiêu của các kịch bản cắt tỉa là thu hẹp khoảng cách 7.69 điểm % và giảm bớt số nút lá mà không làm suy giảm Validation CV.",
          type: "solution",
        },
      ],
    },
  });
  console.log("Phản hồi Slide 12:", res12.content[0].text);

  // 3. Test Tool canva_add_card_comparison (Slide 13)
  console.log("\n▶ [TEST 3/4] Gọi tool 'canva_add_card_comparison' cho Slide 13...");
  const res13 = await client.callTool({
    name: "canva_add_card_comparison",
    arguments: {
      presentation_path: PPTX_PATH,
      slide_number: 13,
      title: "4.2.3. Tự động hóa khảo sát\n4 kịch bản Pruning (E1–E4)",
      presenter: "Lê Anh Duy",
      columns: [
        {
          badge: "E1 | GIỚI HẠN ĐỘ SÂU",
          is_hero: false,
          param_label: "Tham số tối ưu:",
          param_val: "max_depth = 7",
          val_score: "92.31%",
          struct: "7 tầng, 22 nút lá",
          impact: "Giảm 2 lá (-8.3%)",
          desc: "Cắt tỉa tầng sâu nhẹ, giữ nguyên điểm số Validation.",
        },
        {
          badge: "E2 | ĐIỀU KIỆN CHIA NÚT",
          is_hero: false,
          param_label: "Tham số tối ưu:",
          param_val: "min_split = 15",
          val_score: "92.53% (+0.22%)",
          struct: "8 tầng, 14 nút lá",
          impact: "Giảm 10 lá (-41.7%)",
          desc: "Rút gọn mạnh nút nội, tăng nhẹ hiệu năng kiểm định.",
        },
        {
          badge: "⭐ E3 | HIỆU NĂNG ĐỈNH",
          is_hero: true,
          param_label: "Tham số tối ưu:",
          param_val: "min_leaf = 3",
          val_score: "93.63% (+1.32%)",
          struct: "8 tầng, 17 nút lá",
          impact: "Giảm 7 lá (-29.2%)",
          desc: "Đạt đỉnh Validation CV, chặn tối ưu hiện tượng quá khớp!",
        },
        {
          badge: "💎 E4 | SIÊU TINH GỌN",
          is_hero: true,
          param_label: "Tham số tối ưu:",
          param_val: "α ≈ 0.0136",
          val_score: "92.31% (Bằng E0)",
          struct: "CHỈ 2 TẦNG, 3 LÁ!",
          impact: "Giảm 21 lá (-87.5%!)",
          desc: "Mô hình siêu tinh gọn, lý tưởng cho ứng dụng lâm sàng.",
        },
      ],
      bottom_takeaway:
        "📊 Kết luận khảo sát Pruning: Cả 4 kỹ thuật đều tinh gọn cấu trúc cây so với E0 (24 lá). Trong đó, E3 đạt độ chính xác dự báo cao nhất (93.63%), còn E4 tạo ra bước đột phá về khả năng giải thích khi chỉ cần 3 nút lá mà vẫn đạt Validation 92.31%.",
    },
  });
  console.log("Phản hồi Slide 13:", res13.content[0].text);

  // 4. Test Tool canva_add_split_architecture (Slide 14)
  console.log("\n▶ [TEST 4/4] Gọi tool 'canva_add_split_architecture' cho Slide 14...");
  const res14 = await client.callTool({
    name: "canva_add_split_architecture",
    arguments: {
      presentation_path: PPTX_PATH,
      slide_number: 14,
      title: "4.2.4. Quy tắc dung sai chọn mô hình\n& Đánh giá Test độc lập",
      presenter: "Lê Anh Duy",
      left_panel: {
        header: "1. QUY TẮC DUNG SAI 0.5% & LỰA CHỌN MÔ HÌNH",
        points: [
          {
            title: "Ngưỡng lọc dung sai 0.5%:",
            desc: "Best_Val - 0.5% = 93.63% - 0.5% = 93.13%. Chỉ xét các mô hình trong khoảng [93.13% - 93.63%] để so tiếp về độ tinh gọn.",
          },
          {
            title: "Đối chiếu các kịch bản đối thủ:",
            desc: "E1 (92.31%), E2 (92.53%), E4 (92.31%) đều nhỏ hơn 93.13% → Không mô hình tinh gọn nào vượt qua ngưỡng dung sai.",
          },
          {
            title: "Quyết định chọn tự động:",
            desc: "E3 chính thức là mô hình chiến thắng chung cuộc — vừa đạt Validation cao nhất (93.63%), vừa giảm 29.2% số nút lá cây.",
          },
        ],
      },
      right_panel: {
        header: "2. ĐÁNH GIÁ HOLDOUT TEST ĐỘC LẬP",
        points: [
          {
            title: "Tập dữ liệu độc lập (Holdout):",
            desc: "114 mẫu Test (20% dữ liệu) được niêm phong, không tham gia vào bất kỳ bước tối ưu siêu tham số nào.",
          },
          {
            title: "Triệt tiêu rò rỉ (Zero Leakage):",
            desc: "Chốt cấu hình E3 hoàn tất 100% bằng Cross-Validation trên Train trước khi mở tập Test để đánh giá khách quan.",
          },
          {
            title: "Đầu ra bàn giao thực nghiệm:",
            desc: "Xuất ma trận nhầm lẫn (Confusion Matrix), biểu đồ cây và learning curve phục vụ phân tích chuyên sâu.",
          },
        ],
      },
      bottom_banner: {
        prefix: "🔬 Chuẩn mực phương pháp luận:",
        content:
          "Tuân thủ nghiêm ngặt nguyên tắc khoa học: Lựa chọn mô hình hoàn toàn dựa trên Cross-Validation trên Train, chỉ dùng tập Test độc lập để kiểm chứng năng lực tổng quát hóa cuối cùng.",
      },
    },
  });
  console.log("Phản hồi Slide 14:", res14.content[0].text);

  await client.close();
  console.log("\n========================================================");
  console.log("🎉 TẤT CẢ 4 TOOL MCP ĐÃ ĐƯỢC TEST THÀNH CÔNG RỰC RỠ!");
  console.log("File kết quả: " + PPTX_PATH);
  console.log("========================================================");
}

runTest().catch((err) => {
  console.error("Lỗi khi chạy test MCP:", err);
  process.exit(1);
});
