import { ResourceSpaceClient } from '../client/resourcespace.js';
import { Resource } from '../types/resourcespace.js';

export function createAssetBrowserResources(client: ResourceSpaceClient) {
  return [
    {
      uri: 'resource://assets/{id}',
      name: 'Asset Details',
      description: 'Get detailed information about a specific asset',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const match = uri.match(/resource:\/\/assets\/(\d+)/);
        if (!match) {
          throw new Error('Invalid resource URI format');
        }
        
        const resourceId = match[1];
        const data = await client.call<Resource>('get_resource_data', resourceId);
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      },
    },
    {
      uri: 'resource://assets/search',
      name: 'Asset Search',
      description: 'Search for assets with a query string',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const url = new URL(uri);
        const query = url.searchParams.get('query') || '';
        const results = await client.call('do_search', query);
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      },
    },
    {
      uri: 'resource://assets/recent',
      name: 'Recent Assets',
      description: 'Get recently added or modified assets',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const url = new URL(uri);
        const days = parseInt(url.searchParams.get('days') || '7', 10);
        const resources = await client.call('get_recent_resources', days);
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(resources, null, 2),
            },
          ],
        };
      },
    },
    {
      uri: 'resource://assets/{id}/metadata',
      name: 'Asset Metadata',
      description: 'Get all metadata fields for a specific asset',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const match = uri.match(/resource:\/\/assets\/(\d+)\/metadata/);
        if (!match) {
          throw new Error('Invalid resource URI format');
        }
        
        const resourceId = match[1];
        const metadata = await client.call('get_resource_field_data', resourceId);
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(metadata, null, 2),
            },
          ],
        };
      },
    },
    {
      uri: 'resource://assets/{id}/alternatives',
      name: 'Asset Alternative Files',
      description: 'Get all alternative files for a specific asset',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const match = uri.match(/resource:\/\/assets\/(\d+)\/alternatives/);
        if (!match) {
          throw new Error('Invalid resource URI format');
        }
        
        const resourceId = match[1];
        const alternatives = await client.call('get_alternative_files', resourceId);
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(alternatives, null, 2),
            },
          ],
        };
      },
    },
  ];
}

