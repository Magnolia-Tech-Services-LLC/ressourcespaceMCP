# Usage Examples

Practical examples of using the ResourceSpace MCP Server.

## Basic Operations

### 1. Search for Resources

**Search by keyword:**
```json
Tool: do_search
Input: {
  "search": "landscape photography",
  "archive": 0,
  "per_page": 20
}
```

**Advanced search with filters:**
```json
Tool: do_search
Input: {
  "search": "mountains",
  "restypes": "1,2",
  "archive": 0,
  "order_by": "relevance",
  "sort": "DESC"
}
```

### 2. Get Resource Details

**Get full resource data:**
```json
Tool: get_resource_data
Input: {
  "resource_id": 12345
}
```

**Get specific field:**
```json
Tool: get_resource_field_data
Input: {
  "resource_id": 12345,
  "field_id": 8
}
```

### 3. Create and Upload Resource

**Step 1: Create resource:**
```json
Tool: create_resource
Input: {
  "resource_type": 1,
  "archive": 0
}
Response: { "resource_id": "67890" }
```

**Step 2: Update metadata:**
```json
Tool: update_field
Input: {
  "resource_id": 67890,
  "field_id": 8,
  "value": "Beautiful Mountain Landscape"
}
```

**Step 3: Add keywords:**
```json
Tool: add_resource_nodes
Input: {
  "resource_id": 67890,
  "nodes": [101, 102, 103]
}
```

## Collection Management

### 4. Create and Populate Collection

**Create collection:**
```json
Tool: create_collection
Input: {
  "name": "Marketing Campaign Q1 2024",
  "public": false,
  "allow_changes": true
}
Response: { "collection_id": "42" }
```

**Add single resource:**
```json
Tool: add_resource_to_collection
Input: {
  "resource_id": 12345,
  "collection_id": 42
}
```

**Add multiple resources (batch):**
```json
Tool: batch_add_to_collection
Input: {
  "resource_ids": [12345, 12346, 12347, 12348],
  "collection_id": 42
}
```

### 5. Share Collection

**Email collection:**
```json
Tool: share_collection
Input: {
  "collection_id": 42,
  "emails": "colleague@example.com,client@example.com",
  "message": "Please review these assets for the Q1 campaign"
}
```

**Create external access link:**
```json
Tool: create_collection_external_access
Input: {
  "collection_id": 42,
  "access": 0,
  "expires": "2024-12-31"
}
Response: { "access_key": "abc123xyz..." }
```

## Metadata Management

### 6. Update Metadata Fields

**Update single field:**
```json
Tool: update_field
Input: {
  "resource_id": 12345,
  "field_id": 5,
  "value": "© 2024 Company Name"
}
```

**Batch update multiple resources:**
```json
Tool: batch_update_field
Input: {
  "resource_ids": [12345, 12346, 12347],
  "field_id": 5,
  "value": "© 2024 Company Name"
}
```

**Copy metadata between resources:**
```json
Tool: copy_resource_metadata
Input: {
  "from_resource": 12345,
  "to_resource": 12346
}
```

### 7. Work with Field Nodes

**Get available nodes for a field:**
```json
Tool: get_nodes
Input: {
  "field_id": 15
}
```

**Create new node (dropdown option):**
```json
Tool: create_node
Input: {
  "field_id": 15,
  "name": "Wildlife"
}
Response: { "node_id": 205 }
```

**Add nodes to resources:**
```json
Tool: batch_add_nodes
Input: {
  "resource_ids": [12345, 12346],
  "nodes": [205, 206, 207]
}
```

## User Management

### 8. Create New User

```json
Tool: create_user
Input: {
  "username": "jsmith",
  "password": "SecureP@ssw0rd!",
  "fullname": "John Smith",
  "email": "jsmith@example.com",
  "usergroup": 3,
  "comments": "Marketing team member"
}
Response: { "user_id": "123" }
```

### 9. Manage User Groups

**Get all user groups:**
```json
Tool: get_usergroups
Input: {}
```

**Create new group:**
```json
Tool: create_usergroup
Input: {
  "name": "External Contractors",
  "permissions": "restricted"
}
```

## System Operations

### 10. System Health Check

