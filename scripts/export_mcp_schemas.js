import fs from 'fs/promises';
import path from 'path';
import * as z from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/server';
import { registerAllTools } from '../dist/tools/index.js';

async function exportSchemas() {
  const targetDir = 'C:\\Users\\mrduy\\.gemini\\antigravity\\mcp\\canva-mcp-pro';
  await fs.mkdir(targetDir, { recursive: true });

  const server = new McpServer({ name: 'canva-mcp-pro', version: '2.0.0' });
  registerAllTools(server);

  const tools = server._registeredTools || {};
  const toolNames = Object.keys(tools);
  console.log(`Bắt đầu xuất ${toolNames.length} schema công cụ sang ${targetDir}...`);

  for (const name of toolNames) {
    const tool = tools[name];
    const schemaObj = {
      name: name,
      description: tool.description || '',
      parameters: z.toJSONSchema(tool.inputSchema),
    };
    const filePath = path.join(targetDir, `${name}.json`);
    await fs.writeFile(filePath, JSON.stringify(schemaObj), 'utf-8');
    console.log(`✅ Đã xuất schema: ${name}.json`);
  }
  console.log('🎉 Hoàn tất xuất toàn bộ 20 tool schemas!');
}

exportSchemas().catch(console.error);
