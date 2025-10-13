import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';
import { createIIIFTools } from './iiif.js';

export function createIIIFTools_All(client: ResourceSpaceClient): MCPTool[] {
  return createIIIFTools(client);
}

export { createIIIFTools };

