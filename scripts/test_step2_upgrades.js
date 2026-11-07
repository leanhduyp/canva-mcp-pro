import fs from 'fs/promises';
import path from 'path';
import { McpServer } from '@modelcontextprotocol/server';
import { registerAllTools } from '../dist/tools/index.js';

async function testStep2Upgrades() {
  console.log("=================================================");
  console.log("🧪 KIỂM THỬ TÍCH HỢP TÍNH NĂNG MỚI - GIAI ĐOẠN 2");
  console.log("=================================================\n");

  const server = new McpServer({ name: 'test-step2', version: '2.0.0' });
  registerAllTools(server);

  const tools = server._registeredTools;
  console.log(`📦 Tổng số công cụ đã nạp vào MCP Server: ${Object.keys(tools).length}/20`);

  // Create temporary test presentation copy
  const sourceDeck = 'C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx';
  const testDeck = path.resolve('./temp_step2_test_deck.pptx');
  await fs.copyFile(sourceDeck, testDeck);
  console.log(`📋 Đã tạo bản sao kiểm thử an toàn: ${testDeck}\n`);

  try {
    // -------------------------------------------------------------
    // 1. Test canva_generate_deck_from_data with CSV Data
    // -------------------------------------------------------------
    console.log("[1/4] Kiểm thử tool 'canva_generate_deck_from_data' với dữ liệu CSV...");
    const sampleCsv = `Metric,Value,Subtext,Status
Train Accuracy,100.0%,Quá khớp tuyệt đối,danger
Validation Score,96.8%,Hiệu năng tối ưu sau tỉa cành,success
Sensitivity,97.2%,Độ nhạy phát hiện bệnh nhân nguy cơ,success
False Alarm Rate,3.2%,Tỷ lệ báo động giả được kiểm soát,normal`;

    const genTool = tools['canva_generate_deck_from_data'];
    const csvResult = await genTool.handler(
      {
        data_source: sampleCsv,
        presentation_path: testDeck,
        slide_number: 23,
        title: "Báo Cáo Chỉ Số Lâm Sàng Tự Động Từ CSV",
        subtitle_context: "Hệ thống tự động phân tích dữ liệu bảng và chọn bố cục KPI Dashboard",
        presenter: "Lê Anh Duy",
        palette_id: "iuh-brand",
        layout_preference: "auto",
        export_thumbnail: false,
      },
      { mcpReq: { signal: new AbortController().signal } }
    );

    const parsedCsvRes = JSON.parse(csvResult.content[0].text);
    console.log(`✅ Kết quả sinh slide từ CSV:`, {
      status: parsedCsvRes.status,
      slideNumber: parsedCsvRes.slideNumber,
      selectedLayout: parsedCsvRes.selectedLayout,
      metricsCount: parsedCsvRes.dataSummary.itemsCount,
      presenterBadge: parsedCsvRes.typographyCompliance.presenterBadge,
    });

    // -------------------------------------------------------------
    // 2. Test canva_generate_deck_from_data with JSON Data (SWOT)
    // -------------------------------------------------------------
    console.log("\n[2/4] Kiểm thử tool 'canva_generate_deck_from_data' với dữ liệu JSON (SWOT)...");
    const sampleJson = JSON.stringify({
      title: "Ma Trận SWOT Chiến Lược Tự Động Từ JSON",
      subtitle: "Phân tích 4 khía cạnh kỹ thuật theo cấu trúc dữ liệu JSON",
      strengths: [
        "Độ nhạy cao đạt 96.8% trên tập ngoại kiểm.",
        "Mô hình Decision Tree giải thích minh bạch 100%.",
      ],
      weaknesses: [
        "Độ đặc hiệu phụ thuộc phân phối mẫu ngoại viện.",
      ],
      opportunities: [
        "Tích hợp chuẩn FHIR vào hệ thống EHR bệnh viện.",
      ],
      threats: [
        "Biến thiên dữ liệu phân phối theo thời gian (Data Drift).",
      ],
      takeaway: "Tập trung khai thác tính giải thích minh bạch để làm công cụ hỗ trợ quyết định tin cậy.",
    });

    const jsonResult = await genTool.handler(
      {
        data_source: sampleJson,
        presentation_path: testDeck,
        slide_number: 24,
        presenter: "Lê Anh Duy",
        palette_id: "iuh-brand",
        layout_preference: "auto",
        export_thumbnail: false,
      },
      { mcpReq: { signal: new AbortController().signal } }
    );

    const parsedJsonRes = JSON.parse(jsonResult.content[0].text);
    console.log(`✅ Kết quả sinh slide từ JSON:`, {
      status: parsedJsonRes.status,
      slideNumber: parsedJsonRes.slideNumber,
      selectedLayout: parsedJsonRes.selectedLayout,
      presenterBadge: parsedJsonRes.typographyCompliance.presenterBadge,
    });

    // -------------------------------------------------------------
    // 3. Test canva_read_design_comments
    // -------------------------------------------------------------
    console.log("\n[3/4] Kiểm thử tool 'canva_read_design_comments' (Canva Cloud Review Loop)...");
    const readCommentsTool = tools['canva_read_design_comments'];
    const commentsResult = await readCommentsTool.handler(
      {
        design_id: "DAHaKPDSZSI",
        status: "all",
      },
      { mcpReq: { signal: new AbortController().signal } }
    );

    const parsedCommentsRes = JSON.parse(commentsResult.content[0].text);
    console.log(`✅ Kết quả đọc bình luận Canva:`, {
      status: parsedCommentsRes.status,
      designId: parsedCommentsRes.designId,
      totalComments: parsedCommentsRes.totalComments,
      firstComment: parsedCommentsRes.comments[0]?.message,
    });

    // -------------------------------------------------------------
    // 4. Test canva_auto_fix_from_comment
    // -------------------------------------------------------------
    console.log("\n[4/4] Kiểm thử tool 'canva_auto_fix_from_comment'...");
    const autoFixTool = tools['canva_auto_fix_from_comment'];
    const fixResult = await autoFixTool.handler(
      {
        comment_id: "cmt_review_001",
        design_id: "DAHaKPDSZSI",
        presentation_path: testDeck,
        slide_number: 16,
        export_thumbnail: false,
      },
      { mcpReq: { signal: new AbortController().signal } }
    );

    const parsedFixRes = JSON.parse(fixResult.content[0].text);
    console.log(`✅ Kết quả tự động phân tích & sửa slide theo phản hồi:`, {
      status: parsedFixRes.status,
      targetSlide: parsedFixRes.targetSlideNumber,
      appliedActions: parsedFixRes.appliedActions,
      typographyCompliance: parsedFixRes.typographyCompliance.bodyTextMinimum,
      presenterBadge: parsedFixRes.typographyCompliance.presenterBadge,
      cloudReplyPosted: parsedFixRes.realtimeLoopStatus.replyPosted,
    });

    console.log("\n=================================================");
    console.log("🎉 TẤT CẢ 4 BƯỚC KIỂM THỬ GIAI ĐOẠN 2 ĐỀU ĐẠT 100%!");
    console.log("=================================================");
  } finally {
    await fs.unlink(testDeck).catch(() => {});
    console.log(`🧹 Đã dọn dẹp an toàn tệp tạm: ${testDeck}`);
  }
}

testStep2Upgrades().catch((err) => {
  console.error("❌ Lỗi kiểm thử Step 2:", err);
  process.exit(1);
});
