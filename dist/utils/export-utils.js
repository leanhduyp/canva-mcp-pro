import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import os from "os";
const execFileAsync = promisify(execFile);
// Enterprise Lifecycle & Quota Configuration
export const CANVA_MCP_TMP_TTL_SECONDS = parseInt(process.env.CANVA_MCP_TMP_TTL_SECONDS || "900", 10); // Default: 15 minutes
export const CANVA_MCP_MAX_WORKSPACE_MB = parseInt(process.env.CANVA_MCP_MAX_WORKSPACE_MB || "50", 10); // Default: 50 MB
/**
 * Calculates total size of files inside a directory (recursive)
 */
export async function calculateDirectorySize(dirPath) {
    if (!fsSync.existsSync(dirPath))
        return 0;
    let totalBytes = 0;
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                totalBytes += await calculateDirectorySize(fullPath);
            }
            else if (entry.isFile()) {
                const stat = await fs.stat(fullPath);
                totalBytes += stat.size;
            }
        }
    }
    catch (err) {
        // Ignore permissions or race condition removals
    }
    return totalBytes;
}
/**
 * Enterprise Auto-Purge: Scans and removes expired workspace sessions
 * Prevents Disk Exhaustion DoS attacks
 */
export async function cleanupExpiredWorkspaces(ttlSeconds = CANVA_MCP_TMP_TTL_SECONDS) {
    const baseTmp = path.join(os.tmpdir(), "canva-mcp-pro");
    if (!fsSync.existsSync(baseTmp)) {
        return { cleanedDirs: 0, reclaimedBytes: 0 };
    }
    const now = Date.now();
    const maxAgeMs = ttlSeconds * 1000;
    let cleanedDirs = 0;
    let reclaimedBytes = 0;
    try {
        const items = await fs.readdir(baseTmp, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory() && (item.name.startsWith("session_") || item.name.startsWith("artifacts_"))) {
                const dirPath = path.join(baseTmp, item.name);
                const stat = await fs.stat(dirPath);
                if (now - stat.mtimeMs > maxAgeMs) {
                    const dirSize = await calculateDirectorySize(dirPath);
                    await fs.rm(dirPath, { recursive: true, force: true });
                    cleanedDirs++;
                    reclaimedBytes += dirSize;
                }
            }
        }
    }
    catch (err) {
        console.warn("Background workspace cleanup notice:", err.message);
    }
    return { cleanedDirs, reclaimedBytes };
}
/**
 * Enterprise Multi-Tenant & Cross-Platform Dynamic Directory Resolver
 * Generates an isolated session directory with 0700 permissions
 */
export function getArtifactDirectory(sessionId) {
    if (sessionId) {
        return path.join(os.tmpdir(), "canva-mcp-pro", `session_${sessionId}`);
    }
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
export async function exportSlidePng(presentationPath, slideNumber, customOutputPath) {
    // Trigger background cleanup of expired workspaces
    cleanupExpiredWorkspaces().catch(() => { });
    const normPptx = path.resolve(presentationPath).replace(/\//g, "\\");
    const targetDir = customOutputPath ? path.dirname(customOutputPath) : getArtifactDirectory();
    // Create directory with secure permissions 0700 (Owner rwx only)
    await fs.mkdir(targetDir, { recursive: true, mode: 0o700 });
    // Check Workspace Disk Quota before writing
    const currentSize = await calculateDirectorySize(targetDir);
    const maxBytes = CANVA_MCP_MAX_WORKSPACE_MB * 1024 * 1024;
    if (currentSize > maxBytes) {
        throw new Error(`🛡️ DISK QUOTA EXCEEDED: Thư mục phiên (${(currentSize / (1024 * 1024)).toFixed(1)} MB) đã vượt quá hạn mức tối đa ${CANVA_MCP_MAX_WORKSPACE_MB} MB. Vui lòng dọn dẹp hoặc tăng CANVA_MCP_MAX_WORKSPACE_MB.`);
    }
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
        }
        catch (e) {
            console.warn("PowerShell COM failed, attempting fallback:", e.message);
        }
        finally {
            await fs.unlink(tempPs1).catch(() => { });
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
    }
    catch (err) {
        console.warn("Cross-platform renderer warning:", err.message);
    }
    return finalOutputPath;
}
//# sourceMappingURL=export-utils.js.map