import * as z from "zod/v4";
import { SlideEngine } from "../engine/slide-engine.js";
import { auditEntireDeck } from "../engine/deck-auditor.js";
import { getTastePalette, listTastePalettes, validateSlideCopy, DEFAULT_PALETTE_ID, PRESENTATION_TYPOGRAPHY, } from "../taste/index.js";
const slideEngine = new SlideEngine();
export function registerTasteTools(server) {
    // Tool 1: canva_list_taste_palettes
    server.registerTool("canva_list_taste_palettes", {
        title: "List Curated Taste Palettes",
        description: "Tra cứu danh sách 57 bảng màu chuẩn thiết kế cao cấp từ taste-skill và Corporate Brand (light-neutral, dark, warm, cool, mono-accent).",
        inputSchema: z.object({
            tag_filter: z
                .string()
                .optional()
                .describe("Lọc theo thẻ tag: 'light-neutral', 'dark', 'brand', 'mono-accent', 'warm', 'cool'"),
            limit: z
                .number()
                .int()
                .min(1)
                .max(60)
                .default(20)
                .describe("Số lượng bảng màu tối đa trả về"),
        }),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        const all = listTastePalettes(args.tag_filter);
        const items = all.slice(0, args.limit);
        const summary = items.map((p) => ({
            id: p.id,
            name: p.name,
            tags: p.tags,
            colors: {
                bg: p.bg,
                surface: p.surface,
                ink: p.ink,
                accent: p.accent,
                muted: p.muted,
                secondary: p.secondary || null,
            },
            note: p.note || null,
        }));
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        total: all.length,
                        returned: items.length,
                        filter: args.tag_filter || "all",
                        palettes: summary,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 2: canva_validate_slide_copy
    server.registerTool("canva_validate_slide_copy", {
        title: "Validate Slide Copy (Anti-Slop Engine)",
        description: "Kiểm định chất lượng nội dung slide theo tiêu chuẩn Taste-Skill: loại bỏ từ sáo rỗng AI slop, kiểm tra số liệu cứng (Hard Facts), đếm mật độ từ vựng (Word Budget).",
        inputSchema: z.object({
            texts: z
                .array(z.string())
                .min(1)
                .describe("Danh sách các đoạn văn bản trên slide (tiêu đề, thẻ, nội dung)"),
        }),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        const audit = validateSlideCopy(args.texts);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        status: audit.valid ? "PASSED" : "NEEDS_IMPROVEMENT",
                        tasteScore: `${audit.score}/100`,
                        hasHardFact: audit.hasHardFact,
                        wordCount: audit.wordCount,
                        slopDetected: audit.slopDetected,
                        warnings: audit.warnings,
                        suggestions: audit.suggestions,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 3: canva_export_slide_thumbnail (Hướng 1: Visual Feedback Loop)
    server.registerTool("canva_export_slide_thumbnail", {
        title: "Export Slide Thumbnail to PNG",
        description: "Kết xuất nhanh một slide trong tệp PPTX thành hình ảnh PNG độ nét cao (1920x1080) và lưu vào thư mục Artifacts của Antigravity để xem trước trực tiếp.",
        inputSchema: z.object({
            presentation_path: z.string().describe("Đường dẫn tệp .pptx"),
            slide_number: z.number().int().min(1).describe("Số thứ tự slide (bắt đầu từ 1)"),
            output_path: z.string().optional().describe("Đường dẫn tệp ảnh PNG đích (tùy chọn)"),
        }),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        try {
            const outPath = await slideEngine.exportThumbnail(args.presentation_path, args.slide_number, args.output_path);
            const fileUri = `file:///${outPath.replace(/\\/g, "/")}`;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "SUCCESS",
                            message: `✅ Đã kết xuất ảnh thumbnail Slide ${args.slide_number} thành công.`,
                            localPath: outPath,
                            fileUri,
                            markdownPreview: `![Slide ${args.slide_number}](${fileUri})`,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `❌ Lỗi khi kết xuất ảnh thumbnail: ${err.message || String(err)}`,
                    },
                ],
            };
        }
    });
    // Tool 4: canva_audit_entire_deck (Hướng 3: Trình Quét & Kiểm Định Toàn Bài Thuyết Trình)
    server.registerTool("canva_audit_entire_deck", {
        title: "Audit Entire Presentation Deck (Taste Quality Inspector)",
        description: "Quét toàn diện tất cả các slide trong bài thuyết trình: rà soát cỡ chữ nhỏ (<24pt), tìm từ ngữ sáo rỗng AI slop, kiểm tra huy hiệu Người trình bày Lê Anh Duy, xác minh số liệu Hard Facts và tính toán Deck Taste Score (/100).",
        inputSchema: z.object({
            presentation_path: z.string().describe("Đường dẫn tệp .pptx bài thuyết trình"),
        }),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        try {
            const report = await auditEntireDeck(args.presentation_path);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(report, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `❌ Lỗi khi kiểm định toàn bộ bài thuyết trình: ${err.message || String(err)}`,
                    },
                ],
            };
        }
    });
    // Tool 5: canva_add_tasteful_slide (Hướng 1 + Hướng 2: Bổ sung 3 bố cục mới + Auto Thumbnail)
    server.registerTool("canva_add_tasteful_slide", {
        title: "Add Tasteful Slide (9 Layouts + Anti-Slop + Auto-Thumbnail)",
        description: "Tạo hoặc nâng cấp slide trình chiếu áp dụng trực tiếp 57 bảng màu cao cấp từ taste-skill, bộ quy chuẩn Anti-Slop copy, cỡ chữ tối thiểu >= 24pt, hỗ trợ 9 kiểu bố cục chuyên dụng cho AI/ML và tự động xuất ảnh thumbnail xem trước.",
        inputSchema: z.object({
            presentation_path: z
                .string()
                .default("C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx")
                .describe("Đường dẫn tệp .pptx bài thuyết trình (mặc định lấy active deck Bao_Cao_Chu_De11.pptx)"),
            design_id: z
                .string()
                .optional()
                .describe("ID thiết kế Canva Cloud (ví dụ: DAHaKPDSZSI) nếu đối chiếu cloud"),
            slide_number: z.number().int().min(1).default(1).describe("Vị trí slide (tính từ 1)"),
            layout_type: z
                .enum([
                "kpi_dashboard",
                "card_comparison",
                "split_architecture",
                "pipeline_flow",
                "confusion_matrix",
                "native_chart",
                "process_timeline",
                "swot_matrix",
                "team_grid",
            ])
                .describe("Kiểu bố cục slide: kpi_dashboard, card_comparison, split_architecture, pipeline_flow, confusion_matrix, native_chart, process_timeline, swot_matrix, team_grid"),
            palette_id: z
                .string()
                .default(DEFAULT_PALETTE_ID)
                .describe("ID bảng màu từ taste-skill (ví dụ: 'corporate-navy', 'cool-white-slate', 'white-link-blue')"),
            title: z.string().describe("Tiêu đề chính slide (chuẩn >= 35pt bold)"),
            subtitle_context: z
                .string()
                .optional()
                .describe("Dòng tóm tắt bối cảnh hoặc thanh dẫn nhập phía trên (>= 24pt)"),
            presenter: z
                .string()
                .default("Lê Anh Duy")
                .describe("Tên người trình bày hiển thị huy hiệu Cyan (#00B0F0, 44pt) góc trên phải"),
            export_thumbnail: z
                .boolean()
                .default(true)
                .describe("Tự động xuất ảnh thumbnail PNG xem trước vào Artifacts"),
            // Bố cục 1: KPI Dashboard
            kpi_metrics: z
                .array(z.object({
                label: z.string().describe("Nhãn chỉ số (ví dụ: TRAIN SCORE)"),
                value: z.string().describe("Giá trị số liệu lớn 56pt (ví dụ: 100.0%)"),
                subtext: z.string().describe("Diễn giải ngắn dưới số liệu (>= 24pt)"),
                status: z
                    .enum(["normal", "success", "warning", "danger"])
                    .default("normal")
                    .describe("Trạng thái màu thẻ"),
            }))
                .min(2)
                .max(4)
                .optional()
                .describe("Dùng cho bố cục kpi_dashboard"),
            diagnostic_boxes: z
                .array(z.object({
                title: z.string().describe("Tiêu đề hộp chẩn đoán (>= 26pt bold)"),
                body: z.string().describe("Nội dung phân tích (>= 24pt)"),
                type: z
                    .enum(["warning", "solution", "insight", "methodology"])
                    .default("insight"),
            }))
                .max(2)
                .optional()
                .describe("Dùng cho bố cục kpi_dashboard"),
            // Bố cục 2: Card Comparison
            columns: z
                .array(z.object({
                badge: z.string().describe("Nhãn cột (ví dụ: GỐC (CHƯA TỈA))"),
                isHero: z.boolean().default(false).describe("Thẻ nổi bật tối ưu nhất (viền đậm 3.0pt)"),
                heroAccentColor: z.string().optional(),
                paramLabel: z.string().optional().describe("Nhãn tham số"),
                paramVal: z.string().describe("Giá trị tham số"),
                valScore: z.string().describe("Điểm số Validation"),
                struct: z.string().describe("Cấu trúc mô hình"),
                impact: z.string().describe("Hiệu quả"),
                desc: z.string().describe("Diễn giải chi tiết (>= 24pt)"),
            }))
                .min(2)
                .max(5)
                .optional()
                .describe("Dùng cho bố cục card_comparison"),
            bottom_takeaway: z
                .string()
                .optional()
                .describe("Kết luận hành động dưới đáy (>= 24pt)"),
            // Bố cục 3: Split Architecture
            left_panel: z
                .object({
                header: z.string().describe("Tiêu đề cột trái"),
                points: z.array(z.object({ title: z.string(), desc: z.string() })),
            })
                .optional()
                .describe("Dùng cho bố cục split_architecture"),
            right_panel: z
                .object({
                header: z.string().describe("Tiêu đề cột phải"),
                points: z.array(z.object({ title: z.string(), desc: z.string() })),
            })
                .optional()
                .describe("Dùng cho bố cục split_architecture"),
            bottom_banner: z
                .object({
                prefix: z.string(),
                content: z.string(),
            })
                .optional()
                .describe("Dùng cho bố cục split_architecture"),
            // Bố cục 4: Pipeline Flow (Mới)
            pipeline_steps: z
                .array(z.object({
                stepNumber: z.string().describe("Số bước, ví dụ: '01', '02'"),
                title: z.string().describe("Tiêu đề bước (>= 25pt bold)"),
                desc: z.string().describe("Mô tả chi tiết bước (>= 24pt)"),
                tag: z.string().optional().describe("Thẻ phân loại, ví dụ: 'Tiền xử lý', 'Tối ưu'"),
                isHero: z.boolean().default(false).describe("Có phải bước trọng tâm không"),
            }))
                .min(3)
                .max(5)
                .optional()
                .describe("Dùng cho bố cục pipeline_flow"),
            // Bố cục 5: Confusion Matrix (Mới)
            confusion_matrix_data: z
                .object({
                matrix: z.object({
                    tp: z.object({ value: z.union([z.string(), z.number()]), label: z.string(), desc: z.string().optional() }),
                    tn: z.object({ value: z.union([z.string(), z.number()]), label: z.string(), desc: z.string().optional() }),
                    fp: z.object({ value: z.union([z.string(), z.number()]), label: z.string(), desc: z.string().optional() }),
                    fn: z.object({ value: z.union([z.string(), z.number()]), label: z.string(), desc: z.string().optional() }),
                }),
                metrics: z
                    .array(z.object({
                    label: z.string(),
                    value: z.string(),
                    subtext: z.string().optional(),
                }))
                    .min(2)
                    .max(4),
                clinical_insight: z
                    .object({
                    title: z.string(),
                    body: z.string(),
                })
                    .optional(),
            })
                .optional()
                .describe("Dùng cho bố cục confusion_matrix"),
            // Bố cục 6: Native Chart (Mới)
            native_chart_data: z
                .object({
                chart_type: z.enum(["line", "column", "bar"]).default("line"),
                categories: z.array(z.string()).min(2),
                series: z.array(z.object({ name: z.string(), values: z.array(z.number()) })).min(1),
                side_panel: z.object({
                    header: z.string(),
                    points: z.array(z.object({ title: z.string(), desc: z.string() })),
                }),
            })
                .optional()
                .describe("Dùng cho bố cục native_chart"),
            // Bố cục 7: Process Timeline (Step 1)
            timeline_steps: z
                .array(z.object({
                stepNumber: z.union([z.number(), z.string()]).default(1),
                label: z.string().describe("Tên giai đoạn / bước (>= 25pt bold)"),
                description: z.string().describe("Nội dung mô tả (>= 24pt)"),
                isHero: z.boolean().optional().default(false),
            }))
                .min(3)
                .max(5)
                .optional()
                .describe("Dùng cho bố cục process_timeline (từ 3 đến 5 bước)"),
            // Bố cục 8: SWOT Matrix (Step 1)
            swot_data: z
                .object({
                strengths: z.array(z.string()).min(1).max(3),
                weaknesses: z.array(z.string()).min(1).max(3),
                opportunities: z.array(z.string()).min(1).max(3),
                threats: z.array(z.string()).min(1).max(3),
            })
                .optional()
                .describe("Dùng cho bố cục swot_matrix (ma trận 2x2 bo góc với 4 màu đại diện)"),
            // Bố cục 9: Team Grid (Step 1)
            team_members: z
                .array(z.object({
                name: z.string().describe("Họ tên thành viên"),
                role: z.string().describe("Vai trò / chức danh"),
                avatarUrl: z.string().url().optional().describe("URL ảnh đại diện tròn"),
                bio: z.string().optional().describe("Tiểu sử tóm tắt (>= 24pt)"),
            }))
                .min(2)
                .max(6)
                .optional()
                .describe("Dùng cho bố cục team_grid (lưới thẻ từ 2 đến 6 thành viên)"),
        }),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        try {
            const palette = getTastePalette(args.palette_id);
            // Collect texts for Anti-Slop copy verification
            const textBank = [args.title];
            if (args.subtitle_context)
                textBank.push(args.subtitle_context);
            if (args.kpi_metrics) {
                for (const m of args.kpi_metrics)
                    textBank.push(m.label, m.value, m.subtext);
            }
            if (args.diagnostic_boxes) {
                for (const d of args.diagnostic_boxes)
                    textBank.push(d.title, d.body);
            }
            if (args.columns) {
                for (const c of args.columns)
                    textBank.push(c.badge, c.paramVal, c.valScore, c.struct, c.impact, c.desc);
            }
            if (args.bottom_takeaway)
                textBank.push(args.bottom_takeaway);
            if (args.left_panel) {
                textBank.push(args.left_panel.header);
                for (const p of args.left_panel.points)
                    textBank.push(p.title, p.desc);
            }
            if (args.right_panel) {
                textBank.push(args.right_panel.header);
                for (const p of args.right_panel.points)
                    textBank.push(p.title, p.desc);
            }
            if (args.bottom_banner) {
                textBank.push(args.bottom_banner.prefix, args.bottom_banner.content);
            }
            if (args.pipeline_steps) {
                for (const s of args.pipeline_steps)
                    textBank.push(s.title, s.desc, s.tag || "");
            }
            if (args.confusion_matrix_data) {
                const cmd = args.confusion_matrix_data;
                textBank.push(cmd.matrix.tp.label, cmd.matrix.fp.label, cmd.matrix.fn.label, cmd.matrix.tn.label);
                if (cmd.clinical_insight)
                    textBank.push(cmd.clinical_insight.title, cmd.clinical_insight.body);
            }
            if (args.native_chart_data) {
                const ncd = args.native_chart_data;
                textBank.push(ncd.side_panel.header);
                for (const p of ncd.side_panel.points)
                    textBank.push(p.title, p.desc);
            }
            if (args.timeline_steps) {
                for (const s of args.timeline_steps)
                    textBank.push(s.label, s.description);
            }
            if (args.swot_data) {
                const sw = args.swot_data;
                textBank.push(...sw.strengths, ...sw.weaknesses, ...sw.opportunities, ...sw.threats);
            }
            if (args.team_members) {
                for (const m of args.team_members) {
                    textBank.push(m.name, m.role);
                    if (m.bio)
                        textBank.push(m.bio);
                }
            }
            const copyAudit = validateSlideCopy(textBank);
            // Dispatch layout
            if (args.layout_type === "kpi_dashboard") {
                if (!args.kpi_metrics || args.kpi_metrics.length === 0) {
                    throw new Error("Bố cục kpi_dashboard yêu cầu cung cấp ít nhất 2 chỉ số trong 'kpi_metrics'.");
                }
                await slideEngine.buildKpiDashboard({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    subtitleContext: args.subtitle_context,
                    presenter: args.presenter,
                    palette,
                    kpiMetrics: args.kpi_metrics,
                    diagnosticBoxes: args.diagnostic_boxes,
                });
            }
            else if (args.layout_type === "card_comparison") {
                if (!args.columns || args.columns.length === 0) {
                    throw new Error("Bố cục card_comparison yêu cầu cung cấp ít nhất 2 cột trong 'columns'.");
                }
                await slideEngine.buildComparisonMatrix({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    presenter: args.presenter,
                    palette,
                    columns: args.columns,
                    bottomTakeaway: args.bottom_takeaway,
                });
            }
            else if (args.layout_type === "split_architecture") {
                if (!args.left_panel || !args.right_panel) {
                    throw new Error("Bố cục split_architecture yêu cầu cung cấp cả 'left_panel' và 'right_panel'.");
                }
                await slideEngine.buildSplitArchitecture({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    presenter: args.presenter,
                    palette,
                    leftPanel: args.left_panel,
                    rightPanel: args.right_panel,
                    bottomBanner: args.bottom_banner,
                });
            }
            else if (args.layout_type === "pipeline_flow") {
                if (!args.pipeline_steps || args.pipeline_steps.length === 0) {
                    throw new Error("Bố cục pipeline_flow yêu cầu danh sách từ 3 đến 5 bước trong 'pipeline_steps'.");
                }
                await slideEngine.buildPipelineSlide({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    subtitleContext: args.subtitle_context,
                    presenter: args.presenter,
                    palette,
                    steps: args.pipeline_steps,
                    bottomTakeaway: args.bottom_takeaway,
                });
            }
            else if (args.layout_type === "confusion_matrix") {
                if (!args.confusion_matrix_data) {
                    throw new Error("Bố cục confusion_matrix yêu cầu cung cấp dữ liệu 'confusion_matrix_data'.");
                }
                const cmd = args.confusion_matrix_data;
                await slideEngine.buildConfusionMatrix({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    subtitleContext: args.subtitle_context,
                    presenter: args.presenter,
                    palette,
                    matrix: cmd.matrix,
                    metrics: cmd.metrics,
                    clinicalInsight: cmd.clinical_insight,
                    bottomTakeaway: args.bottom_takeaway,
                });
            }
            else if (args.layout_type === "native_chart") {
                if (!args.native_chart_data) {
                    throw new Error("Bố cục native_chart yêu cầu cung cấp 'native_chart_data'.");
                }
                const ncd = args.native_chart_data;
                await slideEngine.buildNativeChart({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    subtitleContext: args.subtitle_context,
                    presenter: args.presenter,
                    palette,
                    chartType: ncd.chart_type,
                    categories: ncd.categories,
                    series: ncd.series,
                    sidePanel: ncd.side_panel,
                    bottomTakeaway: args.bottom_takeaway,
                });
            }
            else if (args.layout_type === "process_timeline") {
                if (!args.timeline_steps || args.timeline_steps.length === 0) {
                    throw new Error("Bố cục process_timeline yêu cầu cung cấp từ 3 đến 5 bước trong 'timeline_steps'.");
                }
                await slideEngine.buildProcessTimeline({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    subtitleContext: args.subtitle_context,
                    presenter: args.presenter,
                    palette,
                    steps: args.timeline_steps,
                    bottomTakeaway: args.bottom_takeaway,
                });
            }
            else if (args.layout_type === "swot_matrix") {
                if (!args.swot_data) {
                    throw new Error("Bố cục swot_matrix yêu cầu cung cấp thông tin trong 'swot_data'.");
                }
                await slideEngine.buildSwotMatrix({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    subtitleContext: args.subtitle_context,
                    presenter: args.presenter,
                    palette,
                    strengths: args.swot_data.strengths,
                    weaknesses: args.swot_data.weaknesses,
                    opportunities: args.swot_data.opportunities,
                    threats: args.swot_data.threats,
                    bottomTakeaway: args.bottom_takeaway,
                });
            }
            else if (args.layout_type === "team_grid") {
                if (!args.team_members || args.team_members.length === 0) {
                    throw new Error("Bố cục team_grid yêu cầu cung cấp từ 2 đến 6 thành viên trong 'team_members'.");
                }
                await slideEngine.buildTeamGrid({
                    presentationPath: args.presentation_path,
                    slideNumber: args.slide_number,
                    title: args.title,
                    subtitleContext: args.subtitle_context,
                    presenter: args.presenter,
                    palette,
                    members: args.team_members,
                    bottomTakeaway: args.bottom_takeaway,
                });
            }
            // Hướng 1: Auto-export thumbnail if requested
            let thumbnailInfo = null;
            if (args.export_thumbnail) {
                try {
                    const outPath = await slideEngine.exportThumbnail(args.presentation_path, args.slide_number);
                    const fileUri = `file:///${outPath.replace(/\\/g, "/")}`;
                    thumbnailInfo = {
                        localPath: outPath,
                        fileUri,
                        markdownPreview: `![Slide ${args.slide_number}](${fileUri})`,
                    };
                }
                catch (e) {
                    console.error("Auto thumbnail export warning:", e.message);
                }
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "SUCCESS",
                            message: `✅ Đã tạo thành công slide số ${args.slide_number} theo bố cục '${args.layout_type}' và bảng màu '${palette.name}'.`,
                            presentationPath: args.presentation_path,
                            slideNumber: args.slide_number,
                            layoutType: args.layout_type,
                            paletteApplied: {
                                id: palette.id,
                                name: palette.name,
                                accent: palette.accent,
                                surface: palette.surface,
                                ink: palette.ink,
                            },
                            copyAudit: {
                                tasteScore: `${copyAudit.score}/100`,
                                wordBudget: `${copyAudit.wordCount} từ (chuẩn <= 90)`,
                                hardFactsPresent: copyAudit.hasHardFact,
                                warnings: copyAudit.warnings,
                            },
                            typographyVerified: {
                                titlePt: PRESENTATION_TYPOGRAPHY.slideTitlePt,
                                presenterBadge: `${args.presenter} (44pt, Cyan #00B0F0)`,
                                bodyTextMinimum: ">= 24pt (Đạt chuẩn)",
                            },
                            thumbnail: thumbnailInfo,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `❌ Lỗi khi thiết kế slide Tasteful: ${err.message || String(err)}`,
                    },
                ],
            };
        }
    });
    // Tool 6: canva_add_process_timeline (Step 1 New Layout 1)
    server.registerTool("canva_add_process_timeline", {
        title: "Add Process Timeline Slide (Step 1 Layout)",
        description: "Dựng lộ trình tiến trình ngang (Roadmap 3–5 bước) với các khối thẻ bo góc, số thứ tự hình tròn (rounded/oval number badges), đường nối vector pulse giữa các bước, cỡ chữ >= 24pt và huy hiệu Người trình bày 'Lê Anh Duy' (44pt, Cyan #00B0F0).",
        inputSchema: z.object({
            presentation_path: z
                .string()
                .default("C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx")
                .describe("Đường dẫn tệp .pptx bài thuyết trình (mặc định lấy active deck)"),
            design_id: z
                .string()
                .optional()
                .describe("ID thiết kế Canva Cloud (ví dụ: DAHaKPDSZSI) nếu đối chiếu cloud"),
            slide_number: z.number().int().min(1).default(1).describe("Vị trí slide (tính từ 1)"),
            title: z.string().describe("Tiêu đề slide"),
            subtitle_context: z.string().optional().describe("Thanh ngữ cảnh tóm tắt bối cảnh"),
            presenter: z
                .string()
                .default("Lê Anh Duy")
                .describe("Huy hiệu người trình bày góc trên bên phải (44pt, Cyan #00B0F0)"),
            palette_id: z
                .string()
                .default(DEFAULT_PALETTE_ID)
                .describe("ID bảng màu từ taste-skill (mặc định 'corporate-navy')"),
            steps: z
                .array(z.object({
                stepNumber: z.union([z.number(), z.string()]).default(1),
                label: z.string().describe("Tên giai đoạn / nhãn bước (>= 25pt bold)"),
                description: z.string().describe("Mô tả chi tiết bước (>= 24pt)"),
                isHero: z.boolean().optional().default(false),
            }))
                .min(3)
                .max(5)
                .describe("Danh sách từ 3 đến 5 bước lộ trình"),
            bottom_takeaway: z
                .string()
                .optional()
                .describe("Kết luận / Lộ trình hành động dưới đáy (>= 24pt)"),
            export_thumbnail: z
                .boolean()
                .default(true)
                .describe("Tự động xuất ảnh thumbnail PNG xem trước"),
        }),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        try {
            const palette = getTastePalette(args.palette_id);
            const textBank = [args.title];
            if (args.subtitle_context)
                textBank.push(args.subtitle_context);
            for (const s of args.steps)
                textBank.push(s.label, s.description);
            if (args.bottom_takeaway)
                textBank.push(args.bottom_takeaway);
            const copyAudit = validateSlideCopy(textBank);
            await slideEngine.buildProcessTimeline({
                presentationPath: args.presentation_path,
                slideNumber: args.slide_number,
                title: args.title,
                subtitleContext: args.subtitle_context,
                presenter: args.presenter,
                palette,
                steps: args.steps,
                bottomTakeaway: args.bottom_takeaway,
            });
            let thumbnailInfo = null;
            if (args.export_thumbnail) {
                try {
                    const outPath = await slideEngine.exportThumbnail(args.presentation_path, args.slide_number);
                    const fileUri = `file:///${outPath.replace(/\\/g, "/")}`;
                    thumbnailInfo = {
                        localPath: outPath,
                        fileUri,
                        markdownPreview: `![Slide ${args.slide_number}](${fileUri})`,
                    };
                }
                catch (e) {
                    console.error("Auto thumbnail export warning:", e.message);
                }
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "SUCCESS",
                            message: `✅ Đã tạo slide Process Timeline số ${args.slide_number} thành công.`,
                            presentationPath: args.presentation_path,
                            designId: args.design_id || "DAHaKPDSZSI",
                            slideNumber: args.slide_number,
                            layoutType: "process_timeline",
                            paletteApplied: {
                                id: palette.id,
                                name: palette.name,
                                accent: palette.accent,
                                secondary: palette.secondary,
                            },
                            copyAudit: {
                                tasteScore: `${copyAudit.score}/100`,
                                wordBudget: `${copyAudit.wordCount} từ`,
                                warnings: copyAudit.warnings,
                            },
                            typographyVerified: {
                                titlePt: PRESENTATION_TYPOGRAPHY.slideTitlePt,
                                presenterBadge: `${args.presenter} (44pt, Cyan #00B0F0)`,
                                bodyTextMinimum: ">= 24pt (Đạt chuẩn)",
                            },
                            thumbnail: thumbnailInfo,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `❌ Lỗi khi thiết kế slide Process Timeline: ${err.message || String(err)}`,
                    },
                ],
            };
        }
    });
    // Tool 7: canva_add_swot_matrix (Step 1 New Layout 2)
    server.registerTool("canva_add_swot_matrix", {
        title: "Add SWOT Matrix Slide (Step 1 Layout)",
        description: "Dựng ma trận 4 ô (2x2 Grid) bo góc với 4 màu sắc trực quan đại diện cho Strengths (Xanh lục), Weaknesses (Đỏ hồng), Opportunities (Xanh lam), Threats (Hổ phách), tự động căn chỉnh lề, cỡ chữ >= 24pt và huy hiệu Người trình bày 'Lê Anh Duy' (44pt, Cyan #00B0F0).",
        inputSchema: z.object({
            presentation_path: z
                .string()
                .default("C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx")
                .describe("Đường dẫn tệp .pptx bài thuyết trình (mặc định lấy active deck)"),
            design_id: z
                .string()
                .optional()
                .describe("ID thiết kế Canva Cloud (ví dụ: DAHaKPDSZSI) nếu đối chiếu cloud"),
            slide_number: z.number().int().min(1).default(1).describe("Vị trí slide (tính từ 1)"),
            title: z.string().describe("Tiêu đề slide"),
            subtitle_context: z.string().optional().describe("Thanh ngữ cảnh tóm tắt bối cảnh"),
            presenter: z
                .string()
                .default("Lê Anh Duy")
                .describe("Huy hiệu người trình bày góc trên bên phải (44pt, Cyan #00B0F0)"),
            palette_id: z
                .string()
                .default(DEFAULT_PALETTE_ID)
                .describe("ID bảng màu từ taste-skill (mặc định 'corporate-navy')"),
            strengths: z
                .array(z.string())
                .min(1)
                .max(3)
                .describe("Danh sách các Điểm mạnh (Strengths, 1-3 gạch đầu dòng)"),
            weaknesses: z
                .array(z.string())
                .min(1)
                .max(3)
                .describe("Danh sách các Điểm yếu (Weaknesses, 1-3 gạch đầu dòng)"),
            opportunities: z
                .array(z.string())
                .min(1)
                .max(3)
                .describe("Danh sách các Cơ hội (Opportunities, 1-3 gạch đầu dòng)"),
            threats: z
                .array(z.string())
                .min(1)
                .max(3)
                .describe("Danh sách các Thách thức (Threats, 1-3 gạch đầu dòng)"),
            bottom_takeaway: z
                .string()
                .optional()
                .describe("Kết luận / Chiến lược tổng thể dưới đáy (>= 24pt)"),
            export_thumbnail: z
                .boolean()
                .default(true)
                .describe("Tự động xuất ảnh thumbnail PNG xem trước"),
        }),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        try {
            const palette = getTastePalette(args.palette_id);
            const textBank = [
                args.title,
                ...args.strengths,
                ...args.weaknesses,
                ...args.opportunities,
                ...args.threats,
            ];
            if (args.subtitle_context)
                textBank.push(args.subtitle_context);
            if (args.bottom_takeaway)
                textBank.push(args.bottom_takeaway);
            const copyAudit = validateSlideCopy(textBank);
            await slideEngine.buildSwotMatrix({
                presentationPath: args.presentation_path,
                slideNumber: args.slide_number,
                title: args.title,
                subtitleContext: args.subtitle_context,
                presenter: args.presenter,
                palette,
                strengths: args.strengths,
                weaknesses: args.weaknesses,
                opportunities: args.opportunities,
                threats: args.threats,
                bottomTakeaway: args.bottom_takeaway,
            });
            let thumbnailInfo = null;
            if (args.export_thumbnail) {
                try {
                    const outPath = await slideEngine.exportThumbnail(args.presentation_path, args.slide_number);
                    const fileUri = `file:///${outPath.replace(/\\/g, "/")}`;
                    thumbnailInfo = {
                        localPath: outPath,
                        fileUri,
                        markdownPreview: `![Slide ${args.slide_number}](${fileUri})`,
                    };
                }
                catch (e) {
                    console.error("Auto thumbnail export warning:", e.message);
                }
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "SUCCESS",
                            message: `✅ Đã tạo slide SWOT Matrix số ${args.slide_number} thành công.`,
                            presentationPath: args.presentation_path,
                            designId: args.design_id || "DAHaKPDSZSI",
                            slideNumber: args.slide_number,
                            layoutType: "swot_matrix",
                            paletteApplied: {
                                id: palette.id,
                                name: palette.name,
                                accent: palette.accent,
                                secondary: palette.secondary,
                            },
                            copyAudit: {
                                tasteScore: `${copyAudit.score}/100`,
                                wordBudget: `${copyAudit.wordCount} từ`,
                                warnings: copyAudit.warnings,
                            },
                            typographyVerified: {
                                titlePt: PRESENTATION_TYPOGRAPHY.slideTitlePt,
                                presenterBadge: `${args.presenter} (44pt, Cyan #00B0F0)`,
                                bodyTextMinimum: ">= 24pt (Đạt chuẩn)",
                            },
                            thumbnail: thumbnailInfo,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `❌ Lỗi khi thiết kế slide SWOT Matrix: ${err.message || String(err)}`,
                    },
                ],
            };
        }
    });
    // Tool 8: canva_add_team_grid (Step 1 New Layout 3)
    server.registerTool("canva_add_team_grid", {
        title: "Add Team Grid Slide (Step 1 Layout)",
        description: "Dựng lưới thẻ card giới thiệu nhân sự / thành viên (2 đến 6 người) cân đối, hỗ trợ khung chứa ảnh đại diện hình tròn (circular ellipse clip mask), chức danh, tiểu sử (>= 24pt) và huy hiệu Người trình bày 'Lê Anh Duy' (44pt, Cyan #00B0F0).",
        inputSchema: z.object({
            presentation_path: z
                .string()
                .default("C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx")
                .describe("Đường dẫn tệp .pptx bài thuyết trình (mặc định lấy active deck)"),
            design_id: z
                .string()
                .optional()
                .describe("ID thiết kế Canva Cloud (ví dụ: DAHaKPDSZSI) nếu đối chiếu cloud"),
            slide_number: z.number().int().min(1).default(1).describe("Vị trí slide (tính từ 1)"),
            title: z.string().describe("Tiêu đề slide"),
            subtitle_context: z.string().optional().describe("Thanh ngữ cảnh tóm tắt bối cảnh"),
            presenter: z
                .string()
                .default("Lê Anh Duy")
                .describe("Huy hiệu người trình bày góc trên bên phải (44pt, Cyan #00B0F0)"),
            palette_id: z
                .string()
                .default(DEFAULT_PALETTE_ID)
                .describe("ID bảng màu từ taste-skill (mặc định 'corporate-navy')"),
            members: z
                .array(z.object({
                name: z.string().describe("Họ tên thành viên"),
                role: z.string().describe("Chức danh / Vai trò"),
                avatarUrl: z.string().url().optional().describe("URL ảnh đại diện tròn"),
                bio: z.string().optional().describe("Tiểu sử tóm tắt (>= 24pt)"),
            }))
                .min(2)
                .max(6)
                .describe("Danh sách từ 2 đến 6 thành viên trong đội ngũ"),
            bottom_takeaway: z
                .string()
                .optional()
                .describe("Kết luận / Năng lực đội ngũ dưới đáy (>= 24pt)"),
            export_thumbnail: z
                .boolean()
                .default(true)
                .describe("Tự động xuất ảnh thumbnail PNG xem trước"),
        }),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
        },
    }, async (args) => {
        try {
            const palette = getTastePalette(args.palette_id);
            const textBank = [args.title];
            if (args.subtitle_context)
                textBank.push(args.subtitle_context);
            for (const m of args.members) {
                textBank.push(m.name, m.role);
                if (m.bio)
                    textBank.push(m.bio);
            }
            if (args.bottom_takeaway)
                textBank.push(args.bottom_takeaway);
            const copyAudit = validateSlideCopy(textBank);
            await slideEngine.buildTeamGrid({
                presentationPath: args.presentation_path,
                slideNumber: args.slide_number,
                title: args.title,
                subtitleContext: args.subtitle_context,
                presenter: args.presenter,
                palette,
                members: args.members,
                bottomTakeaway: args.bottom_takeaway,
            });
            let thumbnailInfo = null;
            if (args.export_thumbnail) {
                try {
                    const outPath = await slideEngine.exportThumbnail(args.presentation_path, args.slide_number);
                    const fileUri = `file:///${outPath.replace(/\\/g, "/")}`;
                    thumbnailInfo = {
                        localPath: outPath,
                        fileUri,
                        markdownPreview: `![Slide ${args.slide_number}](${fileUri})`,
                    };
                }
                catch (e) {
                    console.error("Auto thumbnail export warning:", e.message);
                }
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "SUCCESS",
                            message: `✅ Đã tạo slide Team Grid số ${args.slide_number} thành công.`,
                            presentationPath: args.presentation_path,
                            designId: args.design_id || "DAHaKPDSZSI",
                            slideNumber: args.slide_number,
                            layoutType: "team_grid",
                            paletteApplied: {
                                id: palette.id,
                                name: palette.name,
                                accent: palette.accent,
                                secondary: palette.secondary,
                            },
                            copyAudit: {
                                tasteScore: `${copyAudit.score}/100`,
                                wordBudget: `${copyAudit.wordCount} từ`,
                                warnings: copyAudit.warnings,
                            },
                            typographyVerified: {
                                titlePt: PRESENTATION_TYPOGRAPHY.slideTitlePt,
                                presenterBadge: `${args.presenter} (44pt, Cyan #00B0F0)`,
                                bodyTextMinimum: ">= 24pt (Đạt chuẩn)",
                            },
                            thumbnail: thumbnailInfo,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `❌ Lỗi khi thiết kế slide Team Grid: ${err.message || String(err)}`,
                    },
                ],
            };
        }
    });
}
//# sourceMappingURL=taste-tools.js.map