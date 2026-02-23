import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createMainSearchTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'search',
      description: 'Perform a search for resources',
      inputSchema: z.object({
        search: z.string().describe('Search query string'),
        restypes: z.string().optional().describe('Comma-separated resource type IDs to filter'),
        archive: z.number().optional().describe('Archive status filter (0=active, 1=pending, 2=archived)'),
        per_page: z.number().optional().describe('Results per page'),
        order_by: z.string().optional().describe('Field to sort by (e.g., "relevance", "resourceid", "field8")'),
        sort: z.enum(['ASC', 'DESC']).optional().describe('Sort direction'),
        start_from: z.number().optional().describe('Offset for pagination'),
      }),
      handler: async (args: {
        search: string;
        restypes?: string;
        archive?: number;
        per_page?: number;
        order_by?: string;
        sort?: 'ASC' | 'DESC';
        start_from?: number;
      }) => {
        const params: (string | number)[] = [args.search];
        if (args.restypes !== undefined) params.push(args.restypes);
        if (args.archive !== undefined) params.push(args.archive);
        if (args.per_page !== undefined) params.push(args.per_page);
        if (args.order_by !== undefined) params.push(args.order_by);
        if (args.sort !== undefined) params.push(args.sort);
        if (args.start_from !== undefined) params.push(args.start_from);

        const results = await client.call('do_search', ...params);
        return { results };
      },
    },
    {
      name: 'recent_resources',
      description: 'Get recently added or modified resources',
      inputSchema: z.object({
        days: z.number().optional().describe('Number of days to look back'),
        archive: z.number().optional().describe('Archive status filter'),
      }),
      handler: async (args: { days?: number; archive?: number }) => {
        const params: (string | number)[] = [];
        if (args.days !== undefined) params.push(args.days);
        if (args.archive !== undefined) params.push(args.archive);

        const resources = await client.call('get_recent_resources', ...params);
        return { resources };
      },
    },
    {
      name: 'search_collections',
      description: 'Search public collections',
      inputSchema: z.object({
        search: z.string().describe('Search query for collections'),
      }),
      handler: async (args: { search: string }) => {
        const collections = await client.call('search_public_collections', args.search);
        return { collections };
      },
    },
    {
      name: 'resource_collections',
      description: 'Get all collections containing a specific resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { resource_id: string | number }) => {
        const collections = await client.call('get_resource_collections', args.resource_id);
        return { collections };
      },
    },
    {
      name: 'search_discovery',
      description: `Discover search themes and keyword suggestions.

Actions:
- themes: Get all available search themes
- keywords: Get keyword suggestions for a prefix (requires prefix, optional field)`,
      inputSchema: z.object({
        action: z.enum(['themes', 'keywords']).describe('Discovery operation'),
        prefix: z.string().optional().describe('Keyword prefix to search for (required for keywords)'),
        field: z.number().optional().describe('Limit keywords to specific field ID'),
      }),
      handler: async (args: { action: 'themes' | 'keywords'; prefix?: string; field?: number }) => {
        switch (args.action) {
          case 'themes': {
            const themes = await client.call('get_themes');
            return { themes };
          }

          case 'keywords': {
            if (!args.prefix) throw new Error('prefix required for keywords action');
            const params: (string | number)[] = [args.prefix];
            if (args.field !== undefined) params.push(args.field);
            const keywords = await client.call('get_keywords', ...params);
            return { keywords };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
  ];
}
