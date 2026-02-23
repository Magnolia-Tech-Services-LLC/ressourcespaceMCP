import { z } from 'zod';
import { ResourceSpaceClient } from '../../client/resourcespace.js';
import { MCPTool } from '../shared/types.js';

export function createAdminUserTools(client: ResourceSpaceClient): MCPTool[] {
  return [
    {
      name: 'user',
      description: `Manage user accounts - perform get, create, update, delete, list, or approve operations.

Actions:
- get: Get user details (requires user_id)
- create: Create new user (requires username, password, fullname, email, usergroup)
- update: Update user (requires user_id, optional username, fullname, email, usergroup)
- delete: Delete user (requires user_id)
- list: Get all users (optional usergroup filter)
- approve: Approve a pending user account (requires user_id)`,
      inputSchema: z.object({
        action: z.enum(['get', 'create', 'update', 'delete', 'list', 'approve']).describe('Operation to perform'),
        user_id: z.union([z.string(), z.number()]).optional().describe('User ID (required for get, update, delete, approve)'),
        username: z.string().optional().describe('Username (required for create)'),
        password: z.string().optional().describe('Password (required for create)'),
        fullname: z.string().optional().describe('Full name (required for create)'),
        email: z.string().email().optional().describe('Email address (required for create)'),
        usergroup: z.number().optional().describe('User group ID (required for create, optional filter for list)'),
        comments: z.string().optional().describe('Additional comments (optional for create)'),
      }),
      handler: async (args: {
        action: 'get' | 'create' | 'update' | 'delete' | 'list' | 'approve';
        user_id?: string | number;
        username?: string;
        password?: string;
        fullname?: string;
        email?: string;
        usergroup?: number;
        comments?: string;
      }) => {
        switch (args.action) {
          case 'get':
            if (!args.user_id) throw new Error('user_id required for get action');
            const user = await client.call('get_user', args.user_id);
            return { user };

          case 'create':
            if (!args.username || !args.password || !args.fullname || !args.email || !args.usergroup) {
              throw new Error('username, password, fullname, email, and usergroup required for create action');
            }
            const createParams: (string | number)[] = [
              args.username,
              args.password,
              args.fullname,
              args.email,
              args.usergroup,
            ];
            if (args.comments !== undefined) createParams.push(args.comments);
            const userId = await client.call('create_user', ...createParams);
            return { user_id: userId };

          case 'update':
            if (!args.user_id) throw new Error('user_id required for update action');
            await client.call('update_user', args.user_id);
            return { success: true };

          case 'delete':
            if (!args.user_id) throw new Error('user_id required for delete action');
            await client.call('delete_user', args.user_id);
            return { success: true };

          case 'list': {
            const params: (string | number)[] = args.usergroup !== undefined ? [args.usergroup] : [];
            const users = await client.call('get_users', ...params);
            return { users };
          }

          case 'approve':
            if (!args.user_id) throw new Error('user_id required for approve action');
            await client.call('approve_user', args.user_id);
            return { success: true };

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'usergroup',
      description: `Manage user groups - perform get, create, update, delete, or list operations.

Actions:
- get: Get usergroup details (requires usergroup_id)
- create: Create new usergroup (requires name, optional permissions)
- update: Update usergroup (requires usergroup_id, optional name, permissions)
- delete: Delete usergroup (requires usergroup_id)
- list: Get all user groups`,
      inputSchema: z.object({
        action: z.enum(['get', 'create', 'update', 'delete', 'list']).describe('Operation to perform'),
        usergroup_id: z.number().optional().describe('Usergroup ID (required for get, update, delete)'),
        name: z.string().optional().describe('Group name (required for create)'),
        permissions: z.string().optional().describe('Permission string'),
      }),
      handler: async (args: {
        action: 'get' | 'create' | 'update' | 'delete' | 'list';
        usergroup_id?: number;
        name?: string;
        permissions?: string;
      }) => {
        switch (args.action) {
          case 'get':
            if (!args.usergroup_id) throw new Error('usergroup_id required for get action');
            const group = await client.call('get_usergroup', args.usergroup_id);
            return { usergroup: group };

          case 'create':
            if (!args.name) throw new Error('name required for create action');
            const createParams: (string | number)[] = [args.name];
            if (args.permissions !== undefined) createParams.push(args.permissions);
            const groupId = await client.call('create_usergroup', ...createParams);
            return { usergroup_id: groupId };

          case 'update':
            if (!args.usergroup_id) throw new Error('usergroup_id required for update action');
            await client.call('update_usergroup', args.usergroup_id);
            return { success: true };

          case 'delete':
            if (!args.usergroup_id) throw new Error('usergroup_id required for delete action');
            await client.call('delete_usergroup', args.usergroup_id);
            return { success: true };

          case 'list': {
            const groups = await client.call('get_usergroups');
            return { usergroups: groups };
          }

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'user_preferences',
      description: `Manage user preferences - get or save operations.

Actions:
- get: Get user preferences (optional user_id)
- save: Save user preferences (requires preferences object, optional user_id)`,
      inputSchema: z.object({
        action: z.enum(['get', 'save']).describe('Operation to perform'),
        user_id: z.union([z.string(), z.number()]).optional().describe('User ID (omit for current user)'),
        preferences: z.record(z.string(), z.any()).optional().describe('Preferences object (required for save)'),
      }),
      handler: async (args: {
        action: 'get' | 'save';
        user_id?: string | number;
        preferences?: Record<string, unknown>;
      }) => {
        switch (args.action) {
          case 'get':
            const params: (string | number)[] = args.user_id !== undefined ? [args.user_id] : [];
            const preferences = await client.call('get_user_preferences', ...params);
            return { preferences };

          case 'save':
            if (!args.preferences) throw new Error('preferences required for save action');
            await client.call('save_user_preferences', JSON.stringify(args.preferences));
            return { success: true };

          default:
            throw new Error(`Unknown action: ${args.action}`);
        }
      },
    },
    {
      name: 'user_activity',
      description: 'Get activity log for a user',
      inputSchema: z.object({
        user_id: z.union([z.string(), z.number()]).describe('User ID'),
        limit: z.number().optional().describe('Limit number of results'),
      }),
      handler: async (args: { user_id: string | number; limit?: number }) => {
        const params: (string | number)[] = [args.user_id];
        if (args.limit !== undefined) params.push(args.limit);

        const activity = await client.call('get_user_activity', ...params);
        return { activity };
      },
    },
    {
      name: 'user_collections',
      description: 'Get all collections for a user',
      inputSchema: z.object({
        user_id: z.union([z.string(), z.number()]).describe('User ID'),
      }),
      handler: async (args: { user_id: string | number }) => {
        const collections = await client.call('get_user_collections', args.user_id);
        return { collections };
      },
    },
  ];
}
