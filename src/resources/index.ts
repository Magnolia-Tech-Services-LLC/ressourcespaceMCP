import { ResourceSpaceClient } from '../client/resourcespace.js';
import { createAssetBrowserResources } from './asset-browser.js';
import { createCollectionBrowserResources } from './collection-browser.js';

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  handler: (uri: string) => Promise<any>;
}

export function createAllResources(client: ResourceSpaceClient): MCPResource[] {
  return [
    ...createAssetBrowserResources(client),
    ...createCollectionBrowserResources(client),
    // Additional resource for metadata fields
    {
      uri: 'resource://metadata/fields',
      name: 'Metadata Fields',
      description: 'Get all available metadata fields',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const fields = await client.call('get_resource_type_fields');
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(fields, null, 2),
            },
          ],
        };
      },
    },
    // Resource types
    {
      uri: 'resource://metadata/types',
      name: 'Resource Types',
      description: 'Get all available resource types',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const types = await client.call('get_resource_types');
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(types, null, 2),
            },
          ],
        };
      },
    },
  ];
}

export { createAssetBrowserResources, createCollectionBrowserResources };

