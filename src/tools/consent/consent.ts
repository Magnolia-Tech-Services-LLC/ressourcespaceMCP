import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createConsentTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    // Consolidated consent CRUD
    {
      name: 'consent',
      description: `Manage consent records - perform get, create, update, or delete operations.

Actions:
- get: Get consent details (requires consent_id)
- create: Create new consent (requires consent data)
- update: Update consent (requires consent_id and update data)
- delete: Delete consent (requires consent_id)`,
      inputSchema: z.object({
        action: z.enum(['get', 'create', 'update', 'delete']).describe('Operation to perform'),
        consent_id: z.union([z.string(), z.number()]).optional().describe('Consent ID (required for get, update, delete)'),
        data: z.record(z.string(), z.any()).optional().describe('Consent data (required for create/update)'),
      }),
      handler: async (args: {
        action: 'get' | 'create' | 'update' | 'delete';
        consent_id?: string | number;
        data?: Record<string, unknown>;
      }) => {
        switch (args.action) {
          case 'get':
            if (!args.consent_id) throw new Error('consent_id required for get action');
            const consent = await client.call('get_consent', args.consent_id);
            return { consent };
          
          case 'create':
            if (!args.data) throw new Error('data required for create action');
            const consentId = await client.call('create_consent', JSON.stringify(args.data));
            return { consent_id: consentId };
          
          case 'update':
            if (!args.consent_id || !args.data) {
              throw new Error('consent_id and data required for update action');
            }
            await client.call('update_consent', args.consent_id, JSON.stringify(args.data));
            return { success: true };
          
          case 'delete':
            if (!args.consent_id) throw new Error('consent_id required for delete action');
            await client.call('delete_consent', args.consent_id);
            return { success: true };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'consents',
      description: 'Get all consent records',
      inputSchema: z.object({}),
      handler: async () => {
        const consents = await client.call('get_consents');
        return { consents };
      },
    },
    {
      name: 'consents_by_collection',
      description: 'Get consent records for a specific collection',
      inputSchema: z.object({
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
      }),
      handler: async (args: { collection_id: string | number }) => {
        const consents = await client.call('get_consents_by_collection', args.collection_id);
        return { consents };
      },
    },
    {
      name: 'consent_link',
      description: 'Link a consent record to a resource',
      inputSchema: z.object({
        consent_id: z.union([z.string(), z.number()]).describe('Consent ID'),
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { consent_id: string | number; resource_id: string | number }) => {
        await client.call('consent_link', args.consent_id, args.resource_id);
        return { success: true };
      },
    },
    {
      name: 'consent_unlink',
      description: 'Unlink a consent record from a resource',
      inputSchema: z.object({
        consent_id: z.union([z.string(), z.number()]).describe('Consent ID'),
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { consent_id: string | number; resource_id: string | number }) => {
        await client.call('consent_unlink', args.consent_id, args.resource_id);
        return { success: true };
      },
    },
    {
      name: 'consent_batch_link',
      description: 'Link or unlink a consent record to multiple resources',
      inputSchema: z.object({
        consent_id: z.union([z.string(), z.number()]).describe('Consent ID'),
        resource_ids: z.array(z.union([z.string(), z.number()])).describe('Array of resource IDs'),
        unlink: z.boolean().optional().describe('Set to true to unlink instead of link'),
      }),
      handler: async (args: {
        consent_id: string | number;
        resource_ids: (string | number)[];
        unlink?: boolean;
      }) => {
        const action = args.unlink ? 'unlink' : 'link';
        await client.call('consent_batch_link', args.consent_id, args.resource_ids.join(','), action);
        return { success: true, affected_count: args.resource_ids.length };
      },
    },
    {
      name: 'consent_file_save',
      description: 'Save a file for a consent record',
      inputSchema: z.object({
        consent_id: z.union([z.string(), z.number()]).describe('Consent ID'),
        file_path: z.string().describe('Path to the file'),
      }),
      handler: async (args: { consent_id: string | number; file_path: string }) => {
        await client.call('consent_file_save', args.consent_id, args.file_path);
        return { success: true };
      },
    },
    {
      name: 'licenses',
      description: 'Get available licenses for consent management',
      inputSchema: z.object({}),
      handler: async () => {
        const licenses = await client.call('get_licenses');
        return { licenses };
      },
    },
  ];
}

