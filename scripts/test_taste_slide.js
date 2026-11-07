import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import path from "path";
import fs from "fs";

async function testTastefulSlide() {
  const serverPath = path.resolve("C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/dist/index.js");
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  const client = new Client(
    { name: "test-taste-slide", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);

  // Create a copy of the presentation to test adding a tasteful slide
  const original = "C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx";
  const testPptx = "C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/test_taste_deck.pptx";
  fs.copyFileSync(original, testPptx);

  console.log("Testing canva_add_tasteful_slide on test_taste_deck.pptx (Slide 15)...");
  const res = await client.callTool({
    name: "canva_add_tasteful_slide",
    arguments: {
      presentation_path: testPptx,
      slide_number: 15,
      layout_type: "kpi_dashboard",
      palette_id: "cool-white-slate",
      title: "4.2.5. TỔNG KẾT HIỆU QUẢ TỐI ƯU CÂY QUYẾT ĐỊNH (TASTE-SKILL)",
      subtitle_context: "📌 Đánh giá toàn diện mô hình Pruned CART trên 10,000 mẫu dữ liệu kiểm thử độc lập",
      presenter: "Lê Anh Duy",
      kpi_metrics: [
        {
          label: "ACCURACY (TEST)",
          value: "84.32%",
          subtext: "Độ chính xác vượt trội trên tập Test",
          status: "success",
        },
        {
          label: "SỐ LƯỢNG LÁ (LEAF NODES)",
          value: "41 LÁ",
          subtext: "Giảm 87.6% kích thước cây ban đầu",
          status: "normal",
        },
        {
          label: "TỐC ĐỘ DỰ ĐOÁN",
          value: "0.18 ms",
          subtext: "Đạt chuẩn Realtime Inference",
          status: "normal",
        },
      ],
      diagnostic_boxes: [
        {
          title: "CHẨN ĐOÁN KHẢ NĂNG TỔNG QUÁT HÓA (GENERALIZATION)",
          body: "Mô hình đã triệt tiêu hoàn toàn hiện tượng học vẹt (overfitting). Khoảng cách chênh lệch giữa Train và Test rút ngắn chỉ còn 1.1%, đảm bảo độ ổn định cao trên dữ liệu thực tế.",
          type: "insight",
        },
        {
          title: "KHUYẾN NGHỊ TRIỂN KHAI VÀ GIẢI THÍCH",
          body: "Với 41 lá và độ sâu 7 tầng, toàn bộ quy tắc ra quyết định đều có thể trực quan hóa và kiểm toán minh bạch cho hội đồng chuyên môn IUH.",
          type: "methodology",
        },
      ],
    },
  });

  console.log("Server Response:\n", res.content[0].text);
  await client.close();

  // Clean up test file if needed or keep for verification
  console.log("Slide created successfully at:", testPptx);
}

testTastefulSlide().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
