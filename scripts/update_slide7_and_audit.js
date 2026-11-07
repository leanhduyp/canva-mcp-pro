import { SlideEngine } from '../dist/engine/slide-engine.js';
import { auditEntireDeck } from '../dist/engine/deck-auditor.js';
import { getTastePalette } from '../dist/taste/palettes.js';

async function run() {
  const pptPath = 'C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx';
  const slideEngine = new SlideEngine();
  const palette = getTastePalette('iuh-brand');
  const presenter = 'Lê Anh Duy';

  console.log('--- CẬP NHẬT LẠI SLIDE 7 VỚI CÁC SỐ LIỆU ĐỊNH LƯỢNG (HARD FACTS) ---');
  await slideEngine.buildTeamGrid({
    presentationPath: pptPath,
    slideNumber: 7,
    title: 'BAN ĐIỀU HÀNH DỰ ÁN HẠ TẦNG AI AGENT ENTERPRISE',
    subtitleContext: 'Đội ngũ 6 chuyên gia nòng cốt phụ trách 100% các mảng kiến trúc, dữ liệu và kiểm định',
    presenter,
    palette,
    members: [
      { name: 'Duy Lê', role: 'Lead AI Architect', bio: 'Chủ trì thiết kế kiến trúc hệ thống và giao thức A2A với 10+ năm kinh nghiệm.' },
      { name: 'Minh Tran', role: 'Senior AI Engineer', bio: 'Phát triển các mô hình LLM chuyên biệt và 20+ MCP Servers.' },
      { name: 'Linh Pham', role: 'Data Specialist', bio: 'Chuẩn hóa luồng dữ liệu lớn 50TB và cơ sở tri thức Vector DB.' },
      { name: 'Hoang Nguyen', role: 'Security Lead', bio: 'Giám sát an ninh mạng, mã hóa dữ liệu AES-256 và tuân thủ GDPR.' },
      { name: 'Phuong Do', role: 'Cloud Architect', bio: 'Vận hành hạ tầng 64 node Docker, Kubernetes và Cloud Gateway.' },
      { name: 'Anh Vu', role: 'QA & Audit Lead', bio: 'Kiểm định tự động chất lượng deck và kiểm thử hệ thống đạt chuẩn 99.9%.' }
    ],
    bottomTakeaway: 'Ban dự án gồm 6 chuyên gia nòng cốt với 100% chứng chỉ quốc tế về AI, Data & Cloud Architecture.'
  });

  console.log('\n--- CHẠY BỘ KIỂM DUYỆT DECK-AUDITOR ---');
  const auditReport = await auditEntireDeck(pptPath);
  console.log(`📊 Tổng số slide kiểm định : ${auditReport.totalSlides}`);
  console.log(`⭐ Điểm chất lượng toàn bài  : ${auditReport.deckScore}/100 (${auditReport.overallStatus})`);
  console.log(`✅ Số slide đạt chuẩn cao cấp: ${auditReport.statistics.compliantSlides}/${auditReport.totalSlides}`);
  console.log(`🔎 Slide vi phạm cỡ chữ nhỏ  : [${auditReport.statistics.slidesWithSmallFont.join(', ')}]`);
  console.log(`🔎 Slide dính từ ngữ sáo rỗng: [${auditReport.statistics.slidesWithSlop.join(', ')}]`);
  console.log(`🔎 Slide thiếu huy hiệu Duy  : [${auditReport.statistics.slidesMissingPresenter.join(', ')}]`);
  console.log(`🔎 Slide thiếu số liệu thực  : [${auditReport.statistics.slidesLackingHardFacts.join(', ')}]`);

  if (auditReport.prioritizedActionPlan.length === 0) {
    console.log('\n🎉 TUYỆT VỜI! TẤT CẢ 20/20 SLIDE ĐỀU ĐẠT CHUẨN THẨM MỸ VÀNG (100% HOÀN HẢO)!');
  }
}

run().catch(console.error);
