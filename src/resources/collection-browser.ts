import { ResourceSpaceClient } from '../client/resourcespace.js';

export function createCollectionBrowserResources(client: ResourceSpaceClient) {
  return [
    {
      uri: 'resource://collections/list',
      name: 'Collections List',
      description: 'Get all collections for the current user',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const collections = await client.call('get_collections');
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(collections, null, 2),
            },
          ],
        };
      },
    },
    {
      uri: 'resource://collections/{id}',
      name: 'Collection Details',
      description: 'Get details of a specific collection',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const match = uri.match(/resource:\/\/collections\/(\d+)/);
        if (!match) {
          throw new Error('Invalid resource URI format');
        }
        
        const collectionId = match[1];
        const collection = await client.call('get_collection', collectionId);
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(collection, null, 2),
            },
          ],
        };
      },
    },
    {
      uri: 'resource://collections/{id}/resources',
      name: 'Collection Resources',
      description: 'Get all resources in a collection',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const match = uri.match(/resource:\/\/collections\/(\d+)\/resources/);
        if (!match) {
          throw new Error('Invalid resource URI format');
        }
        
        const collectionId = match[1];
        const resources = await client.call('get_collection_resources', collectionId);
        
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
      uri: 'resource://collections/public',
      name: 'Public Collections',
      description: 'Get all public collections',
      mimeType: 'application/json',
      handler: async (uri: string) => {
        const collections = await client.call('get_public_collections');
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(collections, null, 2),
            },
          ],
        };
      },
    },
  ];
}

