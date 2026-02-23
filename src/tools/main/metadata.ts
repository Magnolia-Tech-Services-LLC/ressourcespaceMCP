import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createMainMetadataTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'field',
      description: `Manage resource field data - get, update, or copy field values.

Actions:
- get: Get specific field data for a resource (requires resource_id, field_id)
- update: Update a metadata field value (requires resource_id, field_id, value)
- copy: Copy field value from one resource to another (requires from_resource, to_resource, field_id)`,
      inputSchema: z.object({
        action: z.enum(['get', 'update', 'copy']).describe('Operation to perform'),
        resource_id: z.union([z.string(), z.number()]).optional().describe('Resource ID (required for get, update)'),
        field_id: z.union([z.string(), z.number()]).describe('Field ID'),
        value: z.string().optional().describe('New value (required for update)'),
        from_resource: z.union([z.string(), z.number()]).optional().describe('Source resource ID (required for copy)'),
        to_resource: z.union([z.string(), z.number()]).optional().describe('Target resource ID (required for copy)'),
      }),
      handler: async (args: {
        action: 'get' | 'update' | 'copy';
        resource_id?: string | number;
        field_id: string | number;
        value?: string;
        from_resource?: string | number;
        to_resource?: string | number;
      }) => {
        switch (args.action) {
          case 'get': {
            if (args.resource_id === undefined) throw new Error('resource_id required for get action');
            const data = await client.call('get_resource_field_data', args.resource_id, args.field_id);
            return { field_data: data };
          }

          case 'update': {
            if (args.resource_id === undefined || args.value === undefined) {
              throw new Error('resource_id and value required for update action');
            }
            await client.call('update_field', args.resource_id, args.field_id, args.value);
            return { success: true };
          }

          case 'copy': {
            if (args.from_resource === undefined || args.to_resource === undefined) {
              throw new Error('from_resource and to_resource required for copy action');
            }
            await client.call('copy_field', args.from_resource, args.to_resource, args.field_id);
            return { success: true };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'field_info',
      description: `Get field definitions, options, and values.

Actions:
- list: Get all fields for a resource type (optional resource_type)
- options: Get dropdown/checkbox options for a field (requires field_id)
- values: Get all distinct values used in a field (requires field_id)`,
      inputSchema: z.object({
        action: z.enum(['list', 'options', 'values']).describe('Operation to perform'),
        field_id: z.union([z.string(), z.number()]).optional().describe('Field ID (required for options, values)'),
        resource_type: z.number().optional().describe('Resource type ID (optional for list)'),
      }),
      handler: async (args: {
        action: 'list' | 'options' | 'values';
        field_id?: string | number;
        resource_type?: number;
      }) => {
        switch (args.action) {
          case 'list': {
            const params: (string | number)[] = args.resource_type !== undefined ? [args.resource_type] : [];
            const fields = await client.call('get_resource_type_fields', ...params);
            return { fields };
          }

          case 'options': {
            if (args.field_id === undefined) throw new Error('field_id required for options action');
            const options = await client.call('get_field_options', args.field_id);
            return { options };
          }

          case 'values': {
            if (args.field_id === undefined) throw new Error('field_id required for values action');
            const values = await client.call('get_field_values', args.field_id);
            return { values };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'node',
      description: `Manage field nodes (values/categories).

Actions:
- list: Get all nodes for a field (requires field_id, optional parent)
- create: Create or get a node for a field (requires field_id, name, optional parent)`,
      inputSchema: z.object({
        action: z.enum(['list', 'create']).describe('Operation to perform'),
        field_id: z.union([z.string(), z.number()]).describe('Field ID'),
        name: z.string().optional().describe('Node name/value (required for create)'),
        parent: z.number().optional().describe('Parent node ID (for hierarchical fields)'),
      }),
      handler: async (args: {
        action: 'list' | 'create';
        field_id: string | number;
        name?: string;
        parent?: number;
      }) => {
        switch (args.action) {
          case 'list': {
            const params: (string | number)[] = [args.field_id];
            if (args.parent !== undefined) params.push(args.parent);
            const nodes = await client.call('get_nodes', ...params);
            return { nodes };
          }

          case 'create': {
            if (!args.name) throw new Error('name required for create action');
            const params: (string | number)[] = [args.field_id, args.name];
            if (args.parent !== undefined) params.push(args.parent);
            const nodeId = await client.call('create_node', ...params);
            return { node_id: nodeId };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
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
          case 'get': {
            const params: (string | number)[] = [args.resource_id];
            if (args.field_id !== undefined) params.push(args.field_id);
            const nodes = await client.call('get_resource_nodes', ...params);
            return { nodes };
          }

          case 'add': {
            if (!args.nodes || args.nodes.length === 0) {
              throw new Error('nodes array required for add action');
            }
            await client.call('add_resource_nodes', args.resource_id, args.nodes.join(','));
            return { success: true };
          }

          case 'remove': {
            if (!args.nodes || args.nodes.length === 0) {
              throw new Error('nodes array required for remove action');
            }
            await client.call('delete_resource_nodes', args.resource_id, args.nodes.join(','));
            return { success: true };
          }

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
  ];
}
