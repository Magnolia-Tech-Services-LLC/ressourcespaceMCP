import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { Resource } from '../../types/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createMainResourceTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    // Consolidated CRUD for resources
    {
      name: 'resource',
      description: `Manage resources - perform get, create, update, delete, or copy operations.
      
Actions:
- get: Retrieve resource data (requires resource_id)
- create: Create new resource (requires resource_type, optional archive)
- delete: Delete resource (requires resource_id)
- copy: Copy resource (requires resource_id)`,
      inputSchema: z.object({
        action: z.enum(['get', 'create', 'delete', 'copy']).describe('Operation to perform'),
        resource_id: z.union([z.string(), z.number()]).optional().describe('Resource ID (required for get, delete, copy)'),
        resource_type: z.number().optional().describe('Resource type ID (required for create)'),
        archive: z.number().optional().describe('Archive status for create (0=active, 1=pending, 2=archived, -1=pending submission)'),
      }),
      handler: async (args: { 
        action: 'get' | 'create' | 'delete' | 'copy';
        resource_id?: string | number;
        resource_type?: number;
        archive?: number;
      }) => {
        switch (args.action) {
          case 'get':
            if (!args.resource_id) throw new Error('resource_id required for get action');
            const data = await client.call<Resource>('get_resource_data', args.resource_id);
            return { resource: data };
          
          case 'create':
            if (!args.resource_type) throw new Error('resource_type required for create action');
            const params: (string | number)[] = [args.resource_type];
            if (args.archive !== undefined) params.push(args.archive);
            const resourceId = await client.call<string>('create_resource', ...params);
            return { resource_id: resourceId };
          
          case 'delete':
            if (!args.resource_id) throw new Error('resource_id required for delete action');
            await client.call('delete_resource', args.resource_id);
            return { success: true };
          
          case 'copy':
            if (!args.resource_id) throw new Error('resource_id required for copy action');
            const newId = await client.call('copy_resource', args.resource_id);
            return { new_resource_id: newId };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'resource_path',
      description: 'Get the file path or URL for a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        size: z.string().optional().describe('Size variant (e.g., "thm", "scr", "pre", "" for original)'),
        page: z.number().optional().describe('Page number for multi-page resources'),
        alternative: z.number().optional().describe('Alternative file ID'),
      }),
      handler: async (args: { resource_id: string | number; size?: string; page?: number; alternative?: number }) => {
        const params: (string | number)[] = [args.resource_id];
        if (args.size !== undefined) params.push(args.size);
        if (args.page !== undefined) params.push(args.page);
        if (args.alternative !== undefined) params.push(args.alternative);
        
        const path = await client.call<string>('get_resource_path', ...params);
        return { path };
      },
    },
    {
      name: 'resource_types',
      description: 'Get all available resource types',
      inputSchema: z.object({}),
      handler: async () => {
        const types = await client.call('get_resource_types');
        return { resource_types: types };
      },
    },
    {
      name: 'resource_access',
      description: 'Get access level for a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { resource_id: string | number }) => {
        const access = await client.call('get_resource_access', args.resource_id);
        return { access };
      },
    },
    {
      name: 'resource_log',
      description: 'Get activity log for a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { resource_id: string | number }) => {
        const log = await client.call('get_resource_log', args.resource_id);
        return { log };
      },
    },
    {
      name: 'resource_related',
      description: 'Get resources related to a specific resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { resource_id: string | number }) => {
        const related = await client.call('get_related_resources', args.resource_id);
        return { related_resources: related };
      },
    },
    // Consolidated alternative files operations
    {
      name: 'alternative_files',
      description: `Manage alternative files - perform get, add, delete, or revert operations.

Actions:
- get: Get all alternative files (requires resource_id)
- add: Add alternative file (requires resource_id, name, description, file_path)
- delete: Delete alternative file (requires resource_id, alternative_id)
- revert: Revert resource to alternative (requires resource_id, alternative_id)`,
      inputSchema: z.object({
        action: z.enum(['get', 'add', 'delete', 'revert']).describe('Operation to perform'),
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        alternative_id: z.union([z.string(), z.number()]).optional().describe('Alternative file ID (required for delete, revert)'),
        name: z.string().optional().describe('Name for alternative file (required for add)'),
        description: z.string().optional().describe('Description (required for add)'),
        file_path: z.string().optional().describe('File path (required for add)'),
      }),
      handler: async (args: {
        action: 'get' | 'add' | 'delete' | 'revert';
        resource_id: string | number;
        alternative_id?: string | number;
        name?: string;
        description?: string;
        file_path?: string;
      }) => {
        switch (args.action) {
          case 'get':
            const alternatives = await client.call('get_alternative_files', args.resource_id);
            return { alternative_files: alternatives };
          
          case 'add':
            if (!args.name || !args.description || !args.file_path) {
              throw new Error('name, description, and file_path required for add action');
            }
            const altId = await client.call('add_alternative_file', args.resource_id, args.name, args.description, args.file_path);
            return { alternative_file_id: altId };
          
          case 'delete':
            if (!args.alternative_id) throw new Error('alternative_id required for delete action');
            await client.call('delete_alternative_file', args.resource_id, args.alternative_id);
            return { success: true };
          
          case 'revert':
            if (!args.alternative_id) throw new Error('alternative_id required for revert action');
            await client.call('revert_resource_to_alternative', args.resource_id, args.alternative_id);
            return { success: true };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'upload_file',
      description: 'Upload a file to create or update a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID (use create_resource first if new)'),
        no_exif: z.boolean().optional().describe('Skip EXIF extraction'),
        revert: z.boolean().optional().describe('Revert to previous version'),
        autorotate: z.boolean().optional().describe('Auto-rotate based on EXIF'),
      }),
      handler: async (args: { resource_id: string | number; no_exif?: boolean; revert?: boolean; autorotate?: boolean }) => {
        // Note: Actual file upload requires special handling with multipart/form-data
        const result = await client.call('upload_file', args.resource_id);
        return { result };
      },
    },
  ];
}

