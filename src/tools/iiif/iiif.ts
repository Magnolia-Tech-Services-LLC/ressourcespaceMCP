import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createIIIFTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'iiif',
      description: `Access IIIF (International Image Interoperability Framework) endpoints.

Actions:
- manifest: Get IIIF manifest for a resource (requires resource_id)
- info: Get IIIF info.json for a resource (requires resource_id)
- image: Get IIIF image with parameters (requires resource_id, optional region/size/rotation/quality/format)
- collection: Get IIIF collection manifest (requires collection_id)
- search: IIIF content search (requires query)`,
      inputSchema: z.object({
        action: z.enum(['manifest', 'info', 'image', 'collection', 'search']).describe('IIIF operation'),
        resource_id: z.union([z.string(), z.number()]).optional()
          .describe('Resource ID (required for manifest, info, image)'),
        collection_id: z.union([z.string(), z.number()]).optional()
          .describe('Collection ID (required for collection)'),
        query: z.string().optional().describe('Search query (required for search)'),
        region: z.string().optional().describe('IIIF region (e.g., "full", "x,y,w,h")'),
        size: z.string().optional().describe('IIIF size (e.g., "full", "max", "w,h")'),
        rotation: z.string().optional().describe('IIIF rotation (e.g., "0", "90", "180", "270")'),
        quality: z.string().optional().describe('IIIF quality (e.g., "default", "color", "gray")'),
        format: z.string().optional().describe('IIIF format (e.g., "jpg", "png", "webp")'),
      }),
      handler: async (args: {
        action: 'manifest' | 'info' | 'image' | 'collection' | 'search';
        resource_id?: string | number;
        collection_id?: string | number;
        query?: string;
        region?: string;
        size?: string;
        rotation?: string;
        quality?: string;
        format?: string;
      }) => {
        switch (args.action) {
          case 'manifest': {
            if (args.resource_id === undefined) throw new Error('resource_id required for manifest action');
            const manifest = await client.call('iiif_manifest', args.resource_id);
            return { manifest };
          }

          case 'info': {
            if (args.resource_id === undefined) throw new Error('resource_id required for info action');
            const info = await client.call('iiif_info', args.resource_id);
            return { info };
          }

          case 'image': {
            if (args.resource_id === undefined) throw new Error('resource_id required for image action');
            const params: (string | number)[] = [args.resource_id];
            if (args.region !== undefined) params.push(args.region);
            if (args.size !== undefined) params.push(args.size);
            if (args.rotation !== undefined) params.push(args.rotation);
            if (args.quality !== undefined) params.push(args.quality);
            if (args.format !== undefined) params.push(args.format);
            const imageUrl = await client.call('iiif_image', ...params);
            return { image_url: imageUrl };
          }

          case 'collection': {
            if (args.collection_id === undefined) throw new Error('collection_id required for collection action');
            const manifest = await client.call('iiif_collection', args.collection_id);
            return { manifest };
          }

          case 'search': {
            if (!args.query) throw new Error('query required for search action');
            const results = await client.call('iiif_search', args.query);
            return { results };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
  ];
}
