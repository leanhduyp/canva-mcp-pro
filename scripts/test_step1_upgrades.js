import fs from 'fs/promises';
import path from 'path';
import { SlideEngine } from '../dist/engine/slide-engine.js';
import { CanvaClient } from '../dist/canva-client.js';
import { getTastePalette, syncCanvaBrandKitPalette } from '../dist/taste/palettes.js';

async function testStep1Upgrades() {
  console.log("=================================================");
  console.log("🧪 KIỂM THỬ TÍCH HỢP TÍNH NĂNG MỚI - STEP 1");
  console.log("=================================================\n");

  const slideEngine = new SlideEngine();
  const canvaClient = new CanvaClient();
  const iuhPalette = getTastePalette('iuh-brand');

  // Create temporary test deck path
  const sourceDeck = 'C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx';
  const testDeck = path.resolve('./temp_step1_test_deck.pptx');
  await fs.copyFile(sourceDeck, testDeck);
  console.log(`📋 Đã tạo bản sao kiểm thử an toàn: ${testDeck}`);

  try {
    // 1. Test Process Timeline
    console.log("\n[1/5] Kiểm thử tạo slide: canva_add_process_timeline...");
    await slideEngine.buildProcessTimeline({
      presentationPath: testDeck,
      slideNumber: 20,
      title: "Lộ Trình Tối Ưu Hóa & Đánh Giá Mô Hình ML",
      subtitleContext: "Quy trình 4 giai đoạn chuẩn mực từ tiền xử lý đến triển khai lâm sàng",
      presenter: "Lê Anh Duy",
      palette: iuhPalette,
      steps: [
        {
          stepNumber: "01",
          label: "Tiền Xử Lý Dữ Liệu",
          description: "Chuẩn hóa z-score, xử lý ngoại lai IQR và phân tầng Stratified K-Fold 5 nếp.",
        },
        {
          stepNumber: "02",
          label: "Huấn Luyện & Tỉa Cành",
          description: "Khởi tạo Decision Tree với ccp_alpha tối ưu, loại bỏ phân nhánh gây Overfitting.",
          isHero: true,
        },
        {
          stepNumber: "03",
          label: "Hiệu Chuẩn Xác Suất",
          description: "Áp dụng Isotonic Regression cân chỉnh độ tự tin ngưỡng quyết định lâm sàng 0.5%.",
        },
        {
          stepNumber: "04",
          label: "Đánh Giá Ngoại Kiểm",
          description: "Kiểm thử trên Holdout test set độc lập, xác thực độ nhạy Sensitivity >= 95.0%.",
        },
      ],
      bottomTakeaway: "Đảm bảo tính tái lập 100% qua quy trình kiểm định chéo độc lập và đóng băng trọng số.",
    });
    console.log("✅ Slide Process Timeline (20) được sinh thành công với vector pulse & badges!");

    // 2. Test SWOT Matrix
    console.log("\n[2/5] Kiểm thử tạo slide: canva_add_swot_matrix...");
    await slideEngine.buildSwotMatrix({
      presentationPath: testDeck,
      slideNumber: 21,
      title: "Ma Trận Phân Tích SWOT - Hệ Thống Chẩn Đoán AI",
      subtitleContext: "Đánh giá toàn diện 4 khía cạnh kỹ thuật & lâm sàng theo chuẩn mực Taste-Skill",
      presenter: "Lê Anh Duy",
      palette: iuhPalette,
      strengths: [
        "Độ nhạy Sensitivity đạt 96.8% trên tập bệnh nhân nguy cơ cao.",
        "Mô hình Decision Tree có khả năng giải thích hộp trắng rõ ràng.",
      ],
      weaknesses: [
        "Độ đặc hiệu Specificity còn phụ thuộc vào tỷ lệ mất cân bằng mẫu.",
        "Cần kiểm định thêm trên tập dữ liệu ngoại viện đa trung tâm.",
      ],
      opportunities: [
        "Tích hợp chuẩn giao thức FHIR vào hệ thống bệnh án điện tử EHR.",
        "Mở rộng sang hỗ trợ cảnh báo sớm đa bệnh lý đồng mắc.",
      ],
      threats: [
        "Hiện tượng Data Drift khi phân phối bệnh nhân thay đổi theo mùa.",
        "Rủi ro quá tải thông báo báo động giả gây mệt mỏi cho bác sĩ.",
      ],
      bottomTakeaway: "Tập trung khai thác tính giải thích minh bạch để tăng độ tin cậy trong hội chẩn lâm sàng.",
    });
    console.log("✅ Slide SWOT Matrix (21) được sinh thành công với 4 màu đại diện chuẩn 2x2!");

    // 3. Test Team Grid
    console.log("\n[3/5] Kiểm thử tạo slide: canva_add_team_grid...");
    await slideEngine.buildTeamGrid({
      presentationPath: testDeck,
      slideNumber: 22,
      title: "Đội Ngũ Nghiên Cứu & Triển Khai Hệ Thống AI",
      subtitleContext: "Chuyên gia liên ngành Khoa học Dữ liệu, Y khoa và Kỹ thuật Phần mềm",
      presenter: "Lê Anh Duy",
      palette: iuhPalette,
      members: [
        {
          name: "Lê Anh Duy",
          role: "Trưởng Nhóm & ML Engineer",
          bio: "Phụ trách thiết kế kiến trúc Decision Tree và tối ưu hóa siêu tham số ccp_alpha.",
        },
        {
          name: "Nguyễn Văn An",
          role: "Data Scientist",
          bio: "Chuyên gia tiền xử lý dữ liệu y tế và kiểm định chéo Stratified K-Fold.",
        },
        {
          name: "Trần Thị Bình",
          role: "Cố Vấn Lâm Sàng",
          bio: "Đánh giá ngưỡng lâm sàng 0.5% và độ tin cậy của chỉ số Sensitivity.",
        },
        {
          name: "Phạm Quốc Cường",
          role: "Fullstack Engineer",
          bio: "Triển khai giao thức Canva MCP Pro và đồng bộ hệ thống trình chiếu thời gian thực.",
        },
      ],
      bottomTakeaway: "Đội ngũ liên ngành đảm bảo mô hình không chỉ đạt điểm cao mà còn ứng dụng an toàn trong thực tế.",
    });
    console.log("✅ Slide Team Grid (22) được sinh thành công với circular avatar clip mask!");

    // 4. Test Canva Asset Upload API
    console.log("\n[4/5] Kiểm thử Canva Asset Upload API (canva_upload_asset)...");
    const assetUpload = await canvaClient.uploadAsset(
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      "medical_research_ai.jpg"
    );
    console.log("✅ Phản hồi Asset Upload:", JSON.stringify(assetUpload, null, 2));

    // 5. Test Canva Brand Kit Sync API
    console.log("\n[5/5] Kiểm thử Canva Brand Kit Sync API (canva_sync_brand_kit)...");
    const brandKitsRes = await canvaClient.getBrandKits();
    const kitData = brandKitsRes.brand_kits[0];
    const syncedPalette = syncCanvaBrandKitPalette(kitData);
    console.log("✅ Phản hồi Brand Kit Synced:", {
      id: syncedPalette.id,
      name: syncedPalette.name,
      accent: syncedPalette.accent,
      secondary: syncedPalette.secondary,
      note: syncedPalette.note,
    });

    console.log("\n=================================================");
    console.log("🎉 TOÀN BỘ 5 BƯỚC KIỂM THỬ TÍCH HỢP ĐỀU THÀNH CÔNG 100%!");
    console.log("=================================================");
  } finally {
    // Clean up temporary test deck
    await fs.unlink(testDeck).catch(() => {});
    console.log(`🧹 Đã dọn dẹp an toàn tệp tạm: ${testDeck}`);
  }
}

testStep1Upgrades().catch((err) => {
  console.error("❌ Lỗi kiểm thử:", err);
  process.exit(1);
});
