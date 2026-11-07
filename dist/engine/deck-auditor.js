import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { SLOP_BUZZWORDS } from "../taste/taste-rules.js";
const execFileAsync = promisify(execFile);
export async function auditEntireDeck(presentationPath) {
    const normPath = path.resolve(presentationPath).replace(/\\/g, "/");
    const tempScript = path.join(os.tmpdir(), `audit_${Date.now()}.py`);
    const pythonCode = `
import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
import pptx
from pptx.util import Pt

ppt_path = "${normPath}"
prs = pptx.Presentation(ppt_path)

slop_words = ${JSON.stringify(SLOP_BUZZWORDS)}

results = []

for idx, slide in enumerate(prs.slides):
    slide_num = idx + 1
    slide_text_bank = []
    small_fonts = []
    min_font = 999
    presenter_found = None
    has_presenter = False
    title_text = f"Slide {slide_num}"

    for sh in slide.shapes:
        if sh.has_text_frame:
            tf = sh.text_frame
            full_sh_text = tf.text.strip()
            if not full_sh_text:
                continue

            slide_text_bank.append(full_sh_text)

            # Check title
            if sh.name == "TextBox 6" or any(h in full_sh_text for h in ["4.2.", "CHỦ ĐỀ", "BÁO CÁO"]):
                lines = [l.strip() for l in full_sh_text.splitlines() if l.strip()]
                if lines:
                    title_text = lines[0]

            # Check presenter badge
            if any(p in full_sh_text for p in ["Lê Anh Duy", "Nguyễn Minh Hoàng", "Trần", "Phạm"]):
                presenter_found = full_sh_text
                if "Lê Anh Duy" in full_sh_text:
                    has_presenter = True

            # Font inspection across paragraphs and runs
            for p in tf.paragraphs:
                p_text = p.text.strip()
                if not p_text:
                    continue
                for r in p.runs:
                    r_text = r.text.strip()
                    if not r_text:
                        continue
                    if r.font and r.font.size:
                        pt = round(r.font.size.pt, 1)
                        if pt < min_font:
                            min_font = pt
                        # Ignore footnote/page number boxes in bottom corners
                        is_footnote = sh.top and (sh.top.inches > 7.0 and sh.left.inches > 16.0)
                        
                        # Enterprise Context-Aware Font Floor:
                        # Standard slide: >= 24pt
                        # Table / Multi-column Specs: >= 14pt
                        is_table_context = sh.has_table if hasattr(sh, "has_table") else False
                        is_dense_container = sh.name and any(d in sh.name.lower() for d in ["table", "spec", "grid", "matrix", "quadrant"])
                        floor_threshold = 13.5 if (is_table_context or is_dense_container) else 23.5

                        if pt < floor_threshold and not is_footnote:
                            small_fonts.append({
                                "shapeName": sh.name or "TextBox",
                                "fontSizePt": pt,
                                "isDenseContext": (is_table_context or is_dense_container),
                                "textSample": (r_text[:60] + "...") if len(r_text) > 60 else r_text
                            })

    combined_text = " ".join(slide_text_bank)
    lower = combined_text.lower()
    words = combined_text.split()
    word_count = len(words)

    # Slop check
    detected_slop = [w for w in slop_words if w in lower]

    # Hard fact check
    import re
    has_hard_fact = bool(re.search(r'\\b(\\d+(\\.\\d+)?%?|\\$\\d+|\\d+\\s*(ms|s|mb|gb|kb|x|lá))\\b', combined_text, re.IGNORECASE))

    # Score calculation
    score = 100
    issues = []
    recs = []

    if small_fonts:
        # Group duplicates
        unique_violations = len(set(v["fontSizePt"] for v in small_fonts))
        deduction = min(35, unique_violations * 10)
        score -= deduction
        issues.append(f"Cỡ chữ nhỏ vi phạm chuẩn >= 24pt (nhỏ nhất {min_font}pt, {len(small_fonts)} vị trí).")
        recs.append("Nâng cỡ chữ body lên tối thiểu 24pt để người ngồi cuối hội trường đọc rõ.")

    if not has_presenter:
        score -= 20
        issues.append("Chưa có huy hiệu người trình bày 'Lê Anh Duy' (Cyan #00B0F0, 44pt).")
        recs.append("Thêm huy hiệu Presenter Badge 'Lê Anh Duy' góc trên bên phải.")

    if detected_slop:
        score -= min(25, len(detected_slop) * 10)
        issues.append(f"Dính từ ngữ sáo rỗng AI: {', '.join(detected_slop)}.")
        recs.append("Thay từ sáo rỗng bằng danh từ trực tiếp và dữ liệu kiểm chứng.")

    if not has_hard_fact and word_count > 15:
        score -= 15
        issues.append("Thiếu số liệu hoặc bằng chứng thực nghiệm cụ thể (Hard Facts).")
        recs.append("Bổ sung tỷ lệ %, số mẫu dữ liệu hoặc đơn vị đo lường.")

    if word_count > 110:
        score -= 10
        issues.append(f"Mật độ từ cao ({word_count} từ > 90 từ chuẩn).")
        recs.append("Rút gọn câu văn, phân tách thành thẻ hoặc gạch đầu dòng.")

    score = max(0, min(100, score))
    status = "EXCELLENT" if score >= 85 else ("PASSED" if score >= 70 else "NEEDS_IMPROVEMENT")

    results.append({
        "slideNumber": slide_num,
        "title": title_text[:70],
        "hasPresenterBadge": has_presenter,
        "presenterFound": presenter_found,
        "minFontSizePt": min_font if min_font != 999 else 24.0,
        "smallFontViolations": small_fonts[:4], # top 4 violations
        "slopDetected": detected_slop,
        "hasHardFact": has_hard_fact,
        "wordCount": word_count,
        "score": score,
        "status": status,
        "issues": issues,
        "recommendations": recs
    })

print(json.dumps(results, ensure_ascii=False))
`;
    await fs.writeFile(tempScript, pythonCode, "utf8");
    try {
        const { stdout } = await execFileAsync("python", [tempScript]);
        const slides = JSON.parse(stdout);
        const total = slides.length;
        const avgScore = Math.round(slides.reduce((acc, s) => acc + s.score, 0) / (total || 1));
        const smallFontSlides = slides.filter((s) => s.smallFontViolations.length > 0).map((s) => s.slideNumber);
        const slopSlides = slides.filter((s) => s.slopDetected.length > 0).map((s) => s.slideNumber);
        const missingPresenterSlides = slides.filter((s) => !s.hasPresenterBadge).map((s) => s.slideNumber);
        const lackingFactSlides = slides.filter((s) => !s.hasHardFact).map((s) => s.slideNumber);
        const compliant = slides.filter((s) => s.score >= 80).length;
        const summary = [
            `Tổng số slide được quét: ${total} slide.`,
            `Điểm chất lượng trình chiếu toàn bộ bài (Deck Taste Score): ${avgScore}/100.`,
            `Số slide đạt chuẩn cao cấp: ${compliant}/${total} slide.`,
        ];
        const actions = [];
        if (smallFontSlides.length > 0) {
            actions.push(`Ưu tiên 1: Nâng cỡ chữ các slide [${smallFontSlides.join(", ")}] lên >= 24pt.`);
        }
        if (missingPresenterSlides.length > 0) {
            actions.push(`Ưu tiên 2: Bổ sung huy hiệu 'Lê Anh Duy' cho các slide [${missingPresenterSlides.join(", ")}].`);
        }
        if (slopSlides.length > 0) {
            actions.push(`Ưu tiên 3: Loại bỏ từ sáo rỗng AI trên các slide [${slopSlides.join(", ")}].`);
        }
        return {
            presentationPath,
            totalSlides: total,
            deckScore: avgScore,
            overallStatus: avgScore >= 85 ? "EXCELLENT" : avgScore >= 70 ? "PASSED" : "NEEDS_IMPROVEMENT",
            statistics: {
                compliantSlides: compliant,
                slidesWithSmallFont: smallFontSlides,
                slidesWithSlop: slopSlides,
                slidesMissingPresenter: missingPresenterSlides,
                slidesLackingHardFacts: lackingFactSlides,
            },
            slides,
            executiveSummary: summary,
            prioritizedActionPlan: actions,
        };
    }
    finally {
        await fs.unlink(tempScript).catch(() => { });
    }
}
//# sourceMappingURL=deck-auditor.js.map