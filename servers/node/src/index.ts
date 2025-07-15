import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerStabilityTools } from './tools.js';
import { DEFAULT_API_KEY } from './api.js';
import 'dotenv/config';

const apiKey = process.env.STABILITY_API_KEY || DEFAULT_API_KEY;

const server = new McpServer({
  name: 'stability-mcp-node',
  version: '0.1.0'
});

registerStabilityTools(server, apiKey);

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
