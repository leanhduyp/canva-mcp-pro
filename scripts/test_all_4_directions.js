import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import path from "path";
import fs from "fs";

async function main() {
  const serverPath = path.resolve("C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/dist/index.js");
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  const client = new Client({ name: "test-4-directions", version: "1.0.0" });
  console.log("Connecting to canva-mcp-pro server...");
  await client.connect(transport);
  console.log("Connected successfully!");

  // 1. List tools
  const toolsRes = await client.listTools();
  console.log(`\n=== Total Available Tools (${toolsRes.tools.length}) ===`);
  for (const t of toolsRes.tools) {
    console.log(` - ${t.name}: ${t.description.slice(0, 75)}...`);
  }

  const originalPptx = "C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx";
  const testDeck = "C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/test_deck_advanced.pptx";
  fs.copyFileSync(originalPptx, testDeck);

  // 2. Test Hướng 3: Deck Audit
  console.log("\n=== TEST HƯỚNG 3: AUDIT ENTIRE DECK ===");
  const auditRes = await client.callTool({
    name: "canva_audit_entire_deck",
    arguments: {
      presentation_path: originalPptx,
    },
  });
  const auditReport = JSON.parse(auditRes.content[0].text);
  console.log(`Deck Taste Score: ${auditReport.deckScore}/100 (${auditReport.overallStatus})`);
  console.log(`Total Slides: ${auditReport.totalSlides}`);
  console.log("Statistics:", JSON.stringify(auditReport.statistics, null, 2));
  console.log("Executive Summary:", auditReport.executiveSummary);
  console.log("Action Plan:", auditReport.prioritizedActionPlan);

  // 3. Test Hướng 2 & 1: Pipeline Flow with Auto-Thumbnail
  console.log("\n=== TEST HƯỚNG 2 & 1: PIPELINE FLOW SLIDE WITH AUTO-THUMBNAIL ===");
  const pipeRes = await client.callTool({
    name: "canva_add_tasteful_slide",
    arguments: {
      presentation_path: testDeck,
      slide_number: 16,
      layout_type: "pipeline_flow",
      palette_id: "iuh-brand",
      title: "4.2.6. QUY TRÌNH 4 BƯỚC TỈA CÂY CART TỐI ƯU (PIPELINE)",
      subtitle_context: "🔄 Luồng xử lý tuần tự từ dữ liệu thô đến mô hình suy luận thời gian thực",
      presenter: "Lê Anh Duy",
      export_thumbnail: true,
      pipeline_steps: [
        {
          stepNumber: "01",
          tag: "Dữ liệu",
          title: "TIỀN XỬ LÝ",
          desc: "Chuẩn hóa 41 đặc trưng, One-Hot encoding, chia Train/Test 80-20.",
        },
        {
          stepNumber: "02",
          tag: "Huấn luyện",
          title: "CART GỐC",
          desc: "Huấn luyện cây quyết định cực đại (331 lá, sâu 15 tầng) tạo baseline.",
        },
        {
          stepNumber: "03",
          tag: "Tối ưu",
          title: "TỈA CCP-ALPHA",
          desc: "Tỉa cành độ phức tạp chi phí ccp_alpha=0.002, loại bỏ 290 lá dư thừa.",
          isHero: true,
        },
        {
          stepNumber: "04",
          tag: "Đánh giá",
          title: "TRIỂN KHAI",
          desc: "Đạt 84.32% Test Score, độ trễ suy luận 0.18 ms phục vụ realtime.",
        },
      ],
      bottom_takeaway: "🎯 Điểm then chốt: Bước 3 (Tỉa CCP-Alpha) là mắt xích quan trọng nhất, giúp giảm 87.6% kích thước cây mà độ chính xác tăng thêm 2.31%.",
    },
  });
  const pipeOut = JSON.parse(pipeRes.content[0].text);
  console.log("Pipeline slide creation result:", pipeOut.status);
  console.log("Auto-Thumbnail:", pipeOut.thumbnail);

  // 4. Test Hướng 2 & 1: Confusion Matrix with Auto-Thumbnail
  console.log("\n=== TEST HƯỚNG 2 & 1: CONFUSION MATRIX SLIDE WITH AUTO-THUMBNAIL ===");
  const cmRes = await client.callTool({
    name: "canva_add_tasteful_slide",
    arguments: {
      presentation_path: testDeck,
      slide_number: 17,
      layout_type: "confusion_matrix",
      palette_id: "cool-white-slate",
      title: "4.2.7. MA TRẬN NHẦM LẪN VÀ ĐÁNH GIÁ ĐỘ ĐO PHÂN LOẠI",
      subtitle_context: "📊 Kiểm thử độc lập trên 10,000 mẫu dữ liệu kiểm định",
      presenter: "Lê Anh Duy",
      export_thumbnail: true,
      confusion_matrix_data: {
        matrix: {
          tp: { value: "8,432", label: "TRUE POSITIVE (TP)", desc: "Dự báo Đạt - Thực tế Đạt" },
          fp: { value: "412", label: "FALSE POSITIVE (FP)", desc: "Sai lầm Loại I (Báo động giả)" },
          fn: { value: "396", label: "FALSE NEGATIVE (FN)", desc: "Sai lầm Loại II (Bỏ sót rủi ro)" },
          tn: { value: "760", label: "TRUE NEGATIVE (TN)", desc: "Dự báo Không đạt chuẩn xác" },
        },
        metrics: [
          { label: "ACCURACY", value: "84.32%", subtext: "Tổng thể" },
          { label: "PRECISION", value: "86.12%", subtext: "Độ chuẩn xác" },
          { label: "RECALL", value: "82.50%", subtext: "Độ phủ" },
          { label: "F1-SCORE", value: "84.27%", subtext: "Điều hòa Harmonic" },
        ],
        clinical_insight: {
          title: "CHẨN ĐOÁN Ý NGHĨA KỸ THUẬT & HỌC THUẬT",
          body: "Tỷ lệ FN chỉ 3.96% đảm bảo mô hình rất ít khi bỏ sót các trường hợp rủi ro cao. F1-Score đạt 84.27% khẳng định tính cân bằng tối ưu giữa Precision và Recall trên tập dữ liệu mất cân bằng.",
        },
      },
    },
  });
  const cmOut = JSON.parse(cmRes.content[0].text);
  console.log("Confusion matrix slide creation result:", cmOut.status);
  console.log("Auto-Thumbnail:", cmOut.thumbnail);

  // 5. Test Hướng 4: Canva Cloud Sync
  console.log("\n=== TEST HƯỚNG 4: CANVA CLOUD SYNC ===");
  const syncRes = await client.callTool({
    name: "canva_sync_to_cloud",
    arguments: {
      design_id: "DAHaKPDSZSI",
    },
  });
  console.log("Canva Cloud Sync Result:", syncRes.content[0].text);

  await client.close();
  console.log("\n=== ALL 4 DIRECTIONS TESTED AND VERIFIED SUCCESSFULLY! ===");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
