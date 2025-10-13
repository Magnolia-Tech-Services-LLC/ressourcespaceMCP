# ResourceSpace MCP Multi-Server Guide

## Overview

The ResourceSpace MCP implementation has been split into 4 modular servers for optimal performance:

1. **Main Server** (`resourcespace-mcp-server`) - 44 tools
2. **Admin Server** (`resourcespace-admin-mcp`) - 18 tools
3. **IIIF Server** (`resourcespace-iiif-mcp`) - 5 tools
4. **Consent Manager Server** (`resourcespace-consent-mcp`) - 8 tools

**Total:** 75 tools across 4 servers (each well under the recommended 80 tool limit)

## Why Multiple Servers?

Cursor IDE recommends keeping MCP servers under 80 tools for optimal performance. By splitting functionality into focused servers, you get:

✅ **Better Performance** - Each server stays under the limit
✅ **Modularity** - Install only what you need
✅ **Clear Separation** - Organized by use case
✅ **Easier Maintenance** - Updates are isolated to specific domains

## Server Breakdown

### 1. Main Server (44 tools)
**Purpose:** Core DAM operations for daily use

**Includes:**
- **Resources** (8 tools): `resource`, `resource_path`, `resource_types`, `resource_access`, `resource_log`, `resource_related`, `alternative_files`, `upload_file`
- **Search** (7 tools): `search`, `search_results`, `recent_resources`, `search_collections`, `resource_collections`, `themes`, `keywords`
- **Collections** (8 tools): `collection`, `collection_resources`, `collections`, `public_collections`, `collection_resource`, `collection_share`, `collection_log`, `collection_order`
- **Metadata** (12 tools): Field operations, nodes, EXIF data, type updates
- **Batch Operations** (9 tools): Bulk updates, deletes, archive status changes

**Use this if:** You're doing regular DAM work - managing assets, searching, organizing collections, updating metadata.

### 2. Admin Server (18 tools)
**Purpose:** System administration and user management

**Includes:**
- **User Management** (8 tools): `user`, `users`, `usergroup`, `usergroups`, `user_preferences`, `user_activity`, `user_collections`, `approve_user`
- **System Operations** (10 tools): `system_info`, `system_status`, `config`, `plugins`, `plugin_config`, `job_queue`, `resource_stats`, `cache_clear`, `reindex`, `activity_log`

**Use this if:** You're a system administrator managing users, permissions, system configuration, or troubleshooting.

### 3. IIIF Server (5 tools)
**Purpose:** IIIF (International Image Interoperability Framework) image serving

**Includes:**
- `iiif_manifest` - Get IIIF manifest for a resource
- `iiif_info` - Get IIIF info.json
- `iiif_image` - Get IIIF image with parameters
- `iiif_collection` - Get IIIF collection manifest
- `iiif_search` - IIIF content search

**Use this if:** Your ResourceSpace instance has IIIF enabled and you need to work with IIIF manifests and image APIs.

### 4. Consent Manager Server (8 tools)
**Purpose:** Consent manager plugin operations

**Includes:**
- `consent` - Manage consent records (CRUD)
- `consents` - Get all consent records
- `consents_by_collection` - Get consents for a collection
- `consent_link` - Link consent to resource
- `consent_unlink` - Unlink consent from resource
- `consent_batch_link` - Batch link/unlink operations
- `consent_file_save` - Save consent files
- `licenses` - Get available licenses

**Use this if:** Your ResourceSpace has the Consent Manager plugin installed and you need to manage consent records.

## Configuration

### Single Server Setup (Main Only)

For most users, the main server is sufficient:

