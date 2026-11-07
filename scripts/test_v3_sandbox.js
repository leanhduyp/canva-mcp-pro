import { McpServer } from '@modelcontextprotocol/server';
import { registerAllTools } from '../dist/tools/index.js';

async function testSandbox() {
  console.log('Testing canva_execute_layout_script in McpServer...');
  const server = new McpServer({ name: 'test-sandbox', version: '3.0.0' });
  registerAllTools(server);

  const registered = server._registeredTools || {};
  const tool = registered['canva_execute_layout_script'];
  if (!tool) {
    throw new Error('canva_execute_layout_script tool not found in registered tools!');
  }

  // 1. Test Python execution in Sandbox
  console.log('\n--- Test 1: Python Sandbox Execution ---');
  const pyResult = await tool.handler({
    script_type: 'python',
    code: 'print("Hello from Python Sandbox! Math: 21 * 2 =", 21 * 2)',
    export_thumbnail: false
  });
  console.log(pyResult.content[0].text);

  // 2. Test JavaScript execution in Sandbox
  console.log('\n--- Test 2: JavaScript Sandbox Execution ---');
  const jsResult = await tool.handler({
    script_type: 'javascript',
    code: 'console.log("Hello from JS Sandbox! Date:", new Date().toISOString());',
    export_thumbnail: false
  });
  console.log(jsResult.content[0].text);

  console.log('\n🎉 Sandbox Tool execution test PASSED successfully!');
}

testSandbox().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
