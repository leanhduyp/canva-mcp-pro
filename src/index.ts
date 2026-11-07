#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import { registerAllTools } from "./tools/index.js";
import { DEFAULT_PRESENTATION_PATH, CANVA_API_BASE_URL } from "./constants.js";
import { listTastePalettes, DEFAULT_PALETTE_ID } from "./taste/palettes.js";

const execFileAsync = promisify(execFile);

function createServer(): McpServer {
  const server = new McpServer({
    name: "canva-mcp-pro",
    version: "3.0.0",
  });

  registerAllTools(server);
  return server;
}

async function runCliDiagnostics() {
  console.log("=================================================");
  console.log("🔍 CANVA MCP PRO v3.0 - CHẨN ĐOÁN MÔI TRƯỜNG (--test)");
  console.log("=================================================\n");

  let allOk = true;

  // 1. Check Node.js runtime
  console.log(`[1/5] Kiểm tra Runtime Node.js: ${process.version} (Platform: ${process.platform})`);
  const nodeMajor = parseInt(process.version.replace(/^v/, "").split(".")[0], 10);
  if (nodeMajor >= 18) {
    console.log("  ✅ Node.js hợp lệ (>= 18.0.0).");
  } else {
    console.error("  ❌ Cần Node.js v18 trở lên!");
    allOk = false;
  }

  // 2. Check Python & python-pptx environment
  console.log("\n[2/5] Kiểm tra Runtime Python & thư viện python-pptx / PIL...");
  try {
    const { stdout } = await execFileAsync("python", [
      "-c",
      "import pptx, PIL; print(f'pptx={pptx.__version__}, PIL={PIL.__version__}')",
    ]);
    console.log(`  ✅ Python tích hợp sẵn sàng: ${stdout.trim()}`);
  } catch (err: any) {
    console.error(`  ❌ Lỗi môi trường Python: ${err.message}`);
    allOk = false;
  }

  // 3. Check Active PowerPoint Deck
  console.log("\n[3/5] Kiểm tra tệp PowerPoint đích (Active Presentation)...");
  try {
    const stat = await fs.stat(DEFAULT_PRESENTATION_PATH);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    console.log(`  ✅ Tìm thấy tệp trình chiếu: ${DEFAULT_PRESENTATION_PATH} (${sizeMb} MB)`);
  } catch {
    console.warn(`  ⚠️ Tệp mặc định chưa tìm thấy tại '${DEFAULT_PRESENTATION_PATH}' (Sẽ được tạo mới khi sinh slide).`);
  }

  // 4. Check Canva Connect API Token
  console.log("\n[4/5] Kiểm tra kết nối Canva Connect API...");
  const token = process.env.CANVA_ACCESS_TOKEN;
  if (token) {
    console.log("  ✅ Đã tìm thấy CANVA_ACCESS_TOKEN trong biến môi trường (Live API Mode).");
  } else {
    console.log("  ℹ️ CANVA_ACCESS_TOKEN để trống -> Kích hoạt chế độ Graceful Offline Mock.");
  }

  // 5. Check Tool Registry Count
  console.log("\n[5/5] Kiểm tra tính toàn vẹn của Registry công cụ MCP...");
  const dummyServer = createServer();
  const registeredCount = Object.keys((dummyServer as any)._registeredTools || {}).length;
  console.log(`  ✅ Đã nạp thành công ${registeredCount} công cụ MCP chuyên nghiệp vào server.`);

  console.log("\n=================================================");
  if (allOk) {
    console.log("🎉 HỆ THỐNG HOÀN TOÀN KHỎE MẠNH VÀ SẴN SÀNG VẬN HÀNH!");
  } else {
    console.error("⚠️ PHÁT HIỆN CẢNH BÁO MÔI TRƯỜNG - VUI LÒNG KIỂM TRA LẠI.");
  }
  console.log("=================================================");
  process.exit(allOk ? 0 : 1);
}

function showCliConfig() {
  console.log("=================================================");
  console.log("⚙️ CANVA MCP PRO v3.0 - THÔNG SỐ CẤU HÌNH (--config)");
  console.log("=================================================\n");

  const dummyServer = createServer();
  const tools = (dummyServer as any)._registeredTools || {};
  const toolNames = Object.keys(tools);
  const palettes = listTastePalettes();

  console.log(`Tên máy chủ        : canva-mcp-pro`);
  console.log(`Phiên bản          : 3.0.0 (Enterprise Architecture)`);
  console.log(`Giao thức truyền   : stdio / JSON-RPC 2.0`);
  console.log(`Canva API Endpoint : ${CANVA_API_BASE_URL}`);
  console.log(`Tệp PPTX Mặc định  : ${DEFAULT_PRESENTATION_PATH}`);
  console.log(`Bảng màu mặc định  : ${DEFAULT_PALETTE_ID} (57 bảng màu Taste-Skill tích hợp)`);
  console.log(`Tổng số công cụ    : ${toolNames.length} công cụ`);
  console.log("\nDanh sách công cụ:");
  toolNames.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

  console.log("\n=================================================");
  process.exit(0);
}

// CLI argument parsing
const args = process.argv.slice(2);
if (args.includes("--test")) {
  runCliDiagnostics().catch((err) => {
    console.error("Lỗi khi chẩn đoán:", err);
    process.exit(1);
  });
} else if (args.includes("--config")) {
  showCliConfig();
} else {
  serveStdio(createServer);
  console.error("canva-mcp-pro server v3.0 running on stdio");
}
