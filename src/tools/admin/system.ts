import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createAdminSystemTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'system',
      description: `Get system information, health status, or resource statistics.

Actions:
- info: Get ResourceSpace system information including version and configuration
- status: Get overall system health status
- stats: Get statistics about resources in the system`,
      inputSchema: z.object({
        action: z.enum(['info', 'status', 'stats']).describe('Information to retrieve'),
      }),
      handler: async (args: { action: 'info' | 'status' | 'stats' }) => {
        switch (args.action) {
          case 'info': {
            const info = await client.call('get_system_info');
            return { system_info: info };
          }

          case 'status': {
            const status = await client.call('get_system_status');
            return { status };
          }

          case 'stats': {
            const stats = await client.call('get_resource_stats');
            return { stats };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'system_maintenance',
      description: `Perform system maintenance operations.

Actions:
- cache_clear: Clear system cache
- reindex: Trigger reindexing of resource metadata (optional resource_id for specific resource)`,
      inputSchema: z.object({
        action: z.enum(['cache_clear', 'reindex']).describe('Maintenance operation'),
        resource_id: z.union([z.string(), z.number()]).optional().describe('Specific resource ID for reindex (omit for all)'),
      }),
      handler: async (args: { action: 'cache_clear' | 'reindex'; resource_id?: string | number }) => {
        switch (args.action) {
          case 'cache_clear': {
            await client.call('clear_cache');
            return { success: true };
          }

          case 'reindex': {
            const params: (string | number)[] = args.resource_id !== undefined ? [args.resource_id] : [];
            await client.call('reindex_resources', ...params);
            return { success: true };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'plugin',
      description: `Manage plugins - list installed plugins or get/set plugin configuration.

Actions:
- list: Get list of installed plugins
- config_get: Get plugin configuration (requires plugin_name)
- config_set: Set plugin configuration (requires plugin_name, config_name, value)`,
      inputSchema: z.object({
        action: z.enum(['list', 'config_get', 'config_set']).describe('Operation to perform'),
        plugin_name: z.string().optional().describe('Plugin name (required for config_get, config_set)'),
        config_name: z.string().optional().describe('Config parameter name (required for config_set)'),
        value: z.string().optional().describe('Config value (required for config_set)'),
      }),
      handler: async (args: {
        action: 'list' | 'config_get' | 'config_set';
        plugin_name?: string;
        config_name?: string;
        value?: string;
      }) => {
        switch (args.action) {
          case 'list': {
            const plugins = await client.call('get_plugins');
            return { plugins };
          }

          case 'config_get': {
            if (!args.plugin_name) throw new Error('plugin_name required for config_get action');
            const config = await client.call('get_plugin_config', args.plugin_name);
            return { plugin_config: config };
          }

          case 'config_set': {
            if (!args.plugin_name || !args.config_name || args.value === undefined) {
              throw new Error('plugin_name, config_name, and value required for config_set action');
            }
            await client.call('set_plugin_config', args.plugin_name, args.config_name, args.value);
            return { success: true };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
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
