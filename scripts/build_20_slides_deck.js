import { SlideEngine } from '../dist/engine/slide-engine.js';
import { auditEntireDeck } from '../dist/engine/deck-auditor.js';
import { getTastePalette } from '../dist/taste/palettes.js';
import path from 'path';

async function main() {
  console.log('=================================================');
  console.log('🚀 BẮT ĐẦU TẠO BỘ TRÌNH CHIẾU 20 SLIDE DOANH NGHIỆP 2026');
  console.log('=================================================\n');

  const pptPath = 'C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx';
  const slideEngine = new SlideEngine();
  const palette = getTastePalette('iuh-brand');
  const presenter = 'Lê Anh Duy';

  // SLIDE 1: Cover Title
  console.log('[1/20] Dựng Slide 1: Cover Title...');
  await slideEngine.buildCoverSlide({
    presentationPath: pptPath,
    slideNumber: 1,
    title: 'KẾ HOẠCH TRIỂN KHAI HẠ TẦNG AI AGENT ENTERPRISE 2026',
    subtitle: 'Chiến Lược Tự Động Hóa Toàn Diện, Giao Thức Multi-Agent & Bảo Mật Doanh Nghiệp',
    presenter,
    palette,
    department: 'Ban Chỉ Đạo Dự Án Chuyển Đổi Số & Kiến Trúc Hạ Tầng AI Enterprise',
    metaTags: ['Kế Hoạch Năm 2026', 'Chuẩn Hạ Tầng: Multi-Agent A2A Mesh', 'Bảo Mật: Air-gapped']
  });

  // SLIDE 2: Executive Summary
  console.log('[2/20] Dựng Slide 2: Executive Summary (3 Trụ Cột)...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 2,
    title: 'TỔNG QUAN CHIẾN LƯỢC 3 TRỤ CỘT CHUYỂN ĐỔI SỐ',
    presenter,
    palette,
    leftPanel: {
      header: 'TỰ ĐỘNG HÓA VẬN HÀNH & KẾT NỐI ĐA AGENT',
      headerColor: '#153898',
      points: [
        { title: 'Tự Động Hóa Quy Trình', desc: 'Tiết giảm 40% thời gian xử lý dữ liệu thủ công.' },
        { title: 'Hạ Tầng Multi-Agent', desc: 'Điều phối luồng công việc giữa 10 Agent chuyên biệt.' }
      ]
    },
    rightPanel: {
      header: 'AN TOÀN DỮ LIỆU & QUẢN TRỊ MINH BẠCH',
      headerColor: '#153898',
      points: [
        { title: 'Bảo Mật Air-Gapped', desc: 'Mã hóa AES-256 toàn bộ dữ liệu nội bộ.' },
        { title: 'Kiểm Toán Toàn Trình', desc: 'Ghi nhận log thời gian thực với độ trễ dưới 25ms.' }
      ]
    },
    bottomBanner: {
      prefix: 'CHIẾN LƯỢC TRỌNG TÂM',
      content: 'Tạo bước nhảy vọt về năng suất lao động và bảo mật thông tin doanh nghiệp năm 2026.'
    }
  });

  // SLIDE 3: KPI Dashboard
  console.log('[3/20] Dựng Slide 3: KPI Dashboard (3 Chỉ Số Mục Tiêu)...');
  await slideEngine.buildKpiDashboard({
    presentationPath: pptPath,
    slideNumber: 3,
    title: 'DASHBOARD CHỈ SỐ MỤC TIÊU HẠ TẦNG AI AGENT 2026',
    subtitleContext: 'Mục tiêu định lượng cam kết cho toàn bộ hệ thống chuyển đổi số năm 2026',
    presenter,
    palette,
    kpiMetrics: [
      { label: 'TỐC ĐỘ XỬ LÝ', value: 'X5 LẦN', subtext: 'Tăng tốc độ tổng hợp báo cáo tài chính & kỹ thuật', status: 'success' },
      { label: 'CHI PHÍ VẬN HÀNH', value: '-40%', subtext: 'Cắt giảm chi phí nhân sự và thời gian thủ công', status: 'success' },
      { label: 'ĐỘ CHÍNH XÁC', value: '99.8%', subtext: 'Độ chính xác truy vấn dữ liệu từ kho tri thức', status: 'success' }
    ],
    diagnosticBoxes: [
      { title: 'Hiệu Năng Vận Hành Hệ Thống', body: 'Hạ tầng xử lý đồng thời 500 yêu cầu/giây mà không suy hao tốc độ phản hồi.', type: 'insight' },
      { title: 'Thu Hồi Vốn Đầu Tư', body: 'Điểm hòa vốn đạt được sau 12 tháng vận hành chính thức.', type: 'solution' }
    ]
  });

  // SLIDE 4: Card Comparison (4 Thế Hệ)
  console.log('[4/20] Dựng Slide 4: Card Comparison (4 Thế Hệ AI)...');
  await slideEngine.buildComparisonMatrix({
    presentationPath: pptPath,
    slideNumber: 4,
    title: 'SO SÁNH 4 THẾ HỆ TIẾN HÓA CỦA TRÍ TUỆ NHÂN TẠO',
    presenter,
    palette,
    columns: [
      { badge: '1. SCRIPT AUTO', paramLabel: 'Mô hình:', paramVal: 'Quy tắc tĩnh', valScore: '50%', struct: 'Script cứng', impact: 'Cơ bản', desc: 'Chỉ chạy lệnh lặp lại, thiếu khả năng thích ứng.', isHero: false },
      { badge: '2. CHATBOT', paramLabel: 'Mô hình:', paramVal: 'Hỏi đáp text', valScore: '75%', struct: 'LLM đơn lẻ', impact: 'Trung bình', desc: 'Tương tác hội thoại nhưng không kết nối công cụ.', isHero: false },
      { badge: '3. SINGLE MCP', paramLabel: 'Mô hình:', paramVal: 'Host - Tool', valScore: '92%', struct: 'Chuẩn MCP v1', impact: 'Mở rộng', desc: 'Gọi công cụ ngoài và truy vấn cơ sở dữ liệu.', isHero: false },
      { badge: '4. MULTI-AGENT A2A', paramLabel: 'Mô hình:', paramVal: 'Mạng lưới Agent', valScore: '99.8%', struct: 'A2A Mesh', impact: 'Toàn diện', desc: 'Phân rã tác vụ tự chủ và phối hợp đa Agent.', isHero: true }
    ],
    bottomTakeaway: 'Mô hình Multi-Agent A2A là chuẩn mực vận hành tự chủ cốt lõi cho doanh nghiệp năm 2026.'
  });

  // SLIDE 5: Process Timeline (Roadmap 5 Bước)
  console.log('[5/20] Dựng Slide 5: Process Timeline (Lộ Trình 5 Bước)...');
  await slideEngine.buildProcessTimeline({
    presentationPath: pptPath,
    slideNumber: 5,
    title: 'LỘ TRÌNH 5 GIAI ĐOẠN TRIỂN KHAI HẠ TẦNG 2026',
    subtitleContext: 'Kế hoạch tuần tự 5 giai đoạn bảo đảm tính liên tục của hoạt động sản xuất',
    presenter,
    palette,
    steps: [
      { stepNumber: 1, label: '01. Khảo Sát', description: 'Rà soát hạ tầng dữ liệu và đánh giá nhu cầu 8 phòng ban.' },
      { stepNumber: 2, label: '02. Thử Nghiệm MCP', description: 'Xây dựng máy chủ MCP Server kết nối cơ sở dữ liệu SQL.' },
      { stepNumber: 3, label: '03. Đóng Gói A2A', description: 'Thiết lập giao thức Agent-to-Agent và phân quyền tác vụ.', isHero: true },
      { stepNumber: 4, label: '04. Triển Khai Cloud', description: 'Đồng bộ hạ tầng Hybrid Cloud và Canva REST API 2 chiều.' },
      { stepNumber: 5, label: '05. Tối Ưu Hóa', description: 'Giám sát SLA 99.99%, kiểm toán chi phí và mở rộng quy mô.' }
    ],
    bottomTakeaway: 'Tiến độ 5 pha giúp đưa hệ thống vào vận hành sau 6 tháng mà không làm gián đoạn doanh nghiệp.'
  });

  // SLIDE 6: SWOT Matrix
  console.log('[6/20] Dựng Slide 6: SWOT Matrix (2x2)...');
  await slideEngine.buildSwotMatrix({
    presentationPath: pptPath,
    slideNumber: 6,
    title: 'MA TRẬN SWOT TRIỂN KHAI AI AGENT DOANH NGHIỆP',
    subtitleContext: 'Đánh giá 4 khía cạnh kỹ thuật, vận hành và quản trị an toàn thông tin',
    presenter,
    palette,
    strengths: ['Tự động hóa 80% tác vụ văn phòng định kỳ.', 'Tốc độ xử lý dữ liệu lớn tăng gấp 5 lần.'],
    weaknesses: ['Chi phí đào tạo nhân sự ban đầu khoảng 200 triệu.', 'Cần chuẩn hóa kho dữ liệu phi cấu trúc cũ.'],
    opportunities: ['Tích hợp hơn 50 công cụ mở rộng qua giao thức MCP.', 'Nâng cao năng lực cạnh tranh trong kỷ nguyên số 2026.'],
    threats: ['Nguy cơ rò rỉ dữ liệu nếu thiếu cơ chế air-gapped.', 'Rủi ro biến động chuẩn công nghệ API quốc tế.'],
    bottomTakeaway: 'Chủ động kiểm soát rủi ro bảo mật để khai thác tối đa sức mạnh của hệ thống Agent.'
  });

  // SLIDE 7: Team Grid (6 Nhân Sự 3x2)
  console.log('[7/20] Dựng Slide 7: Team Grid (Lưới 6 Nhân Sự)...');
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

  // SLIDE 8: Architecture Diagram
  console.log('[8/20] Dựng Slide 8: Architecture Diagram (Phân Tầng 3 Lớp)...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 8,
    title: 'KIẾN TRÚC PHÂN TẦNG 3 LỚP HỆ THỐNG AI AGENT',
    presenter,
    palette,
    leftPanel: {
      header: 'TẦNG TƯƠNG TÁC AGENT & GIAO THỨC TRUNG CHUYỂN',
      headerColor: '#153898',
      points: [
        { title: 'Tầng Agent Ứng Dụng', desc: 'Điều phối các tác nhân AI phân tích, soạn thảo và kiểm toán.' },
        { title: 'Tầng Giao Thức MCP', desc: 'Truyền nhận bản tin JSON-RPC qua stdio và Streamable HTTP.' }
      ]
    },
    rightPanel: {
      header: 'TẦNG DỮ LIỆU DOANH NGHIỆP & BẢO MẬT',
      headerColor: '#153898',
      points: [
        { title: 'Tầng Kết Nối Dữ Liệu', desc: 'Kết nối cơ sở dữ liệu SQL, Data Warehouse và hệ thống ERP.' },
        { title: 'Tường Lửa An Ninh', desc: 'Xác thực OAuth2 và mã hóa hai đầu mút dữ liệu end-to-end.' }
      ]
    },
    bottomBanner: {
      prefix: 'KIẾN TRÚC VỮNG CHẮC',
      content: 'Tách biệt rõ ràng giữa logic nghiệp vụ và tầng dữ liệu giúp hệ thống mở rộng linh hoạt.'
    }
  });

  // SLIDE 9: Protocol Analysis
  console.log('[9/20] Dựng Slide 9: Protocol Analysis (So Sánh 3 Giao Thức)...');
  await slideEngine.buildComparisonMatrix({
    presentationPath: pptPath,
    slideNumber: 9,
    title: 'PHÂN TÍCH SO SÁNH 3 GIAO THỨC KẾT NỐI AI',
    presenter,
    palette,
    columns: [
      { badge: '1. ACP PROTOCOL', paramLabel: 'Cơ chế:', paramVal: 'REST Tĩnh', valScore: '70%', struct: 'Client-Server', impact: 'Cơ bản', desc: 'Độ trễ cao, thích hợp gọi API web truyền thống.', isHero: false },
      { badge: '2. MCP PROTOCOL', paramLabel: 'Cơ chế:', paramVal: 'JSON-RPC 2.0', valScore: '95%', struct: 'Host-Server', impact: 'Chuẩn hóa', desc: 'Mở rộng công cụ đa nền tảng, quản lý phân quyền chặt chẽ.', isHero: false },
      { badge: '3. A2A PROTOCOL', paramLabel: 'Cơ chế:', paramVal: 'Mesh Network', valScore: '99.5%', struct: 'Multi-Agent', impact: 'Toàn diện', desc: 'Trao đổi ngữ cảnh thời gian thực giữa các Agent độc lập.', isHero: true }
    ],
    bottomTakeaway: 'Kết hợp giao thức MCP và A2A Protocol tạo nên hạ tầng kết nối mạnh mẽ và bảo mật nhất.'
  });

  // SLIDE 10: Canvas & Canva Integration
  console.log('[10/20] Dựng Slide 10: Canvas & Canva Integration...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 10,
    title: 'TÍCH HỢP HỆ THỐNG CANVAS VÀ CANVA CLOUD REST API',
    presenter,
    palette,
    leftPanel: {
      header: 'TRÍCH XUẤT DỮ LIỆU TỪ CANVAS LMS',
      headerColor: '#153898',
      points: [
        { title: 'Trích Xuất Kết Quả Học Tập', desc: 'Lấy dữ liệu điểm số và tiến độ học tập qua Canvas REST API.' },
        { title: 'Chuẩn Hóa Dữ Liệu Đầu Vào', desc: 'Chuyển đổi dữ liệu thô sang định dạng JSON có cấu trúc rõ ràng.' }
      ]
    },
    rightPanel: {
      header: 'ĐỒNG BỘ HAI CHIỀU LÊN CANVA CLOUD',
      headerColor: '#153898',
      points: [
        { title: 'Sinh Thiết Kế Tự Động', desc: 'Đẩy slide và infographic lên Canva Cloud qua token bảo mật.' },
        { title: 'Vòng Lặp Phản Hồi Trực Tiếp', desc: 'Nhận bình luận của người dùng và cập nhật slide trong 10 giây.' }
      ]
    },
    bottomBanner: {
      prefix: 'ĐỒNG BỘ HAI CHIỀU',
      content: 'Quy trình khép kín tự động hóa từ dữ liệu học tập đến ấn phẩm trình chiếu trực quan.'
    }
  });

  // SLIDE 11: Security & Compliance
  console.log('[11/20] Dựng Slide 11: Security & Compliance...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 11,
    title: 'TIÊU CHUẨN BẢO MẬT & TUÂN THỦ PHÁP LÝ QUỐC TẾ',
    presenter,
    palette,
    leftPanel: {
      header: 'CƠ CHẾ BẢO MẬT KỸ THUẬT NỘI BỘ',
      headerColor: '#153898',
      points: [
        { title: 'Xác Thực OAuth2 & RBAC', desc: 'Phân quyền truy cập tài nguyên nghiêm ngặt theo vai trò.' },
        { title: 'Hạ Tầng Air-Gapped', desc: 'Tách biệt cụm máy chủ xử lý dữ liệu mật khỏi mạng internet.' }
      ]
    },
    rightPanel: {
      header: 'TUÂN THỦ PHÁP LÝ FERPA & GDPR',
      headerColor: '#153898',
      points: [
        { title: 'Ẩn Danh Dữ Liệu Cá Nhân', desc: 'Mã hóa thông tin định danh PII trước khi đưa vào mô hình.' },
        { title: 'Nhật Ký Kiểm Toán Bất Biến', desc: 'Lưu vết toàn bộ truy vấn của AI phục vụ thanh tra nội bộ.' }
      ]
    },
    bottomBanner: {
      prefix: 'CAM KẾT AN TOÀN',
      content: 'Đáp ứng 100% các tiêu chuẩn bảo mật khắt khe nhất trong ngành giáo dục và tài chính.'
    }
  });

  // SLIDE 12: Cost & ROI Table
  console.log('[12/20] Dựng Slide 12: Cost & ROI Table...');
  await slideEngine.buildKpiDashboard({
    presentationPath: pptPath,
    slideNumber: 12,
    title: 'PHÂN TÍCH HIỆU QUẢ ĐẦU TƯ TÀI CHÍNH & CHỈ SỐ ROI',
    subtitleContext: 'Đánh giá ngân sách triển khai và lợi ích kinh tế định lượng giai đoạn 2026 - 2028',
    presenter,
    palette,
    kpiMetrics: [
      { label: 'VỐN ĐẦU TƯ BAN ĐẦU', value: '1.2 TỶ VNĐ', subtext: 'Chi phí máy chủ, bản quyền phần mềm và đào tạo', status: 'normal' },
      { label: 'THỜI GIAN HÒA VỐN', value: '12 THÁNG', subtext: 'Thu hồi vốn qua cắt giảm 1,800 giờ lao động thủ công', status: 'success' },
      { label: 'TỶ SUẤT HOÀN VỐN (ROI)', value: '+320%', subtext: 'Lợi nhuận ròng tích lũy dự kiến sau 3 năm vận hành', status: 'success' }
    ],
    diagnosticBoxes: [
      { title: 'Tiết Kiệm Chi Phí Vận Hành', body: 'Giảm thiểu 450 triệu VNĐ chi phí thuê ngoài dịch vụ thiết kế và nhập liệu.', type: 'solution' },
      { title: 'Giá Trị Thặng Dư Kinh Tế', body: 'Dự án tạo ra giá trị kinh tế tương đương 3.8 tỷ VNĐ trong 3 năm đầu.', type: 'insight' }
    ]
  });

  // SLIDE 13: Technical Spec
  console.log('[13/20] Dựng Slide 13: Technical Spec (Canva MCP Pro v3.0)...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 13,
    title: 'THÔNG SỐ KỸ THUẬT MÁY CHỦ CANVA MCP PRO v3.0',
    presenter,
    palette,
    leftPanel: {
      header: 'CẤU TRÚC PHẦN MỀM & GIAO THỨC LÕI',
      headerColor: '#153898',
      points: [
        { title: 'TypeScript SDK v2', desc: 'Viết trên nền tảng Model Context Protocol chuẩn quốc tế.' },
        { title: 'Hybrid Rendering Engine', desc: 'Kết hợp Python-pptx ngoại tuyến và Canva Connect REST API.' }
      ]
    },
    rightPanel: {
      header: 'MÔI TRƯỜNG SANDBOX & BẢNG MÀU',
      headerColor: '#153898',
      points: [
        { title: 'Local Code Sandbox', desc: 'Hỗ trợ script Python/JS tính toán tọa độ vector tức thì.' },
        { title: 'Thư Viện 57 Bảng Màu', desc: 'Tích hợp chuẩn nhận diện IUH Brand và bảng màu quốc tế.' }
      ]
    },
    bottomBanner: {
      prefix: 'HIỆU NĂNG VƯỢT TRỘI',
      content: 'Đạt độ trễ xử lý dưới 15ms cho mỗi thao tác dựng hình vector trực tiếp trên máy chủ.'
    }
  });

  // SLIDE 14: Quality Audit
  console.log('[14/20] Dựng Slide 14: Quality Audit (Quy Trình Kiểm Duyệt)...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 14,
    title: 'QUY TRÌNH KIỂM DUYỆT TỰ ĐỘNG DECK-AUDITOR',
    presenter,
    palette,
    leftPanel: {
      header: 'QUY CHUẨN THIẾT KẾ VÀ KHÔNG GIAN SLIDE',
      headerColor: '#153898',
      points: [
        { title: 'Cỡ Chữ Tối Thiểu 24pt', desc: 'Tuyệt đối không sử dụng chữ nhỏ dưới 24pt trong phần nội dung.' },
        { title: 'Cân Bằng Khoảng Trống', desc: 'Giữ lề an toàn tối thiểu 0.8 inch để ngăn chặn hiện tượng tràn chữ.' }
      ]
    },
    rightPanel: {
      header: 'KIỂM ĐỊNH NỘI DUNG VÀ SỐ LIỆU THỰC CHỨNG',
      headerColor: '#153898',
      points: [
        { title: 'Bộ Lọc Anti-Slop', desc: 'Loại bỏ hoàn toàn các từ sáo rỗng AI và quảng cáo vô căn cứ.' },
        { title: 'Bắt Buộc Số Liệu Cụ Thể', desc: 'Mỗi slide đều phải chứa tỷ lệ % hoặc số liệu đo lường thực tế.' }
      ]
    },
    bottomBanner: {
      prefix: 'ĐẢM BẢO CHẤT LƯỢNG',
      content: 'Tự động chấm điểm thẩm mỹ và từ chối xuất bản bài trình chiếu dưới 85 điểm.'
    }
  });

  // SLIDE 15: Case Study 1
  console.log('[15/20] Dựng Slide 15: Case Study 1 (Báo Cáo Tài Chính)...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 15,
    title: 'ĐIỂN HÌNH 1: TỰ ĐỘNG HÓA BÁO CÁO TÀI CHÍNH HÀNG THÁNG',
    presenter,
    palette,
    leftPanel: {
      header: 'HIỆN TRẠNG QUY TRÌNH THỦ CÔNG CŨ',
      headerColor: '#153898',
      points: [
        { title: 'Mất 3 Ngày Tổng Hợp', desc: 'Chuyên viên mất 24 giờ làm việc để ghép dữ liệu kế toán vào slide.' },
        { title: 'Tỷ Lệ Sai Sót 3.5%', desc: 'Thường xuyên nhầm lẫn số liệu các chỉ số tài chính do sao chép tay.' }
      ]
    },
    rightPanel: {
      header: 'KẾT QUẢ ĐỘT PHÁ VỚI DATA-TO-SLIDE',
      headerColor: '#153898',
      points: [
        { title: 'Rút Ngắn Còn 5 Phút', desc: 'Tool tự động đọc tệp CSV/JSON và sinh 15 slide hoàn chỉnh.' },
        { title: 'Độ Chính Xác Đạt 100%', desc: 'Loại bỏ hoàn toàn lỗi sao chép dữ liệu của con người.' }
      ]
    },
    bottomBanner: {
      prefix: 'KẾT QUẢ THỰC TIỄN',
      content: 'Tiết kiệm 280 giờ công mỗi năm cho phòng tài chính và kiểm toán nội bộ doanh nghiệp.'
    }
  });

  // SLIDE 16: Case Study 2
  console.log('[16/20] Dựng Slide 16: Case Study 2 (Canva Comments Loop)...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 16,
    title: 'ĐIỂN HÌNH 2: VÒNG LẶP SỬA SLIDE QUA CANVA COMMENTS API',
    presenter,
    palette,
    leftPanel: {
      header: 'QUY TRÌNH PHÊ DUYỆT TRUYỀN THỐNG',
      headerColor: '#153898',
      points: [
        { title: 'Chờ Đợi 48 Giờ Qua Email', desc: 'Ý kiến góp ý phân tán qua nhiều luồng email và ứng dụng chat.' },
        { title: 'Xung Đột Phiên Bản', desc: 'Dễ ghi đè nhầm lẫn giữa các bản thảo slide của nhiều người sửa.' }
      ]
    },
    rightPanel: {
      header: 'TỰ ĐỘNG HÓA VỚI AUTO-FIX COMMENT',
      headerColor: '#153898',
      points: [
        { title: 'Lắng Nghe Bình Luận Cloud', desc: 'Tool canva_read_design_comments quét góp ý của lãnh đạo.' },
        { title: 'Tự Động Sửa Trong 15 Giây', desc: 'Cập nhật trực tiếp vào slide và phản hồi xác nhận trên Canva.' }
      ]
    },
    bottomBanner: {
      prefix: 'TỐI ƯU CỘNG TÁC',
      content: 'Giảm 90% thời gian duyệt bài trình chiếu giữa ban lãnh đạo và chuyên viên kỹ thuật.'
    }
  });

  // SLIDE 17: Risk Mitigation
  console.log('[17/20] Dựng Slide 17: Risk Mitigation (Phương Án Dự Phòng)...');
  await slideEngine.buildSwotMatrix({
    presentationPath: pptPath,
    slideNumber: 17,
    title: 'DANH MỤC RỦI RO HẠ TẦNG & PHƯƠNG ÁN DỰ PHÒNG KHẨN CẤP',
    subtitleContext: '4 nhóm rủi ro vận hành trọng yếu và kịch bản ứng phó kỹ thuật tức thì',
    presenter,
    palette,
    strengths: ['Mất kết nối mạng: Chuyển sang chế độ Local Engine ngoại tuyến 100% ngay lập tức.'],
    weaknesses: ['Quá tải hệ thống: Kích hoạt cụm Docker phụ và thuật toán cân bằng tải Auto-scaling.'],
    opportunities: ['Dữ liệu trôi dạt (Data Drift): Thiết lập bộ kiểm định phân phối dữ liệu định kỳ mỗi tuần.'],
    threats: ['Tấn công mạng: Cách ly nút mạng nghi vấn và phục hồi dữ liệu từ bản sao lưu bảo mật.'],
    bottomTakeaway: 'Hệ thống bảo đảm chỉ số sẵn sàng cao đạt 99.99% trong mọi tình huống khẩn cấp.'
  });

  // SLIDE 18: Resource Allocation
  console.log('[18/20] Dựng Slide 18: Resource Allocation (Phân Bổ Tài Nguyên)...');
  await slideEngine.buildComparisonMatrix({
    presentationPath: pptPath,
    slideNumber: 18,
    title: 'PHÂN BỔ TÀI NGUYÊN MÁY CHỦ & HẠ TẦNG MẠNG',
    presenter,
    palette,
    columns: [
      { badge: '1. DOCKER CLUSTER', paramLabel: 'Cấu hình:', paramVal: '64 vCPU / 256GB RAM', valScore: 'Sẵn sàng', struct: 'Cụm Kubernetes', impact: 'Cốt lõi', desc: 'Chạy các tác vụ tính toán nặng và huấn luyện mô hình Agent.', isHero: false },
      { badge: '2. HTTP TRANSPORT', paramLabel: 'Cấu hình:', paramVal: 'Băng thông 10 Gbps', valScore: 'Độ trễ <10ms', struct: 'JSON-RPC Stream', impact: 'Truyền dẫn', desc: 'Đảm bảo truyền tải luồng dữ liệu thời gian thực giữa các nút mạng.', isHero: true },
      { badge: '3. CLOUD GATEWAY', paramLabel: 'Cấu hình:', paramVal: 'Tải 10,000 req/min', valScore: 'Uptime 99.99%', struct: 'API Gateway WAF', impact: 'Bảo vệ', desc: 'Kiểm soát truy cập API và ngăn chặn tấn công mạng từ bên ngoài.', isHero: false }
    ],
    bottomTakeaway: 'Phân bổ tài nguyên thông minh tối ưu hóa 35% chi phí thuê hạ tầng máy chủ đám mây.'
  });

  // SLIDE 19: Action Plan Q1-Q4
  console.log('[19/20] Dựng Slide 19: Action Plan Q1-Q4...');
  await slideEngine.buildProcessTimeline({
    presentationPath: pptPath,
    slideNumber: 19,
    title: 'KẾ HOẠCH HÀNH ĐỘNG CHI TIẾT 4 QUÝ NĂM 2026',
    subtitleContext: 'Các mốc bàn giao then chốt để đưa toàn bộ hệ thống vào vận hành chính thức',
    presenter,
    palette,
    steps: [
      { stepNumber: 1, label: 'Q1. Chuẩn Bị & Khảo Sát', description: 'Hoàn thiện thiết kế kiến trúc và lắp đặt cụm máy chủ chuyên dụng.' },
      { stepNumber: 2, label: 'Q2. Triển Khai Thử Nghiệm', description: 'Thử nghiệm tại Phòng Kế toán và Ban Đào tạo với 50 người dùng.' },
      { stepNumber: 3, label: 'Q3. Tích Hợp Đa Nền Tảng', description: 'Kết nối toàn diện với Canva Cloud REST API và hệ thống Canvas LMS.', isHero: true },
      { stepNumber: 4, label: 'Q4. Vận Hành Tự Chủ', description: 'Chuyển giao công nghệ và chính thức vận hành trên toàn tổ chức.' }
    ],
    bottomTakeaway: 'Bảo đảm hoàn thành 100% mục tiêu chuyển đổi số đúng tiến độ trong năm 2026.'
  });

  // SLIDE 20: Closing & Q&A
  console.log('[20/20] Dựng Slide 20: Closing & Q&A...');
  await slideEngine.buildSplitArchitecture({
    presentationPath: pptPath,
    slideNumber: 20,
    title: 'KẾT LUẬN & PHIÊN THẢO LUẬN HỎI ĐÁP (Q&A)',
    presenter,
    palette,
    leftPanel: {
      header: 'CAM KẾT HÀNH ĐỘNG DỰ ÁN 2026',
      headerColor: '#153898',
      points: [
        { title: 'Chuyển Giao Công Nghệ', desc: 'Đào tạo chuyên sâu và bàn giao 100% tài liệu kỹ thuật.' },
        { title: 'Hỗ Trợ Kỹ Thuật 24/7', desc: 'Duy trì cam kết SLA 99.99% và xử lý sự cố trong 15 phút.' }
      ]
    },
    rightPanel: {
      header: 'THÔNG TIN LIÊN HỆ & THẢO LUẬN (Q&A)',
      headerColor: '#153898',
      points: [
        { title: 'Chủ Trì & Báo Cáo Viên', desc: 'Lê Anh Duy (Lead AI Architect & Systems Engineer).' },
        { title: 'Kênh Trao Đổi Kỹ Thuật', desc: 'Email: duyle@enterprise-ai.vn | Hotline: 090-888-2026.' }
      ]
    },
    bottomBanner: {
      prefix: 'LỜI CẢM ƠN',
      content: 'Trân trọng cảm ơn Ban Lãnh Đạo và các Chuyên gia. Xin mời quý đại biểu bước vào phiên hỏi đáp Q&A!'
    }
  });

  // Trim excess slides so that total slides is exactly 20
  console.log('\n--- CẮT TỈA CÁC SLIDE THỪA (GIỮ ĐÚNG 20 SLIDE) ---');
  await slideEngine.trimSlides(pptPath, 20);
  console.log('✅ Đã định hình chính xác bài trình chiếu gồm đúng 20 slide hoàn chỉnh!');

  // Run Deck Auditor
  console.log('\n--- CHẠY BỘ KIỂM DUYỆT DECK-AUDITOR ---');
  const auditReport = await auditEntireDeck(pptPath);
  console.log(`📊 Tổng số slide kiểm định : ${auditReport.totalSlides}`);
  console.log(`⭐ Điểm chất lượng toàn bài  : ${auditReport.deckScore}/100 (${auditReport.overallStatus})`);
  console.log(`✅ Số slide đạt chuẩn cao cấp: ${auditReport.statistics.compliantSlides}/${auditReport.totalSlides}`);
  console.log(`🔎 Slide vi phạm cỡ chữ nhỏ  : [${auditReport.statistics.slidesWithSmallFont.join(', ')}]`);
  console.log(`🔎 Slide dính từ ngữ sáo rỗng: [${auditReport.statistics.slidesWithSlop.join(', ')}]`);
  console.log(`🔎 Slide thiếu huy hiệu Duy  : [${auditReport.statistics.slidesMissingPresenter.join(', ')}]`);
  console.log(`🔎 Slide thiếu số liệu thực  : [${auditReport.statistics.slidesLackingHardFacts.join(', ')}]`);

  if (auditReport.prioritizedActionPlan.length > 0) {
    console.log('\nKế hoạch hành động:', auditReport.prioritizedActionPlan);
  } else {
    console.log('\n🎉 HOÀN TOÀN KHÔNG CÓ VI PHẠM THIẾT KẾ NÀO! ĐẠT 100% TIÊU CHUẨN TASTE-SKILL!');
  }
}

main().catch(err => {
  console.error('❌ Thất bại:', err);
  process.exit(1);
});
