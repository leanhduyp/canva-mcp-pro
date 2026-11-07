import { exportSlidePng } from '../dist/utils/export-utils.js';
import path from 'path';

async function exportNewPreviews() {
  const pptPath = 'C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Ke_Hoach_AI_Agent_Enterprise_2026.pptx';
  const artifactDir = 'C:/Users/mrduy/.gemini/antigravity/brain/0c273b01-9367-4f82-a2be-fc844b82be6d';

  const slides = [1, 2, 3, 4, 6, 7];
  for (const s of slides) {
    const outName = `new_deck_slide_${s}.png`;
    const outPath = path.join(artifactDir, outName);
    console.log(`Exporting Slide ${s} to ${outPath}...`);
    try {
      const res = await exportSlidePng(pptPath, s, outPath);
      console.log(`✅ Slide ${s} exported: ${res}`);
    } catch (err) {
      console.error(`Error exporting slide ${s}:`, err.message);
    }
  }
}

exportNewPreviews().catch(console.error);
