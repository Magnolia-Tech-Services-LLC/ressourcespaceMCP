# ResourceSpace MCP Server

A comprehensive Model Context Protocol (MCP) server that provides full access to the ResourceSpace Digital Asset Management (DAM) API. This server exposes 100+ ResourceSpace API endpoints as MCP tools, along with browsable resources and workflow prompts.

## 🎯 Multi-Server Architecture

For optimal performance, the ResourceSpace MCP is split into **4 modular servers**:

- **Main Server** (44 tools) - Core DAM operations
- **Admin Server** (18 tools) - User & system management  
- **IIIF Server** (5 tools) - IIIF image protocol
- **Consent Manager Server** (8 tools) - Consent management plugin

**Total: 75 tools** (all servers under the recommended 80-tool limit for Cursor IDE)

👉 **See [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md) for complete setup instructions**

## Features

- **75 MCP Tools**: Consolidated, efficient coverage of ResourceSpace API
  - **Main Server (44 tools)**: Resources (8), Search (7), Collections (8), Metadata (12), Batch (9)
  - **Admin Server (18 tools)**: Users (8), System Operations (10)
  - **IIIF Server (5 tools)**: IIIF protocol support
  - **Consent Server (8 tools)**: Consent management
  - CRUD operations consolidated using action parameters for optimal performance

- **MCP Resources**: Browsable URI-based access to assets and collections
  - `resource://assets/{id}` - Asset details
  - `resource://assets/search?query={q}` - Search results
  - `resource://collections/{id}` - Collection contents
  - And more...

- **MCP Prompts**: Workflow templates for common tasks
  - Asset Upload Workflow
  - Search & Filter Workflow
  - Collection Management
  - Metadata Enrichment
  - User Onboarding
  - System Health Check

## Installation from GitHub

### Prerequisites

- Node.js 18+ and npm
- A ResourceSpace instance with API access
- ResourceSpace API credentials (user and API key)

### Quick Install

```bash
# Clone the repository
git clone https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP.git
cd ressourcespaceMCP

# Install dependencies and build (auto-builds via postinstall)
npm install

# Install globally to make commands available everywhere
npm link
```

That's it! The servers are now available as global commands.

### Available Commands

After installation, you have access to 4 MCP servers:

- `resourcespace-mcp-server` - **Main Server** (44 tools) - Core DAM operations
- `resourcespace-admin-mcp` - **Admin Server** (18 tools) - User & system management
- `resourcespace-iiif-mcp` - **IIIF Server** (5 tools) - IIIF image protocol
- `resourcespace-consent-mcp` - **Consent Manager** (8 tools) - Consent plugin

## Configuration

### Cursor IDE Configuration