```json
{
  "mcpServers": {
    "resourcespace": {
      "command": "resourcespace-mcp-server",
      "env": {
        "RESOURCESPACE_URL": "https://your-instance.com",
        "RESOURCESPACE_USER": "your-email@example.com",
        "RESOURCESPACE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Multi-Server Setup

Enable multiple servers as needed:

```json
{
  "mcpServers": {
    "resourcespace": {
      "command": "resourcespace-mcp-server",
      "env": {
        "RESOURCESPACE_URL": "https://your-instance.com",
        "RESOURCESPACE_USER": "your-email@example.com",
        "RESOURCESPACE_API_KEY": "your-api-key-here"
      }
    },
    "resourcespace-admin": {
      "command": "resourcespace-admin-mcp",
      "env": {
        "RESOURCESPACE_URL": "https://your-instance.com",
        "RESOURCESPACE_USER": "your-email@example.com",
        "RESOURCESPACE_API_KEY": "your-api-key-here"
      }
    },
    "resourcespace-iiif": {
      "command": "resourcespace-iiif-mcp",
      "env": {
        "RESOURCESPACE_URL": "https://your-instance.com",
        "RESOURCESPACE_USER": "your-email@example.com",
        "RESOURCESPACE_API_KEY": "your-api-key-here"
      }
    },
    "resourcespace-consent": {
      "command": "resourcespace-consent-mcp",
      "env": {
        "RESOURCESPACE_URL": "https://your-instance.com",
        "RESOURCESPACE_USER": "your-email@example.com",
        "RESOURCESPACE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Consolidated CRUD Operations

To keep tool counts low, similar operations are consolidated using an `action` parameter:

### Resource Operations
```javascript
// Instead of separate tools (get_resource_data, create_resource, delete_resource)
// Use one tool with actions:
{
  name: "resource",
  action: "get",        // or "create", "delete", "copy"
  resource_id: 123
}
```

### Collection Operations
```javascript
{
  name: "collection",
  action: "get",        // or "create", "update", "delete", "copy"
  collection_id: 456
}
```

### Alternative Files
```javascript
{
  name: "alternative_files",
  action: "get",        // or "add", "delete", "revert"
  resource_id: 123
}
```

### User Management (Admin)
```javascript
{
  name: "user",
  action: "get",        // or "create", "update", "delete"
  user_id: 789
}
```

### System Config (Admin)
```javascript
{
  name: "config",
  action: "get",        // or "set"
  name: "option_name"
}
```

## Recommendations

### For Regular Users
- **Start with:** Main server only
- **Add if needed:** Admin server (if you manage users/system)

### For Administrators
- **Use:** Main + Admin servers
- **Benefit:** Full control without exceeding tool limits

### For IIIF Users
- **Use:** Main + IIIF servers
- **Benefit:** Complete IIIF integration

### For Consent Management
- **Use:** Main + Consent servers
- **Benefit:** Full consent workflow management

## Tool Count Verification

After installation, verify tool counts:

```bash
# Each server should report its tool count on startup
resourcespace-mcp-server
# Output: ResourceSpace Main MCP server running on stdio (44 tools)

resourcespace-admin-mcp
# Output: ResourceSpace Admin MCP server running on stdio (18 tools)
```

## Migration from Single Server

If you're upgrading from the original single-server setup:

1. **Backup your configuration**
2. **Update `.cursor/mcp.json`** to use `resourcespace-mcp-server` (main)
3. **Rebuild**: `npm run build`
4. **Test**: Verify the main server works
5. **Add other servers** as needed

### Tool Name Changes

Most tools remain the same, but CRUD operations are now consolidated:

| Old Tools | New Tool | Action Parameter |
|-----------|----------|------------------|
| `get_resource_data`, `create_resource`, `delete_resource`, `copy_resource` | `resource` | `get`, `create`, `delete`, `copy` |
| `get_collection`, `create_collection`, `update_collection`, `delete_collection` | `collection` | `get`, `create`, `update`, `delete` |
| `get_user`, `create_user`, `update_user`, `delete_user` | `user` | `get`, `create`, `update`, `delete` |

## Troubleshooting

### "Tool not found" Error
- **Cause:** Tool moved to different server
- **Solution:** Check which server has the tool (see breakdown above) and add that server to your config

### Performance Still Slow
- **Check:** Tool count in Cursor
- **Verify:** Each active server is under 80 tools
- **Try:** Disable servers you don't need

### IIIF/Consent Tools Not Working
- **Verify:** Your ResourceSpace instance has the corresponding plugin installed
- **Check:** API key has permissions for that plugin

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Total Tools** | 113 (single server) | 44+18+5+8 = 75 (distributed) |
| **Performance** | Degraded (>80 tools) | Optimal (<80 per server) |
| **Flexibility** | All or nothing | Mix and match |
| **Maintenance** | Monolithic | Modular |
| **Clarity** | Mixed concerns | Clear separation |

## Support

For issues or questions:
- **GitHub Issues:** https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/issues
- **Documentation:** See README.md and other docs in the repo

## License

MIT License - See LICENSE file for details

