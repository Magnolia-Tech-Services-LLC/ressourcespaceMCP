#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { ResourceSpaceClient } from './client/resourcespace.js';
import { createMainTools } from './tools/main/index.js';
import { createAllResources } from './resources/index.js';
import { createAllPrompts } from './prompts/index.js';
import { ResourceSpaceError } from './types/resourcespace.js';

class ResourceSpaceMCPServer {
  private server: Server;
  private client: ResourceSpaceClient;
  private tools: ReturnType<typeof createMainTools>;
  private resources: ReturnType<typeof createAllResources>;
  private prompts: ReturnType<typeof createAllPrompts>;

  constructor() {
    this.server = new Server(
      {
        name: 'resourcespace-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // Load configuration
    const config = loadConfig();
    this.client = new ResourceSpaceClient(config);

    // Initialize tools, resources, and prompts
    this.tools = createMainTools(this.client);
    this.resources = createAllResources(this.client);
    this.prompts = createAllPrompts();

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

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: this.resources.map((resource) => ({
          uri: resource.uri,
          name: resource.name,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      };
    });

    // Read a resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      // Find matching resource handler by URI pattern
      const resource = this.resources.find((r) => {
        const pattern = r.uri.replace(/\{[^}]+\}/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(uri) || r.uri === uri;
      });

      if (!resource) {
        throw new Error(`Resource not found: ${uri}`);
      }

      try {
        return await resource.handler(uri);
      } catch (error) {
        if (error instanceof ResourceSpaceError) {
          throw new Error(`ResourceSpace API error: ${error.message}`);
        }
        throw error;
      }
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.prompts.map((prompt) => ({
          name: prompt.name,
          description: prompt.description,
          arguments: prompt.arguments,
        })),
      };
    });

    // Get a prompt
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const prompt = this.prompts.find((p) => p.name === name);
      if (!prompt) {
        throw new Error(`Prompt not found: ${name}`);
      }

      try {
        const result = await prompt.handler(args || {});

        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: result,
              },
            },
          ],
        };
      } catch (error) {
        throw new Error(`Error executing prompt: ${error}`);
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
    
    console.error(`ResourceSpace Main MCP server running on stdio (${this.tools.length} tools)`);
  }
}

// Start the server
const server = new ResourceSpaceMCPServer();
server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

