import { zodToJsonSchema } from 'zod-to-json-schema';
import { ZodSchema } from 'zod';

/**
 * JSON Schema structure expected by MCP SDK for tool input schemas.
 * See @modelcontextprotocol/sdk types.d.ts - Tool inputSchema field.
 */
export interface MCPInputSchema {
  type: 'object';
  properties?: Record<string, unknown>;
  required?: string[];
  [key: string]: unknown; // Allow additional JSON Schema properties
}

/**
 * Convert a Zod schema to MCP-compatible JSON Schema.
 * 
 * Converts a Zod schema to valid JSON Schema suitable for MCP tool advertisement.
 * This fixes the bug where zod's internal _def.shape() was exposed directly,
 * causing array-typed parameters to be misinterpreted by some MCP clients.
 * 
 * @param schema - The Zod schema to convert
 * @returns MCP-compatible JSON Schema object (without $schema property)
 * @throws Error if conversion fails
 */
export function convertZodSchemaToMCP(schema: ZodSchema): MCPInputSchema {
  try {
    // Convert to JSON Schema v7, without complex $ref structures
    const jsonSchema = zodToJsonSchema(schema, {
      $refStrategy: 'none',
    });

    // Remove the $schema meta-property (not needed for MCP)
    const { $schema: _schema, ...inputSchema } = jsonSchema;

    // Validate the result has the expected structure
    if (typeof inputSchema !== 'object' || inputSchema === null) {
      throw new Error('zodToJsonSchema returned non-object');
    }

    if (!('type' in inputSchema) || inputSchema.type !== 'object') {
      throw new Error('zodToJsonSchema returned schema without type: "object"');
    }

    return inputSchema as MCPInputSchema;
  } catch (error) {
    // Re-throw with context
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to convert Zod schema to MCP JSON Schema: ${message}`);
  }
}