**Get system info:**
```json
Tool: get_system_info
Input: {}
Response: {
  "system_info": {
    "version": "9.6",
    "php_version": "8.1.2",
    "mysql_version": "5.7.33"
  }
}
```

**Check job queue:**
```json
Tool: get_job_queue
Input: {}
```

**Get resource statistics:**
```json
Tool: get_resource_stats
Input: {}
```

### 11. Cache and Maintenance

**Clear cache:**
```json
Tool: clear_cache
Input: {}
```

**Reindex resources:**
```json
Tool: reindex_resources
Input: {}
```

**Clear stuck jobs:**
```json
Tool: clear_job_queue
Input: {}
```

## Advanced Workflows

### 12. Smart Collections

Create a collection that auto-updates based on search criteria:

```json
Tool: create_collection
Input: {
  "name": "Recent Landscape Photos"
}
Response: { "collection_id": "55" }

Tool: add_collection_smart_search
Input: {
  "collection_id": 55,
  "search": "landscape",
  "restypes": "1"
}
```

### 13. Batch Operations

**Update archive status for multiple resources:**
```json
Tool: batch_update_archive_status
Input: {
  "resource_ids": [100, 101, 102, 103],
  "archive_status": 2
}
```

**Delete multiple resources:**
```json
Tool: batch_delete_resources
Input: {
  "resource_ids": [200, 201, 202]
}
```

**Prepare batch download:**
```json
Tool: batch_download_resources
Input: {
  "resource_ids": [12345, 12346, 12347],
  "size": "hpr"
}
Response: { "download_url": "https://..." }
```

## MCP Resources (Browsable URIs)

### 14. Browse Assets

**Get asset details:**
```
URI: resource://assets/12345
```

**Search results:**
```
URI: resource://assets/search?query=landscape
```

**Recent assets:**
```
URI: resource://assets/recent?days=7
```

**Asset metadata:**
```
URI: resource://assets/12345/metadata
```

### 15. Browse Collections

**List all collections:**
```
URI: resource://collections/list
```

**Collection details:**
```
URI: resource://collections/42
```

**Collection resources:**
```
URI: resource://collections/42/resources
```

**Public collections:**
```
URI: resource://collections/public
```

## MCP Prompts (Guided Workflows)

### 16. Use Workflow Prompts

**Asset upload workflow:**
```
Prompt: upload_asset_workflow
Arguments: {
  "resource_type": "image"
}
```

**Search workflow:**
```
Prompt: search_and_filter_workflow
Arguments: {
  "search_goal": "high-resolution product photos"
}
```

**Collection management:**
```
Prompt: collection_management_workflow
Arguments: {
  "collection_purpose": "client presentation"
}
```

## Real-World Scenarios

### Scenario A: Onboard New Marketing Team Member

1. Create user account
2. Add to Marketing user group
3. Share marketing collections
4. Set up user preferences

### Scenario B: Quarterly Asset Review

1. Get recent resources (last 90 days)
2. Create review collection
3. Add flagged resources
4. Share with stakeholders
5. Update metadata based on review

### Scenario C: Brand Asset Organization

1. Create "Brand Assets" collection
2. Search for logo variations
3. Batch update copyright metadata
4. Add brand keywords/categories
5. Create external access for agencies

### Scenario D: Archive Old Campaign

1. Search for campaign resources
2. Create archive collection
3. Batch update archive status
4. Update metadata with archive date
5. Remove from active collections

## Tips and Best Practices

1. **Always get IDs first**: Use search or list tools to find resource/collection/user IDs before operations

2. **Use batch operations**: For multiple resources, batch tools are more efficient than individual calls

3. **Check permissions**: Verify user has appropriate permissions before operations

4. **Validate field IDs**: Use `get_resource_type_fields` to find correct field IDs

5. **Test searches**: Start with simple searches, then add filters incrementally

6. **Monitor activity**: Use log tools to track changes and troubleshoot issues

7. **Use smart collections**: For dynamic grouping, smart collections update automatically

8. **Handle errors gracefully**: Check responses and handle ResourceSpace API errors

9. **Preserve metadata**: When copying resources, preserve important metadata

10. **Regular maintenance**: Use system tools to monitor health and clear caches

