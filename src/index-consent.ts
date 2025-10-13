#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { ResourceSpaceClient } from './client/resourcespace.js';
import { createConsentTools_All } from './tools/consent/index.js';
import { ResourceSpaceError } from './types/resourcespace.js';

class ResourceSpaceConsentMCPServer {
  private server: Server;
  private client: ResourceSpaceClient;
  private tools: ReturnType<typeof createConsentTools_All>;

  constructor() {
    this.server = new Server(
      {
        name: 'resourcespace-consent-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Load configuration
    const config = loadConfig();
    this.client = new ResourceSpaceClient(config);

    // Initialize Consent Manager tools
    this.tools = createConsentTools_All(this.client);

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: {
            type: 'object',
            properties: tool.inputSchema._def.shape(),
            required: Object.keys(tool.inputSchema._def.shape()).filter(
              (key) => !tool.inputSchema._def.shape()[key].isOptional()
            ),
          },
        })),
      };
    });

    // Call a tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.find((t) => t.name === name);
      if (!tool) {
        throw new Error(`Tool not found: ${name}`);
      }

      try {
        // Validate input
        const validatedArgs = tool.inputSchema.parse(args);
        
        // Execute tool
        const result = await tool.handler(validatedArgs);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        if (error instanceof ResourceSpaceError) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    error: error.message,
                    code: error.code,
                    details: error.details,
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    // Test connection
    const connected = await this.client.testConnection();
    if (!connected) {
      console.error('Failed to connect to ResourceSpace API. Please check your configuration.');
      process.exit(1);
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error(`ResourceSpace Consent Manager MCP server running on stdio (${this.tools.length} tools)`);
  }
}

// Start the server
const server = new ResourceSpaceConsentMCPServer();
server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

