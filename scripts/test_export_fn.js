import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

async function testExport(pptxPath, slideNum, outPath) {
  const normPptx = path.resolve(pptxPath).replace(/\//g, "\\");
  const normOut = path.resolve(outPath).replace(/\//g, "\\");
  const tempPs1 = path.join(os.tmpdir(), `export_${Date.now()}.ps1`);
  const psCode = `
$ppt = New-Object -ComObject PowerPoint.Application
try {
  $pres = $ppt.Presentations.Open('${normPptx.replace(/'/g, "''")}', [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
  $pres.Slides.Item(${slideNum}).Export('${normOut.replace(/'/g, "''")}', 'PNG', 1920, 1080)
  $pres.Close()
  Write-Host "EXPORT_SUCCESS"
} finally {
  $ppt.Quit()
  [System.GC]::Collect()
  [System.GC]::WaitForPendingFinalizers()
}
`;
  await fs.writeFile(tempPs1, psCode, "utf8");
  const { stdout, stderr } = await execFileAsync("powershell", ["-ExecutionPolicy", "Bypass", "-File", tempPs1]);
  await fs.unlink(tempPs1).catch(() => {});
  console.log("Stdout:", stdout);
  if (stderr) console.error("Stderr:", stderr);
}

const pptx = "C:/Users/mrduy/Documents/AI/my_quest/thuyet_trinh/Bao_Cao_Chu_De11.pptx";
const out = "C:/Users/mrduy/.gemini/antigravity/brain/0c273b01-9367-4f82-a2be-fc844b82be6d/test_export_tool.png";

testExport(pptx, 14, out).then(() => console.log("Done")).catch(console.error);
