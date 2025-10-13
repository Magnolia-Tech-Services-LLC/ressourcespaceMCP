import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createIIIFTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'iiif_manifest',
      description: 'Get IIIF manifest for a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { resource_id: string | number }) => {
        const manifest = await client.call('iiif_manifest', args.resource_id);
        return { manifest };
      },
    },
    {
      name: 'iiif_info',
      description: 'Get IIIF info.json for a resource',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
      }),
      handler: async (args: { resource_id: string | number }) => {
        const info = await client.call('iiif_info', args.resource_id);
        return { info };
      },
    },
    {
      name: 'iiif_image',
      description: 'Get IIIF image with specified parameters',
      inputSchema: z.object({
        resource_id: z.union([z.string(), z.number()]).describe('Resource ID'),
        region: z.string().optional().describe('Region (e.g., "full", "x,y,w,h")'),
        size: z.string().optional().describe('Size (e.g., "full", "max", "w,h")'),
        rotation: z.string().optional().describe('Rotation (e.g., "0", "90", "180", "270")'),
        quality: z.string().optional().describe('Quality (e.g., "default", "color", "gray")'),
        format: z.string().optional().describe('Format (e.g., "jpg", "png", "webp")'),
      }),
      handler: async (args: {
        resource_id: string | number;
        region?: string;
        size?: string;
        rotation?: string;
        quality?: string;
        format?: string;
      }) => {
        const params: (string | number)[] = [args.resource_id];
        if (args.region !== undefined) params.push(args.region);
        if (args.size !== undefined) params.push(args.size);
        if (args.rotation !== undefined) params.push(args.rotation);
        if (args.quality !== undefined) params.push(args.quality);
        if (args.format !== undefined) params.push(args.format);
        
        const imageUrl = await client.call('iiif_image', ...params);
        return { image_url: imageUrl };
      },
    },
    {
      name: 'iiif_collection',
      description: 'Get IIIF collection manifest',
      inputSchema: z.object({
        collection_id: z.union([z.string(), z.number()]).describe('Collection ID'),
      }),
      handler: async (args: { collection_id: string | number }) => {
        const manifest = await client.call('iiif_collection', args.collection_id);
        return { manifest };
      },
    },
    {
      name: 'iiif_search',
      description: 'IIIF content search',
      inputSchema: z.object({
        query: z.string().describe('Search query'),
      }),
      handler: async (args: { query: string }) => {
        const results = await client.call('iiif_search', args.query);
        return { results };
      },
    },
  ];
}

