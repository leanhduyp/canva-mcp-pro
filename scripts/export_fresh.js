import { exportSlidePng } from "../dist/utils/export-utils.js";
import path from "path";

async function run() {
  const pptx = path.resolve("./test_deck_advanced.pptx");
  const out = path.resolve("C:/Users/mrduy/.gemini/antigravity/brain/0c273b01-9367-4f82-a2be-fc844b82be6d/s16_fresh.png");
  const res = await exportSlidePng(pptx, 16, out);
  console.log("Exported to:", res);
}

run().catch(console.error);
