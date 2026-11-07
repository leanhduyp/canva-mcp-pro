import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import path from "path";

async function main() {
  const serverPath = path.resolve("C:/Users/mrduy/.gemini/antigravity/scratch/canva-mcp-pro/dist/index.js");
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  const client = new Client(
    { name: "test-taste-client", version: "1.0.0" },
    { capabilities: {} }
  );

  console.log("Connecting to canva-mcp-pro server...");
  await client.connect(transport);
  console.log("Connected successfully!");

  // 1. List tools
  const toolsRes = await client.listTools();
  console.log(`Available Tools (${toolsRes.tools.length}):`);
  for (const t of toolsRes.tools) {
    console.log(` - ${t.name}: ${t.description.slice(0, 70)}...`);
  }

  // 2. Test canva_list_taste_palettes
  console.log("\nTesting canva_list_taste_palettes (filter='light-neutral', limit=3)...");
  const palettesRes = await client.callTool({
    name: "canva_list_taste_palettes",
    arguments: {
      tag_filter: "light-neutral",
      limit: 3,
    },
  });
  console.log("Result:", palettesRes.content[0].text);

  // 3. Test canva_validate_slide_copy
  console.log("\nTesting canva_validate_slide_copy (testing AI slop vs clean copy)...");
  const copyRes = await client.callTool({
    name: "canva_validate_slide_copy",
    arguments: {
      texts: [
        "Revolutionary game-changing AI architecture that will seamlessly delve into and unleash your productivity.",
        "Mô hình đạt độ chính xác 85.5% trên tập kiểm thử 10,000 mẫu sau khi tỉa cây."
      ],
    },
  });
  console.log("Copy Validation Result:", copyRes.content[0].text);

  await client.close();
  console.log("\nAll taste tests completed successfully!");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
