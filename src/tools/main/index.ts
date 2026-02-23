import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';
import { createMainResourceTools } from './resources.js';
import { createMainCollectionTools } from './collections.js';
import { createMainMetadataTools } from './metadata.js';
import { createMainSearchTools } from './search.js';
import { createMainBatchTools } from './batch.js';
import { createIIIFTools } from '../iiif/iiif.js';

export function createMainTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    ...createMainResourceTools(client),
    ...createMainSearchTools(client),
    ...createMainCollectionTools(client),
    ...createMainMetadataTools(client),
    ...createMainBatchTools(client),
    ...createIIIFTools(client),
  ];
}

export {
  createMainResourceTools,
  createMainCollectionTools,
  createMainMetadataTools,
  createMainSearchTools,
  createMainBatchTools,
  createIIIFTools,
};
