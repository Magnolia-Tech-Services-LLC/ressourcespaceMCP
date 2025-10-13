import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createAdminSystemTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'system_info',
      description: 'Get ResourceSpace system information including version and configuration',
      inputSchema: z.object({}),
      handler: async () => {
        const info = await client.call('get_system_info');
        return { system_info: info };
      },
    },
    {
      name: 'system_status',
      description: 'Get overall system health status',
      inputSchema: z.object({}),
      handler: async () => {
        const status = await client.call('get_system_status');
        return { status };
      },
    },
    // Consolidated config operations
    {
      name: 'config',
      description: `Manage system configuration - get or set operations.

Actions:
- get: Get config options (optional name for specific option)
- set: Set config option (requires name and value)`,
      inputSchema: z.object({
        action: z.enum(['get', 'set']).describe('Operation to perform'),
        name: z.string().optional().describe('Config option name'),
        value: z.string().optional().describe('Config option value (required for set)'),
      }),
      handler: async (args: {
        action: 'get' | 'set';
        name?: string;
        value?: string;
      }) => {
        switch (args.action) {
          case 'get':
            const params: (string | number)[] = args.name !== undefined ? [args.name] : [];
            const config = await client.call('get_config_options', ...params);
            return { config };
          
          case 'set':
            if (!args.name || args.value === undefined) {
              throw new Error('name and value required for set action');
            }
            await client.call('set_config_option', args.name, args.value);
            return { success: true };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'plugins',
      description: 'Get list of installed plugins',
      inputSchema: z.object({}),
      handler: async () => {
        const plugins = await client.call('get_plugins');
        return { plugins };
      },
    },
    // Consolidated plugin config operations
    {
      name: 'plugin_config',
      description: `Manage plugin configuration - get or set operations.

Actions:
- get: Get plugin config (requires plugin_name)
- set: Set plugin config (requires plugin_name, config_name, value)`,
      inputSchema: z.object({
        action: z.enum(['get', 'set']).describe('Operation to perform'),
        plugin_name: z.string().describe('Plugin name'),
        config_name: z.string().optional().describe('Config parameter name (required for set)'),
        value: z.string().optional().describe('Config value (required for set)'),
      }),
      handler: async (args: {
        action: 'get' | 'set';
        plugin_name: string;
        config_name?: string;
        value?: string;
      }) => {
        switch (args.action) {
          case 'get':
            const config = await client.call('get_plugin_config', args.plugin_name);
            return { plugin_config: config };
          
          case 'set':
            if (!args.config_name || args.value === undefined) {
              throw new Error('config_name and value required for set action');
            }
            await client.call('set_plugin_config', args.plugin_name, args.config_name, args.value);
            return { success: true };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    // Consolidated job queue operations
    {
      name: 'job_queue',
      description: `Manage job queue - get or clear operations.

Actions:
- get: Get current job queue status
- clear: Clear pending jobs from the queue`,
      inputSchema: z.object({
        action: z.enum(['get', 'clear']).describe('Operation to perform'),
      }),
      handler: async (args: { action: 'get' | 'clear' }) => {
        switch (args.action) {
          case 'get':
            const queue = await client.call('get_job_queue');
            return { job_queue: queue };
          
          case 'clear':
            await client.call('clear_job_queue');
            return { success: true };
          
          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'resource_stats',
      description: 'Get statistics about resources in the system',
      inputSchema: z.object({}),
      handler: async () => {
        const stats = await client.call('get_resource_stats');
        return { stats };
      },
    },
    {
      name: 'cache_clear',
      description: 'Clear system cache',
      inputSchema: z.object({}),
      handler: async () => {
        await client.call('clear_cache');
        return { success: true };
      },
    },
    {
      name: 'reindex',
      description: 'Trigger reindexing of resource metadata',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).optional().describe('Specific resource ID (omit for all)'),
      }),
      handler: async (args: { resource_id?: string | number }) => {
        const params: (string | number)[] = args.resource_id !== undefined ? [args.resource_id] : [];
        await client.call('reindex_resources', ...params);
        return { success: true };
      },
    },
    {
      name: 'activity_log',
      description: 'Get system activity log',
      inputSchema: z.object({
        limit: z.number().optional().describe('Limit number of entries'),
        offset: z.number().optional().describe('Offset for pagination'),
      }),
      handler: async (args: { limit?: number; offset?: number }) => {
        const params: (string | number)[] = [];
        if (args.limit !== undefined) params.push(args.limit);
        if (args.offset !== undefined) params.push(args.offset);
        
        const log = await client.call('get_activity_log', ...params);
        return { activity_log: log };
      },
    },
  ];
}

