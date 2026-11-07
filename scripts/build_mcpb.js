import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

async function buildMcpbBundle() {
  console.log("=================================================");
  console.log("📦 BẮT ĐẦU ĐÓNG GÓI 1-CLICK CLAUDE EXTENSION (.mcpb)");
  console.log("=================================================\n");

  const projectRoot = path.resolve('.');
  const distDir = path.join(projectRoot, 'dist');
  const bundleOutputDir = path.join(projectRoot, 'release');
  await fs.mkdir(bundleOutputDir, { recursive: true });

  // 1. Create manifest.json for MCPB
  const manifest = {
    manifest_version: "1.0",
    name: "canva-mcp-pro",
    display_name: "Canva MCP Pro (Presentation Architect)",
    version: "3.1.0",
    description: "High-fidelity Canva & Academic Presentation MCP Server with Taste-Skill & Python-pptx Vector Engine",
    author: {
      name: "Lê Anh Duy",
      email: "mrduy@enterprise-ai.vn",
      affiliation: "Enterprise AI Architecture & Open-Source Team"
    },
    homepage: "https://github.com/leanhduyp/canva-mcp-pro",
    server: {
      type: "node",
      entry_point: "dist/index.js",
      mcp_version: "1.0.0",
      env: {
        CANVA_ACCESS_TOKEN: {
          description: "Canva Connect API Access Token (Tùy chọn khi cần đồng bộ trực tiếp Canva Cloud)",
          required: false
        }
      }
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: true
    },
    categories: ["productivity", "design", "presentation", "ai-research"],
    tools_count: 21
  };

  const manifestPath = path.join(projectRoot, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log("✅ Đã tạo tệp manifest.json định danh chuẩn MCPB.");

  // 2. Package into .mcpb using Python zipfile for 100% cross-platform reliability
  const outputMcpbPath = path.join(bundleOutputDir, 'canva-mcp-pro.mcpb');
  console.log(`Đang nén các thành phần vào gói: ${outputMcpbPath}...`);

  const pythonZipScript = `
import zipfile
import os

bundle_path = r"${outputMcpbPath.replace(/\\/g, '\\\\')}"
project_root = r"${projectRoot.replace(/\\/g, '\\\\')}"

with zipfile.ZipFile(bundle_path, 'w', zipfile.ZIP_DEFLATED) as z:
    # Add manifest.json
    z.write(os.path.join(project_root, 'manifest.json'), 'manifest.json')
    # Add package.json
    z.write(os.path.join(project_root, 'package.json'), 'package.json')
    # Add dist/
    dist_dir = os.path.join(project_root, 'dist')
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, project_root)
            z.write(full_path, rel_path)
    # Add skills/
    skills_dir = os.path.join(project_root, 'skills')
    if os.path.exists(skills_dir):
        for root, dirs, files in os.walk(skills_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, project_root)
                z.write(full_path, rel_path)

print(f"SUCCESS: {os.path.getsize(bundle_path)} bytes")
`;

  const { stdout } = await execFileAsync('python', ['-c', pythonZipScript]);
  console.log(`✅ Kết quả nén: ${stdout.trim()}`);

  const stat = await fs.stat(outputMcpbPath);
  console.log(`🎉 ĐÓNG GÓI THÀNH CÔNG GÓI EXTENSION 1-CLICK: ${(stat.size / 1024).toFixed(1)} KB`);
  console.log(`📁 Đường dẫn tệp: ${outputMcpbPath}`);
  console.log("=================================================\n");
}

buildMcpbBundle().catch((err) => {
  console.error("❌ Lỗi khi đóng gói .mcpb:", err);
  process.exit(1);
});
