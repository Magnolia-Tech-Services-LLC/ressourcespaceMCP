# Quick Start Guide

Get started with ResourceSpace MCP Server in under 5 minutes.

## Step 1: Install from GitHub

```bash
# Clone the repository
git clone https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP.git
cd ressourcespaceMCP

# Install and build (auto-builds via postinstall)
npm install

# Make commands available globally
npm link
```

## Step 2: Get Your API Key

1. Log into your ResourceSpace instance
2. Go to **User Preferences** (top right menu)
3. Click on **API Keys** tab
4. Generate a new API key if needed
5. Copy your API key (long alphanumeric string)

## Step 3: Configure for Cursor IDE

Create or edit `~/.cursor/mcp.json`:

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

**Or for Claude Desktop:**

Find your Claude Desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

Use the same JSON structure as above.

## Step 4: Restart Your IDE

- **Cursor**: Restart Cursor IDE
- **Claude Desktop**: Quit and reopen Claude Desktop

Look for the 🔌 icon - you should see "resourcespace" connected.

## Step 5: Try It Out!

Ask your AI assistant to interact with ResourceSpace:

### Search Examples
```
"Search for images with 'landscape' in ResourceSpace"
"Find resources added in the last 7 days"
"Search for resources of type 'Photo'"
```

### Collection Examples
```
"Create a new collection called 'Marketing Assets'"
"Add resource ID 123 to collection 45"
"Show me all public collections"
```

### Resource Examples
```
"Get details for resource ID 100"
"What resource types are available?"
"Show me the metadata fields for resource type 1"
```

### Metadata Examples
```
"Update the title field (field 8) for resource 123 to 'New Title'"
"Copy metadata from resource 100 to resource 101"
```

## Multiple Servers (Optional)

You can enable additional servers for specialized needs:

```json
{
  "mcpServers": {
    "resourcespace": {
      "command": "resourcespace-mcp-server",
      "env": { ... }
    },
    "resourcespace-admin": {
      "command": "resourcespace-admin-mcp",
      "env": { ... }
    }
  }
}
```

**Available servers:**
- `resourcespace-mcp-server` - Main (44 tools) - Daily operations
- `resourcespace-admin-mcp` - Admin (18 tools) - User/system management
- `resourcespace-iiif-mcp` - IIIF (5 tools) - IIIF protocol
- `resourcespace-consent-mcp` - Consent (8 tools) - Consent manager

See [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md) for details on each server.

## Common Issues

### "Command not found"
Run `npm link` again in the project directory to ensure global installation.

### "Failed to connect to ResourceSpace API"
1. Verify `RESOURCESPACE_URL` is correct (include `https://`)
2. Check your API key is valid
3. Ensure your user has API access enabled

### "Permission denied" / 401 errors
- Your user account may lack API permissions
- Verify the API key belongs to the user specified in `RESOURCESPACE_USER`
- Contact your ResourceSpace administrator

### MCP server not appearing
1. Check JSON syntax in your config file (use a JSON validator)
2. Restart your IDE/Claude Desktop completely
3. Check for error messages in the IDE console

### Wrong number of tools showing
Make sure you're using the right server command:
- `resourcespace-mcp-server` should show 44 tools
- `resourcespace-admin-mcp` should show 18 tools

## Verify Installation

Test that a server is working by running it directly:

```bash
resourcespace-mcp-server
# Should output: ResourceSpace Main MCP server running on stdio (44 tools)
```

Press `Ctrl+C` to stop.

## Next Steps

- 📖 Read [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md) to understand each server
- 📚 Check [EXAMPLES.md](EXAMPLES.md) for more usage examples  
- 🔧 See [API_MAPPING.md](API_MAPPING.md) for complete tool reference
- 🐛 Review [DEBUGGING_AUTH.md](DEBUGGING_AUTH.md) if you have connection issues

## Getting Help

- **Issues**: https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/issues
- **Full Documentation**: See [README.md](README.md)

## That's It! 🎉

You're now ready to use ResourceSpace through your AI assistant. Start by asking it to search for resources or create collections!
