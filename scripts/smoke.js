import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import path from "path";

async function main() {
  console.log("Starting smoke test for canva-mcp-pro...");

  const serverPath = path.resolve("./dist/index.js");
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  const client = new Client({ name: "smoke-tester", version: "1.0.0" });
  await client.connect(transport);
  console.log("Connected to canva-mcp-pro server successfully!");

  const tools = await client.listTools();
  console.log(`Available Tools (${tools.tools.length}):`);
  for (const t of tools.tools) {
    console.log(` - ${t.name}: ${t.description.slice(0, 70)}...`);
  }

  await client.close();
  console.log("Smoke test passed with flying colors!");
}

main().catch((err) => {
  console.error("Smoke test failed:", err);
  process.exit(1);
});
