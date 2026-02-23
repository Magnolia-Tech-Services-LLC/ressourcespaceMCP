import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createMainBatchTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'batch',
      description: `Perform batch operations on multiple resources.

Actions:
- field_update: Update a metadata field for multiple resources (requires resource_ids, field_id, value)
- collection_add: Add multiple resources to a collection (requires resource_ids, collection_id)
- collection_remove: Remove multiple resources from a collection (requires resource_ids, collection_id)
- delete: Delete multiple resources (requires resource_ids)
- archive_status: Update archive status for multiple resources (requires resource_ids, archive_status)
- field_copy: Copy a field value from one resource to multiple others (requires from_resource, to_resources, field_id)
- nodes_add: Add nodes to multiple resources (requires resource_ids, nodes)
- nodes_remove: Remove nodes from multiple resources (requires resource_ids, nodes)
- download: Prepare multiple resources for batch download (requires resource_ids, optional size)`,
      inputSchema: z.object({
        action: z.enum([
          'field_update', 'collection_add', 'collection_remove', 'delete',
          'archive_status', 'field_copy', 'nodes_add', 'nodes_remove', 'download',
        ]).describe('Batch operation to perform'),
        resource_ids: z.array(z.union([z.string(), z.number()])).optional()
          .describe('Array of resource IDs (required for all actions except field_copy)'),
        field_id: z.union([z.string(), z.number()]).optional()
          .describe('Field ID (required for field_update, field_copy)'),
        value: z.string().optional().describe('New value (required for field_update)'),
        collection_id: z.union([z.string(), z.number()]).optional()
          .describe('Collection ID (required for collection_add, collection_remove)'),
        archive_status: z.number().optional()
          .describe('Archive status (required for archive_status: 0=active, 1=pending, 2=archived, -1=pending submission)'),
        from_resource: z.union([z.string(), z.number()]).optional()
          .describe('Source resource ID (required for field_copy)'),
        to_resources: z.array(z.union([z.string(), z.number()])).optional()
          .describe('Target resource IDs (required for field_copy)'),
        nodes: z.array(z.number()).optional().describe('Array of node IDs (required for nodes_add, nodes_remove)'),
        size: z.string().optional().describe('Size variant for download'),
      }),
      handler: async (args: {
        action: 'field_update' | 'collection_add' | 'collection_remove' | 'delete' |
                'archive_status' | 'field_copy' | 'nodes_add' | 'nodes_remove' | 'download';
        resource_ids?: (string | number)[];
        field_id?: string | number;
        value?: string;
        collection_id?: string | number;
        archive_status?: number;
        from_resource?: string | number;
        to_resources?: (string | number)[];
        nodes?: number[];
        size?: string;
      }) => {
        switch (args.action) {
          case 'field_update': {
            if (!args.resource_ids || args.field_id === undefined || args.value === undefined) {
              throw new Error('resource_ids, field_id, and value required for field_update');
            }
            await client.call('batch_update_field', args.resource_ids.join(','), args.field_id, args.value);
            return { success: true, updated_count: args.resource_ids.length };
          }

          case 'collection_add': {
            if (!args.resource_ids || args.collection_id === undefined) {
              throw new Error('resource_ids and collection_id required for collection_add');
            }
            await client.call('batch_add_to_collection', args.resource_ids.join(','), args.collection_id);
            return { success: true, added_count: args.resource_ids.length };
          }

          case 'collection_remove': {
            if (!args.resource_ids || args.collection_id === undefined) {
              throw new Error('resource_ids and collection_id required for collection_remove');
            }
            await client.call('batch_remove_from_collection', args.resource_ids.join(','), args.collection_id);
            return { success: true, removed_count: args.resource_ids.length };
          }

          case 'delete': {
            if (!args.resource_ids) throw new Error('resource_ids required for delete');
            await client.call('batch_delete_resources', args.resource_ids.join(','));
            return { success: true, deleted_count: args.resource_ids.length };
          }

          case 'archive_status': {
            if (!args.resource_ids || args.archive_status === undefined) {
              throw new Error('resource_ids and archive_status required for archive_status');
            }
            await client.call('batch_update_archive_status', args.resource_ids.join(','), args.archive_status);
            return { success: true, updated_count: args.resource_ids.length };
          }

          case 'field_copy': {
            if (args.from_resource === undefined || !args.to_resources || args.field_id === undefined) {
              throw new Error('from_resource, to_resources, and field_id required for field_copy');
            }
            await client.call('batch_copy_field', args.from_resource, args.to_resources.join(','), args.field_id);
            return { success: true, copied_count: args.to_resources.length };
          }

          case 'nodes_add': {
            if (!args.resource_ids || !args.nodes) {
              throw new Error('resource_ids and nodes required for nodes_add');
            }
            await client.call('batch_add_nodes', args.resource_ids.join(','), args.nodes.join(','));
            return { success: true, updated_count: args.resource_ids.length };
          }

          case 'nodes_remove': {
            if (!args.resource_ids || !args.nodes) {
              throw new Error('resource_ids and nodes required for nodes_remove');
            }
            await client.call('batch_delete_nodes', args.resource_ids.join(','), args.nodes.join(','));
            return { success: true, updated_count: args.resource_ids.length };
          }

          case 'download': {
            if (!args.resource_ids) throw new Error('resource_ids required for download');
            const params: (string | number)[] = [args.resource_ids.join(',')];
            if (args.size !== undefined) params.push(args.size);
            const downloadUrl = await client.call('batch_download_resources', ...params);
            return { download_url: downloadUrl };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
  ];
}
