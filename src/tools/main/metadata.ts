import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createMainMetadataTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'field_data',
      description: 'Get specific field data for a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        field_id: z.union([z.string(), z.number()]).describe('Field ID to retrieve'),
      }),
      handler: async (args: { resource_id: string | number; field_id: string | number }) => {
        const data = await client.call('get_resource_field_data', args.resource_id, args.field_id);
        return { field_data: data };
      },
    },
    {
      name: 'field_update',
      description: 'Update a metadata field value for a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        field_id: z.union([z.string(), z.number()]).describe('Field ID to update'),
        value: z.string().describe('New value for the field'),
      }),
      handler: async (args: { resource_id: string | number; field_id: string | number; value: string }) => {
        await client.call('update_field', args.resource_id, args.field_id, args.value);
        return { success: true };
      },
    },
    {
      name: 'field_copy',
      description: 'Copy field value from one resource to another',
      inputSchema: z.object({
        from_resource: z.union([z.string(), z.number()]).describe('Source resource ID'),
        to_resource: z.union([z.string(), z.number()]).describe('Target resource ID'),
        field_id: z.union([z.string(), z.number()]).describe('Field ID to copy'),
      }),
      handler: async (args: { from_resource: string | number; to_resource: string | number; field_id: string | number }) => {
        await client.call('copy_field', args.from_resource, args.to_resource, args.field_id);
        return { success: true };
      },
    },
    {
      name: 'fields',
      description: 'Get all fields for a resource type',
      inputSchema: z.object({
        resource_type: z.number().optional().describe('Resource type ID (omit for all types)'),
      }),
      handler: async (args: { resource_type?: number }) => {
        const params: (string | number)[] = args.resource_type !== undefined ? [args.resource_type] : [];
        const fields = await client.call('get_resource_type_fields', ...params);
        return { fields };
      },
    },
    {
      name: 'field_options',
      description: 'Get dropdown/checkbox options for a field',
      inputSchema: z.object({
        field_id: z.union([z.string(), z.number()]).describe('Field ID'),
      }),
      handler: async (args: { field_id: string | number }) => {
        const options = await client.call('get_field_options', args.field_id);
        return { options };
      },
    },
    {
      name: 'nodes',
      description: 'Get all nodes (values) for a specific field',
      inputSchema: z.object({
        field_id: z.union([z.string(), z.number()]).describe('Field ID'),
        parent: z.number().optional().describe('Parent node ID (for hierarchical fields)'),
      }),
      handler: async (args: { field_id: string | number; parent?: number }) => {
        const params: (string | number)[] = [args.field_id];
        if (args.parent !== undefined) params.push(args.parent);
        
        const nodes = await client.call('get_nodes', ...params);
        return { nodes };
      },
    },
    // Consolidated resource nodes operations
    {
      name: 'resource_nodes',
      description: `Manage nodes on resources - add, remove, or get operations.

Actions:
- get: Get all nodes assigned to resource
- add: Add nodes to resource (requires nodes array)
- remove: Remove nodes from resource (requires nodes array)`,
      inputSchema: z.object({
        action: z.enum(['get', 'add', 'remove']).describe('Operation to perform'),
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        nodes: z.array(z.number()).optional().describe('Array of node IDs (required for add, remove)'),
        field_id: z.union([z.string(), z.number()]).optional().describe('Filter by field ID (optional for get)'),
      }),
      handler: async (args: {
        action: 'get' | 'add' | 'remove';
        resource_id: string | number;
        nodes?: number[];
        field_id?: string | number;
      }) => {
        switch (args.action) {
          case 'get':
            const params: (string | number)[] = [args.resource_id];
            if (args.field_id !== undefined) params.push(args.field_id);
            const nodes = await client.call('get_resource_nodes', ...params);
            return { nodes };
          
          case 'add':
            if (!args.nodes || args.nodes.length === 0) {
              throw new Error('nodes array required for add action');
            }
            await client.call('add_resource_nodes', args.resource_id, args.nodes.join(','));
            return { success: true };
          
          case 'remove':
            if (!args.nodes || args.nodes.length === 0) {
              throw new Error('nodes array required for remove action');
            }
            await client.call('delete_resource_nodes', args.resource_id, args.nodes.join(','));
            return { success: true };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'metadata_copy',
      description: 'Copy all metadata from one resource to another',
      inputSchema: z.object({
        from_resource: z.union([z.string(), z.number()]).describe('Source resource ID'),
        to_resource: z.union([z.string(), z.number()]).describe('Target resource ID'),
      }),
      handler: async (args: { from_resource: string | number; to_resource: string | number }) => {
        await client.call('copy_resource_metadata', args.from_resource, args.to_resource);
        return { success: true };
      },
    },
    {
      name: 'exif_data',
      description: 'Get EXIF/technical metadata from a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { resource_id: string | number }) => {
        const exif = await client.call('get_exif_data', args.resource_id);
        return { exif };
      },
    },
    {
      name: 'resource_type_update',
      description: 'Change the resource type of a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        resource_type: z.number().describe('New resource type ID'),
      }),
      handler: async (args: { resource_id: string | number; resource_type: number }) => {
        await client.call('update_resource_type', args.resource_id, args.resource_type);
        return { success: true };
      },
    },
    {
      name: 'field_values',
      description: 'Get all distinct values used in a field',
      inputSchema: z.object({
        field_id: z.union([z.string(), z.number()]).describe('Field ID'),
      }),
      handler: async (args: { field_id: string | number }) => {
        const values = await client.call('get_field_values', args.field_id);
        return { values };
      },
    },
    {
      name: 'set_node',
      description: 'Create or get a node for a field',
      inputSchema: z.object({
        field_id: z.union([z.string(), z.number()]).describe('Field ID'),
        name: z.string().describe('Node name/value'),
        parent: z.number().optional().describe('Parent node ID (for hierarchical)'),
      }),
      handler: async (args: { field_id: string | number; name: string; parent?: number }) => {
        const params: (string | number)[] = [args.field_id, args.name];
        if (args.parent !== undefined) params.push(args.parent);
        
        const nodeId = await client.call('create_node', ...params);
        return { node_id: nodeId };
      },
    },
  ];
}

