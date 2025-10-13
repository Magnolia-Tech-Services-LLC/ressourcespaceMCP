export interface MCPPrompt {
  name: string;
  description: string;
  arguments: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
  handler: (args: Record<string, string>) => Promise<string>;
}

export function createPromptTemplates(): MCPPrompt[] {
  return [
    {
      name: 'upload_asset_workflow',
      description: 'Guide user through uploading a new asset with proper metadata',
      arguments: [
        {
          name: 'resource_type',
          description: 'The type of resource to upload (e.g., image, video, document)',
          required: true,
        },
      ],
      handler: async (args: Record<string, string>) => {
        const resourceType = args.resource_type || 'image';
        return `# Upload Asset Workflow

Let me guide you through uploading a new ${resourceType} asset to ResourceSpace.

## Step 1: Create Resource
First, we need to create a resource entry. Use the \`create_resource\` tool with:
- resource_type: [ID for ${resourceType} type - use get_resource_types to find the correct ID]
- archive: 0 (for active status)

## Step 2: Upload File
Once you have the resource ID, upload your file using \`upload_file\`:
- resource_id: [the ID from step 1]
- Set appropriate flags (no_exif, autorotate, etc.)

## Step 3: Add Metadata
Update important metadata fields using \`update_field\`:
- Title (usually field 8)
- Description (usually field 3)
- Any other required fields

## Step 4: Add to Collection (Optional)
If you want to add this to a collection, use \`add_resource_to_collection\`:
- resource_id: [your resource ID]
- collection_id: [target collection]

## Step 5: Set Keywords/Categories
Use \`add_resource_nodes\` to tag the resource:
- resource_id: [your resource ID]
- nodes: [array of category/keyword node IDs]

Would you like to proceed with these steps?`;
      },
    },
    {
      name: 'search_and_filter_workflow',
      description: 'Help construct complex search queries with filters',
      arguments: [
        {
          name: 'search_goal',
          description: 'What you are trying to find',
          required: true,
        },
      ],
      handler: async (args: Record<string, string>) => {
        const goal = args.search_goal || 'specific resources';
        return `# Advanced Search Workflow

Let me help you find ${goal} in ResourceSpace.

## Basic Search
Start with \`do_search\`:
- search: [your search terms]
- restypes: [optional: filter by resource type IDs]
- archive: [optional: 0=active only, 1=pending, 2=archived]

## Refine with Filters
To narrow down results:
1. Use \`get_search_filter_nodes\` to see available filter options
2. Apply filters using \`search_advanced\` with field-specific criteria

## Faceted Search
For better filtering:
1. Use \`get_facets\` to see available facet options
2. Refine search based on facet values

## Keyword Suggestions
If you need keyword ideas:
- Use \`get_keywords\` with a prefix to get suggestions
- Filter by specific field if needed

## Pagination
For large result sets:
- Use per_page and start_from parameters
- Typical: per_page=50, start_from=0 (then 50, 100, etc.)

## Sorting
Available sort options:
- order_by: "relevance", "resourceid", "field8" (title), etc.
- sort: "ASC" or "DESC"

What specific criteria would you like to search by?`;
      },
    },
    {
      name: 'collection_management_workflow',
      description: 'Workflow for creating and organizing collections',
      arguments: [
        {
          name: 'collection_purpose',
          description: 'The purpose of the collection you want to create',
          required: true,
        },
      ],
      handler: async (args: Record<string, string>) => {
        const purpose = args.collection_purpose || 'organizing assets';
        return `# Collection Management Workflow

Let me help you create a collection for ${purpose}.

## Step 1: Create Collection
Use \`create_collection\`:
- name: [descriptive name for ${purpose}]
- public: true/false (whether others can see it)
- allow_changes: true/false (whether others can modify it)

## Step 2: Add Resources
To populate the collection:
- Individual: Use \`add_resource_to_collection\` for each resource
- Batch: Use \`batch_add_to_collection\` for multiple resources at once

## Step 3: Organize Resources
Arrange resources in a specific order:
- Use \`order_collection_resources\` with an array of resource IDs in your desired order

## Step 4: Share Collection
Share with others:
- Email: Use \`share_collection\` or \`collection_email\`
- External Access: Use \`create_collection_external_access\` for external users
- Public: Update collection with public=true

## Smart Collections (Optional)
Create auto-updating collections:
- Use \`add_collection_smart_search\` with a search query
- Collection automatically updates as new matching resources are added

## Collection Themes
For featured collections:
- Assign to theme categories using appropriate tools
- Make visible on homepage or specific sections

Would you like to proceed with creating this collection?`;
      },
    },
    {
      name: 'metadata_enrichment_workflow',
      description: 'Batch update and enrich resource metadata',
      arguments: [
        {
          name: 'field_name',
          description: 'The metadata field you want to update',
          required: false,
        },
      ],
      handler: async (args: Record<string, string>) => {
        const field = args.field_name || 'metadata fields';
        return `# Metadata Enrichment Workflow

Let me help you update ${field} for your resources.

## Step 1: Identify Resources
Find the resources to update:
- Use \`do_search\` to find resources by criteria
- Or use \`get_collection_resources\` if working with a collection
- Note the resource IDs

## Step 2: Identify Field
Find the correct field ID:
- Use \`get_resource_type_fields\` to list all fields
- Find the field ID for ${field}

## Step 3: Single Update
For one resource:
- Use \`update_field\` with resource_id, field_id, and new value

## Step 4: Batch Update
For multiple resources:
- Use \`batch_update_field\` with:
  - resource_ids: array of all resource IDs
  - field_id: the field to update
  - value: the new value

## Step 5: Add Categories/Keywords
To add keyword nodes:
- Use \`batch_add_nodes\` for multiple resources
- Or \`add_resource_nodes\` for individual resources

## Step 6: Copy Metadata
To copy from one resource to others:
- Single field: Use \`copy_field\`
- All fields: Use \`copy_resource_metadata\`
- Batch: Use \`batch_copy_field\`

## Step 7: Verify Updates
Check your changes:
- Use \`get_resource_field_data\` to verify individual resources
- Check activity logs with \`get_resource_log\`

What metadata would you like to update?`;
      },
    },
    {
      name: 'user_onboarding_workflow',
      description: 'Set up new users with proper permissions',
      arguments: [
        {
          name: 'user_role',
          description: 'The role or permission level for the new user',
          required: true,
        },
      ],
      handler: async (args: Record<string, string>) => {
        const role = args.user_role || 'standard user';
        return `# User Onboarding Workflow

Let me help you set up a new ${role}.

## Step 1: Review User Groups
Check available permission levels:
- Use \`get_usergroups\` to see all groups
- Use \`get_usergroup\` for details on specific groups
- Identify the correct group ID for ${role}

## Step 2: Create User Account
Use \`create_user\`:
- username: [unique username]
- password: [secure password]
- fullname: [full name]
- email: [email address]
- usergroup: [group ID from step 1]
- comments: [optional notes]

## Step 3: Configure User Preferences (Optional)
Set default preferences:
- Use \`save_user_preferences\` to configure:
  - Default language
  - Email notifications
  - Display preferences

## Step 4: Assign to Collections (Optional)
Give access to specific collections:
- Make collections public, or
- Share collections via \`share_collection\`

## Step 5: Approve User (If Required)
If approval workflow is enabled:
- Use \`approve_user\` to activate the account

## Step 6: Notify User
Send welcome email with:
- Login credentials
- System URL
- Getting started guide

## Permission Levels Reference
Common user groups:
- Super Admin: Full system access
- Admin: User management, configuration
- General: Standard user access
- Restricted: Limited access

What specific permissions does this ${role} need?`;
      },
    },
    {
      name: 'system_health_check_workflow',
      description: 'Monitor and maintain system health',
      arguments: [],
      handler: async () => {
        return `# System Health Check Workflow

Let me guide you through checking ResourceSpace system health.

## Step 1: System Information
Check basic system info:
- Use \`get_system_info\` for version, PHP, MySQL info
- Review installed plugins with \`get_plugins\`

## Step 2: Resource Statistics
Review resource usage:
- Use \`get_resource_stats\` for resource counts
- Check storage usage and growth trends

## Step 3: Job Queue Status
Monitor background jobs:
- Use \`get_job_queue\` to see pending jobs
- If needed, use \`clear_job_queue\` to clear stuck jobs

## Step 4: Activity Monitoring
Review recent activity:
- Use \`get_activity_log\` to see recent actions
- Look for unusual patterns or errors

## Step 5: User Activity
Check user engagement:
- Use \`get_users\` to see active users
- Review \`get_user_activity\` for specific users

## Step 6: Cache Management
Optimize performance:
- Use \`clear_cache\` if experiencing slowness
- Consider periodic cache clearing

## Step 7: Reindexing (If Needed)
If search results seem incorrect:
- Use \`reindex_resources\` to rebuild search index
- Can target specific resources or reindex all

## Step 8: Configuration Review
Check critical settings:
- Use \`get_config_options\` to review configuration
- Verify backup settings, email settings, etc.

## Warning Signs to Look For
- Growing job queue that doesn't clear
- High number of pending user accounts
- Unusual spikes in resource creation
- Error patterns in activity log

Would you like to proceed with the health check?`;
      },
    },
  ];
}

