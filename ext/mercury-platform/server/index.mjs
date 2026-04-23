import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const API_KEY = process.env.MERCURY_API_KEY;

if (!API_KEY) {
  process.stderr.write('MERCURY_API_KEY environment variable is required\n');
  process.exit(1);
}

const ENDPOINTS = [
  'https://mcp.mercuryintelligence.net/markets/mcp',
  'https://mcp.mercuryintelligence.net/feeder/mcp',
  'https://mcp.mercuryintelligence.net/econ/mcp',
  'https://mcp.mercuryintelligence.net/pubfinance/mcp',
];

async function createClient(url) {
  const client = new Client({ name: 'mercury-platform', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(url), {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      headers.set('X-API-Key', API_KEY);
      return fetch(input, { ...init, headers });
    }
  });
  await client.connect(transport);
  return client;
}

async function main() {
  const clients = await Promise.all(ENDPOINTS.map(createClient));

  const toolLists = await Promise.all(clients.map(c => c.listTools()));
  const toolToClient = new Map();
  const allTools = [];

  for (let i = 0; i < clients.length; i++) {
    for (const tool of toolLists[i].tools) {
      toolToClient.set(tool.name, clients[i]);
      allTools.push(tool);
    }
  }

  const server = new Server(
    { name: 'mercury-platform', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: allTools }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const client = toolToClient.get(req.params.name);
    if (!client) throw new Error(`Unknown tool: ${req.params.name}`);
    return await client.callTool(req.params);
  });

  await server.connect(new StdioServerTransport());
}

main().catch(err => {
  process.stderr.write(err.stack + '\n');
  process.exit(1);
});
