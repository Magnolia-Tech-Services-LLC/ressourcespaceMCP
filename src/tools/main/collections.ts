import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createMainCollectionTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    // Consolidated CRUD for collections
    {
      name: 'collection',
      description: `Manage collections - perform get, create, update, delete, or copy operations.

Actions:
- get: Get collection details (requires collection_id)
- create: Create new collection (requires name, optional public, allow_changes)
- update: Update collection (requires collection_id, optional name, public, allow_changes)
- delete: Delete collection (requires collection_id)
- copy: Copy collection (requires collection_id)`,
      inputSchema: z.object({
        action: z.enum(['get', 'create', 'update', 'delete', 'copy']).describe('Operation to perform'),
        collection_id: z.union([z.string(), z.number()]).optional().describe('Collection ID (required for get, update, delete, copy)'),
        name: z.string().optional().describe('Collection name (required for create, optional for update)'),
        public: z.boolean().optional().describe('Make collection public'),
        allow_changes: z.boolean().optional().describe('Allow others to modify'),
      }),
      handler: async (args: {
        action: 'get' | 'create' | 'update' | 'delete' | 'copy';
        collection_id?: string | number;
        name?: string;
        public?: boolean;
        allow_changes?: boolean;
      }) => {
        switch (args.action) {
          case 'get':
            if (!args.collection_id) throw new Error('collection_id required for get action');
            const collection = await client.call('get_collection', args.collection_id);
            return { collection };
          
          case 'create':
            if (!args.name) throw new Error('name required for create action');
            const createParams: (string | number | boolean)[] = [args.name];
            if (args.public !== undefined) createParams.push(args.public ? 1 : 0);
            if (args.allow_changes !== undefined) createParams.push(args.allow_changes ? 1 : 0);
            const collectionId = await client.call('create_collection', ...createParams);
            return { collection_id: collectionId };
          
          case 'update':
            if (!args.collection_id) throw new Error('collection_id required for update action');
            const updateParams: (string | number | boolean)[] = [args.collection_id];
            if (args.name !== undefined) updateParams.push(args.name);
            if (args.public !== undefined) updateParams.push(args.public ? 1 : 0);
            if (args.allow_changes !== undefined) updateParams.push(args.allow_changes ? 1 : 0);
            await client.call('update_collection', ...updateParams);
            return { success: true };
          
          case 'delete':
            if (!args.collection_id) throw new Error('collection_id required for delete action');
            await client.call('delete_collection', args.collection_id);
            return { success: true };
          
          case 'copy':
            if (!args.collection_id) throw new Error('collection_id required for copy action');
            const newId = await client.call('copy_collection', args.collection_id);
            return { new_collection_id: newId };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'collection_resources',
      description: 'Get all resources in a collection',
      inputSchema: z.object({
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
      }),
      handler: async (args: { collection_id: string | number }) => {
        const resources = await client.call('get_collection_resources', args.collection_id);
        return { resources };
      },
    },
    {
      name: 'collections',
      description: 'Get all collections for the current user',
      inputSchema: z.object({
        user_id: z.union([z.string(), z.number()]).optional().describe('Get collections for specific user (admin only)'),
      }),
      handler: async (args: { user_id?: string | number }) => {
        const params: (string | number)[] = args.user_id !== undefined ? [args.user_id] : [];
        const collections = await client.call('get_collections', ...params);
        return { collections };
      },
    },
    {
      name: 'public_collections',
      description: 'Get all public collections',
      inputSchema: z.object({}),
      handler: async () => {
        const collections = await client.call('get_public_collections');
        return { collections };
      },
    },
    // Consolidated collection-resource operations
    {
      name: 'collection_resource',
      description: `Manage resources in collections - add or remove operations.

Actions:
- add: Add resource to collection
- remove: Remove resource from collection`,
      inputSchema: z.object({
        action: z.enum(['add', 'remove']).describe('Operation to perform'),
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
      }),
      handler: async (args: {
        action: 'add' | 'remove';
        resource_id: string | number;
        collection_id: string | number;
      }) => {
        switch (args.action) {
          case 'add':
            await client.call('add_resource_to_collection', args.resource_id, args.collection_id);
            return { success: true };
          
          case 'remove':
            await client.call('remove_resource_from_collection', args.resource_id, args.collection_id);
            return { success: true };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'collection_share',
      description: 'Share a collection with external users via email',
      inputSchema: z.object({
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
        emails: z.string().describe('Comma-separated email addresses'),
        message: z.string().optional().describe('Message to include'),
      }),
      handler: async (args: { collection_id: string | number; emails: string; message?: string }) => {
        const params: (string | number)[] = [args.collection_id, args.emails];
        if (args.message !== undefined) params.push(args.message);
        
        await client.call('share_collection', ...params);
        return { success: true };
      },
    },
    {
      name: 'collection_log',
      description: 'Get activity log for a collection',
      inputSchema: z.object({
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
      }),
      handler: async (args: { collection_id: string | number }) => {
        const log = await client.call('get_collection_log', args.collection_id);
        return { log };
      },
    },
    {
      name: 'collection_order',
      description: 'Set custom order for resources in a collection',
      inputSchema: z.object({
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
        resource_order: z.array(z.number()).describe('Array of resource IDs in desired order'),
      }),
      handler: async (args: { collection_id: string | number; resource_order: number[] }) => {
        await client.call('order_collection_resources', args.collection_id, args.resource_order.join(','));
        return { success: true };
      },
    },
  ];
}