Add to your Cursor MCP config file (`~/.cursor/mcp.json` or `.cursor/mcp.json` in your project):

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
    }
  }
}
```

### Claude Desktop Configuration

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

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

**Note:** You can enable any combination of the 4 servers. Most users only need the main server.

### Getting Your API Key

1. Log into your ResourceSpace instance
2. Go to **User Preferences** → **API Keys**
3. Generate a new API key
4. Copy the key and use it in your configuration

See [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md) for detailed setup instructions and use cases for each server.

## API Coverage

### Resource Management Tools

| Tool | Description |
|------|-------------|
| `get_resource_data` | Get comprehensive data for a resource |
| `get_resource_field_data` | Get specific field data |
| `get_resource_path` | Get file path/URL for a resource |
| `create_resource` | Create a new resource |
| `update_field` | Update metadata field value |
| `delete_resource` | Delete a resource |
| `get_resource_types` | Get all resource types |
| `get_alternative_files` | Get alternative files for a resource |
| `add_alternative_file` | Add alternative file |
| `delete_alternative_file` | Remove alternative file |
| `get_resource_access` | Get access level |
| `upload_file` | Upload file to resource |
| `copy_resource` | Duplicate a resource |
| `get_resource_type_fields` | Get fields for resource type |
| `revert_resource_to_alternative` | Replace with alternative file |
| `get_related_resources` | Get related resources |
| `add_resource_nodes` | Add keywords/categories |
| `delete_resource_nodes` | Remove keywords/categories |
| `get_resource_log` | Get activity log |
| `resource_download` | Log download event |

### Search & Discovery Tools

| Tool | Description |
|------|-------------|
| `do_search` | Perform resource search |
| `get_search_results` | Get search results with options |
| `search_get_previews` | Get preview information |
| `get_recent_resources` | Get recently added resources |
| `search_public_collections` | Search public collections |
| `get_search_filter_nodes` | Get available filters |
| `get_resource_collections` | Get collections for resource |
| `get_themes` | Get search themes |
| `search_advanced` | Advanced field-specific search |
| `get_facets` | Get faceted search options |
| `get_keywords` | Get keyword suggestions |
| `get_smart_themes` | Get smart theme collections |
| `get_featured_collections` | Get featured collections |

### Collections Management Tools

| Tool | Description |
|------|-------------|
| `get_collections` | Get all collections |
| `get_collection` | Get collection details |
| `get_collection_resources` | Get resources in collection |
| `create_collection` | Create new collection |
| `delete_collection` | Delete collection |
| `add_resource_to_collection` | Add resource to collection |
| `remove_resource_from_collection` | Remove resource from collection |
| `update_collection` | Update collection properties |
| `get_public_collections` | Get public collections |
| `share_collection` | Share via email |
| `get_collection_external_access` | Get external access keys |
| `create_collection_external_access` | Create external access |
| `delete_collection_external_access` | Delete external access |
| `collection_email` | Email collection details |
| `get_collection_log` | Get activity log |
| `copy_collection` | Duplicate collection |
| `add_collection_smart_search` | Convert to smart collection |
| `get_theme_category_collections` | Get theme category collections |
| `order_collection_resources` | Set custom order |

### Metadata & Fields Tools

| Tool | Description |
|------|-------------|
| `get_resource_type_fields` | Get metadata fields |
| `get_resource_field_data` | Get field data |
| `update_field` | Update field value |
| `copy_field` | Copy field between resources |
| `get_field_data` | Get field information |
| `create_resource_field` | Create new field |
| `update_resource_field` | Update field configuration |
| `delete_resource_field` | Delete field |
| `get_nodes` | Get field nodes/options |
| `get_node` | Get node details |
| `create_node` | Create dropdown option |
| `update_node` | Update node value |
| `delete_node` | Delete node |
| `get_resource_nodes` | Get resource's nodes |
| `add_resource_nodes` | Add nodes to resource |
| `delete_resource_nodes` | Remove nodes |
| `get_field_options` | Get dropdown options |
| `copy_resource_metadata` | Copy all metadata |
| `get_exif_data` | Get EXIF metadata |
| `extract_exif_comment` | Parse EXIF comments |
| `update_resource_type` | Change resource type |
| `get_field_values` | Get distinct field values |
| `validate_field_value` | Validate field value |

### User Management Tools

| Tool | Description |
|------|-------------|
| `get_users` | Get all users |
| `get_user` | Get user details |
| `create_user` | Create new user |
| `update_user` | Update user account |
| `delete_user` | Delete user |
| `get_usergroups` | Get user groups |
| `get_usergroup` | Get group details |
| `create_usergroup` | Create user group |
| `update_usergroup` | Update user group |
| `delete_usergroup` | Delete user group |
| `get_user_preferences` | Get user preferences |
| `save_user_preferences` | Save preferences |
| `get_user_activity` | Get activity log |
| `get_user_collections` | Get user's collections |
| `approve_user` | Approve pending user |

### System Operations Tools

| Tool | Description |
|------|-------------|
| `get_system_info` | Get system information |
| `get_config_options` | Get configuration options |
| `set_config_option` | Set configuration |
| `get_plugins` | Get installed plugins |
| `get_plugin_config` | Get plugin configuration |
| `set_plugin_config` | Set plugin configuration |
| `get_job_queue` | Get job queue status |
| `clear_job_queue` | Clear job queue |
| `get_resource_stats` | Get resource statistics |
| `get_system_status` | Get system health |
| `clear_cache` | Clear system cache |
| `reindex_resources` | Reindex metadata |
| `get_activity_log` | Get system activity log |

### Batch Operations Tools

| Tool | Description |
|------|-------------|
| `batch_update_field` | Update field for multiple resources |
| `batch_add_to_collection` | Add multiple resources to collection |
| `batch_remove_from_collection` | Remove multiple from collection |
| `batch_delete_resources` | Delete multiple resources |
| `batch_update_archive_status` | Update archive status |
| `batch_copy_field` | Copy field to multiple resources |
| `batch_add_nodes` | Add nodes to multiple resources |
| `batch_delete_nodes` | Remove nodes from multiple |
| `batch_download_resources` | Prepare batch download |
| `batch_email_resources` | Email multiple resources |

## Example Usage

### Searching for Assets

```typescript
// Using the do_search tool
{
  "search": "landscape mountains",
  "restypes": "1,2",
  "archive": 0,
  "per_page": 20,
  "order_by": "relevance"
}
```

### Creating and Populating a Collection

```typescript
// 1. Create collection
{
  "name": "Marketing Campaign 2024",
  "public": false,
  "allow_changes": true
}

