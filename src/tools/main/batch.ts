import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createMainBatchTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'batch_field_update',
      description: 'Update a metadata field for multiple resources at once',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        field_id: z.union([z.string(), z.number()]).describe('Field ID to update'),
        value: z.string().describe('New value to set'),
      }),
      handler: async (args: { resource_ids: (string | number)[]; field_id: string | number; value: string }) => {
        await client.call('batch_update_field', args.resource_ids.join(','), args.field_id, args.value);
        return { success: true, updated_count: args.resource_ids.length };
      },
    },
    {
      name: 'batch_collection_add',
      description: 'Add multiple resources to a collection',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
      }),
      handler: async (args: { resource_ids: (string | number)[]; collection_id: string | number }) => {
        await client.call('batch_add_to_collection', args.resource_ids.join(','), args.collection_id);
        return { success: true, added_count: args.resource_ids.length };
      },
    },
    {
      name: 'batch_collection_remove',
      description: 'Remove multiple resources from a collection',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
      }),
      handler: async (args: { resource_ids: (string | number)[]; collection_id: string | number }) => {
        await client.call('batch_remove_from_collection', args.resource_ids.join(','), args.collection_id);
        return { success: true, removed_count: args.resource_ids.length };
      },
    },
    {
      name: 'batch_delete',
      description: 'Delete multiple resources at once',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs to delete'),
      }),
      handler: async (args: { resource_ids: (string | number)[] }) => {
        await client.call('batch_delete_resources', args.resource_ids.join(','));
        return { success: true, deleted_count: args.resource_ids.length };
      },
    },
    {
      name: 'batch_archive_status',
      description: 'Update archive status for multiple resources',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        archive_status: z.number().describe('Archive status (0=active, 1=pending, 2=archived, -1=pending submission)'),
      }),
      handler: async (args: { resource_ids: (string | number)[]; archive_status: number }) => {
        await client.call('batch_update_archive_status', args.resource_ids.join(','), args.archive_status);
        return { success: true, updated_count: args.resource_ids.length };
      },
    },
    {
      name: 'batch_field_copy',
      description: 'Copy a field value from one resource to multiple others',
      inputSchema: z.object({
        from_resource: z.union([z.string(), z.number()]).describe('Source resource ID'),
        to_resources: z.array(z.union([z.string(), z.number()])).describe('Target resource IDs'),
        field_id: z.union([z.string(), z.number()]).describe('Field ID to copy'),
      }),
      handler: async (args: { from_resource: string | number; to_resources: (string | number)[]; field_id: string | number }) => {
        await client.call('batch_copy_field', args.from_resource, args.to_resources.join(','), args.field_id);
        return { success: true, copied_count: args.to_resources.length };
      },
    },
    {
      name: 'batch_nodes_add',
      description: 'Add nodes (keywords/categories) to multiple resources',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        nodes: z.array(z.number()).describe('Array of node IDs to add'),
      }),
      handler: async (args: { resource_ids: (string | number)[]; nodes: number[] }) => {
        await client.call('batch_add_nodes', args.resource_ids.join(','), args.nodes.join(','));
        return { success: true, updated_count: args.resource_ids.length };
      },
    },
    {
      name: 'batch_nodes_remove',
      description: 'Remove nodes from multiple resources',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        nodes: z.array(z.number()).describe('Array of node IDs to remove'),
      }),
      handler: async (args: { resource_ids: (string | number)[]; nodes: number[] }) => {
        await client.call('batch_delete_nodes', args.resource_ids.join(','), args.nodes.join(','));
        return { success: true, updated_count: args.resource_ids.length };
      },
    },
    {
      name: 'batch_download',
      description: 'Prepare multiple resources for batch download',
      inputSchema: z.object({
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        size: z.string().optional().describe('Size variant to download'),
      }),
      handler: async (args: { resource_ids: (string | number)[]; size?: string }) => {
        const params: (string | number)[] = [args.resource_ids.join(',')];
        if (args.size !== undefined) params.push(args.size);
        
        const downloadUrl = await client.call('batch_download_resources', ...params);
        return { download_url: downloadUrl };
      },
    },
  ];
}

