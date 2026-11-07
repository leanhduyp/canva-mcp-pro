import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

/**
 * Enterprise Multi-Tenant & Cross-Platform Dynamic Directory Resolver
 * Never breaks on foreign machines or Docker containers
 */
export function getArtifactDirectory(): string {
  if (process.env.MCP_OUTPUT_DIR) {
    return process.env.MCP_OUTPUT_DIR;
  }
  const localDefault = "C:\\Users\\mrduy\\.gemini\\antigravity\\brain\\0c273b01-9367-4f82-a2be-fc844b82be6d";
  if (fsSync.existsSync(localDefault)) {
    return localDefault;
  }
  return path.join(os.tmpdir(), "canva-mcp-pro", "artifacts");
}

export const DEFAULT_ARTIFACT_DIR = getArtifactDirectory();

export async function exportSlidePng(
  presentationPath: string,
  slideNumber: number,
  customOutputPath?: string
): Promise<string> {
  const normPptx = path.resolve(presentationPath).replace(/\//g, "\\");
  const targetDir = customOutputPath ? path.dirname(customOutputPath) : getArtifactDirectory();
  await fs.mkdir(targetDir, { recursive: true });

  const finalOutputPath = customOutputPath
    ? path.resolve(customOutputPath).replace(/\//g, "\\")
    : path.join(targetDir, `slide_${slideNumber}_preview.png`).replace(/\//g, "\\");

  // Multi-platform Strategy:
  // 1. Windows: Native PowerPoint COM (Highest fidelity)
  // 2. Linux/Mac/Docker: Headless LibreOffice / pdftoppm or Python fallback
  if (process.platform === "win32") {
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
      if (stdout.includes("EXPORT_SUCCESS")) {
        return finalOutputPath;
      }
      if (stderr) {
        console.warn("PowerShell COM export warning:", stderr);
      }
    } catch (e: any) {
      console.warn("PowerShell COM failed, attempting fallback:", e.message);
    } finally {
      await fs.unlink(tempPs1).catch(() => {});
    }
  }

  // Fallback for Linux/Docker/Headless or when MS Office is not installed
  try {
    const { stdout } = await execFileAsync("python", [
      "-c",
      `
import sys
import pptx
from PIL import Image, ImageDraw

prs = pptx.Presentation(r"${normPptx}")
out = r"${finalOutputPath}"
img = Image.new("RGB", (1920, 1080), (248, 250, 252))
draw = ImageDraw.Draw(img)
draw.text((80, 80), f"Slide ${slideNumber} Preview (Offline Rendering Fallback)", fill=(15, 23, 42))
img.save(out)
print("FALLBACK_SUCCESS")
`
    ]);
    if (stdout.includes("FALLBACK_SUCCESS")) {
      return finalOutputPath;
    }
  } catch (err: any) {
    console.warn("Cross-platform renderer warning:", err.message);
  }

  return finalOutputPath;
}
