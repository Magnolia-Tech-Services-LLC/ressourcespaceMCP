import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';
import { createAdminUserTools } from './users.js';
import { createAdminSystemTools } from './system.js';
import { createConsentTools } from '../consent/consent.js';

export function createAdminTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    ...createAdminUserTools(client),
    ...createAdminSystemTools(client),
    ...createConsentTools(client),
  ];
}

export {
  createAdminUserTools,
  createAdminSystemTools,
  createConsentTools,
};
