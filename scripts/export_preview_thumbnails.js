import { SlideEngine } from '../dist/engine/slide-engine.js';
import path from 'path';

async function exportPreviews() {
  const pptPath = 'C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx';
  const artifactDir = 'C:/Users/mrduy/.gemini/antigravity/brain/0c273b01-9367-4f82-a2be-fc844b82be6d';
  const slideEngine = new SlideEngine();

  const slidesToExport = [1, 3, 5, 7];
  for (const s of slidesToExport) {
    const outName = `slide_${s}_preview_2026.png`;
    const outPath = path.join(artifactDir, outName);
    console.log(`Exporting Slide ${s} to ${outPath}...`);
    try {
      const res = await slideEngine.exportThumbnail(pptPath, s, outPath);
      console.log(`✅ Slide ${s} exported: ${res}`);
    } catch (err) {
      console.error(`Warning exporting slide ${s}:`, err.message);
    }
  }
}

exportPreviews().catch(console.error);