// 2. Add resources
{
  "resource_ids": [101, 102, 103],
  "collection_id": 42
}
```

### Batch Updating Metadata

```typescript
// Update copyright field for multiple resources
{
  "resource_ids": [101, 102, 103, 104],
  "field_id": 5,
  "value": "© 2024 Company Name"
}
```

## Authentication

ResourceSpace uses MD5 signature authentication. The server automatically:

1. Constructs query string with user and parameters
2. Generates MD5 hash: `md5(API_KEY + query_string)`
3. Appends signature to request

Example authentication flow:
```
Query: user=admin&function=get_resource_data&param1=123
Sign: md5(YOUR_API_KEY + query_string)
URL: /api/?user=admin&function=get_resource_data&param1=123&sign=abc123...
```

## Error Handling

The server includes comprehensive error handling:

- **Network errors**: Automatic retry with exponential backoff
- **API errors**: Structured error responses with details
- **Validation errors**: Zod schema validation for all inputs
- **Timeout handling**: Configurable request timeouts

## Configuration Options

All configuration via environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESOURCESPACE_URL` | Yes | - | Your ResourceSpace instance URL |
| `RESOURCESPACE_USER` | Yes | - | API username |
| `RESOURCESPACE_API_KEY` | Yes | - | API key/private key |
| `LOG_LEVEL` | No | `info` | Logging level (debug/info/warn/error) |
| `REQUEST_TIMEOUT` | No | `30000` | Request timeout in ms |
| `MAX_RETRIES` | No | `3` | Max retry attempts |
| `RETRY_DELAY` | No | `1000` | Delay between retries in ms |

## Development

### Project Structure

```
ressourcespaceMCP/
├── src/
│   ├── index.ts                 # Main MCP server
│   ├── config.ts                # Configuration management
│   ├── client/
│   │   └── resourcespace.ts     # API client
│   ├── tools/                   # MCP tools
│   │   ├── resources.ts
│   │   ├── search.ts
│   │   ├── collections.ts
│   │   ├── metadata.ts
│   │   ├── users.ts
│   │   ├── system.ts
│   │   └── batch.ts
│   ├── resources/               # MCP resources
│   │   ├── asset-browser.ts
│   │   └── collection-browser.ts
│   ├── prompts/                 # MCP prompts
│   │   └── templates.ts
│   └── types/
│       └── resourcespace.ts     # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Running in Development

```bash
npm run dev
```

## Troubleshooting

### Connection Issues

1. **Verify credentials**: Check URL, username, and API key in `.env`
2. **Test API directly**: Use ResourceSpace's built-in API test tool
3. **Check network**: Ensure server can reach ResourceSpace instance
4. **Review logs**: Check console output for detailed error messages

### API Errors

- **"Invalid signature"**: API key is incorrect
- **"Function not found"**: ResourceSpace version may not support that endpoint
- **"Permission denied"**: User lacks required permissions
- **Timeout errors**: Increase `REQUEST_TIMEOUT` value

## ResourceSpace API Documentation

For detailed information about specific API endpoints, refer to the official ResourceSpace API documentation:
https://www.resourcespace.com/knowledge-base/api/

## License

MIT

## Contributing

Contributions welcome! Please open issues or pull requests on the [GitHub repository](https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP).

## Support

For issues with this MCP server, please [open an issue](https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/issues) on GitHub.

For ResourceSpace API questions, consult the official ResourceSpace documentation.

