import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
const execFileAsync = promisify(execFile);
export const DEFAULT_ARTIFACT_DIR = "C:\\Users\\mrduy\\.gemini\\antigravity\\brain\\0c273b01-9367-4f82-a2be-fc844b82be6d";
export async function exportSlidePng(presentationPath, slideNumber, customOutputPath) {
    const normPptx = path.resolve(presentationPath).replace(/\//g, "\\");
    const targetDir = customOutputPath ? path.dirname(customOutputPath) : DEFAULT_ARTIFACT_DIR;
    await fs.mkdir(targetDir, { recursive: true });
    const finalOutputPath = customOutputPath
        ? path.resolve(customOutputPath).replace(/\//g, "\\")
        : path.join(targetDir, `slide_${slideNumber}_preview.png`).replace(/\//g, "\\");
    const tempPs1 = path.join(os.tmpdir(), `export_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.ps1`);
    const psCode = `
$ppt = New-Object -ComObject PowerPoint.Application
try {
  $pres = $ppt.Presentations.Open('${normPptx.replace(/'/g, "''")}', [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
  $pres.Slides.Item(${slideNumber}).Export('${finalOutputPath.replace(/'/g, "''")}', 'PNG', 1920, 1080)
  $pres.Close()
  Write-Host "EXPORT_SUCCESS"
} finally {
  $ppt.Quit()
  [System.GC]::Collect()
  [System.GC]::WaitForPendingFinalizers()
}
`;
    await fs.writeFile(tempPs1, psCode, "utf8");
    try {
        const { stdout, stderr } = await execFileAsync("powershell", [
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            tempPs1,
        ]);
        if (!stdout.includes("EXPORT_SUCCESS") && stderr) {
            throw new Error(`Lỗi export PowerPoint: ${stderr}`);
        }
        return finalOutputPath;
    }
    finally {
        await fs.unlink(tempPs1).catch(() => { });
    }
}
//# sourceMappingURL=export-utils.js.map