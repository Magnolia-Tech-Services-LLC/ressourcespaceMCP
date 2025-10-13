import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';
import { createConsentTools } from './consent.js';

export function createConsentTools_All(client: ResourceSpaceClient): MCPTool[] {
  return createConsentTools(client);
}

export { createConsentTools };

