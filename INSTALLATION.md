# Installation Guide

This guide covers installation of the ResourceSpace MCP servers directly from GitHub.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Access to a ResourceSpace instance with API enabled
- ResourceSpace API credentials (user email and API key)

## Quick Install from GitHub

```bash
# Clone the repository
git clone https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP.git
cd ressourcespaceMCP

# Install dependencies and build (auto-builds via postinstall)
npm install

# Install globally to make commands available everywhere
npm link
```

That's it! You now have access to all 4 MCP servers.

## Available Servers

After installation, these commands are available:

- `resourcespace-mcp-server` - **Main Server** (44 tools)
  - Core DAM operations: resources, search, collections, metadata, batch
  
- `resourcespace-admin-mcp` - **Admin Server** (18 tools)
  - User management, system administration
  
- `resourcespace-iiif-mcp` - **IIIF Server** (5 tools)
  - IIIF image protocol support
  
- `resourcespace-consent-mcp` - **Consent Manager** (8 tools)
  - Consent manager plugin operations

## Configuration

### For Cursor IDE

Create or edit `~/.cursor/mcp.json` (or `.cursor/mcp.json` in your project):

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

### For Claude Desktop

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

## Getting Your API Key

1. Log into your ResourceSpace instance
2. Navigate to **User Preferences** → **API Keys**
3. Click **Generate New API Key**
4. Copy the generated key
5. Use it in your MCP configuration

## Verify Installation

Test that the servers are working:

```bash
# The servers will show their tool count on startup
resourcespace-mcp-server
# Should output: ResourceSpace Main MCP server running on stdio (44 tools)
```

Press `Ctrl+C` to stop the test.

## Which Servers Do I Need?

### Most Users (Start Here)
Install the **Main Server** only - it has everything you need for daily DAM operations.

### System Administrators
Add the **Admin Server** if you need to manage users, usergroups, or system configuration.

### IIIF Users
Add the **IIIF Server** if your ResourceSpace instance has IIIF enabled and you work with IIIF manifests.

### Consent Management
Add the **Consent Manager Server** if your ResourceSpace has the Consent Manager plugin installed.

See [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md) for detailed information about each server.

## Updating

To update to the latest version:

```bash
cd ressourcespaceMCP
git pull
npm install
```

The `postinstall` script will automatically rebuild the project.

## Uninstalling

```bash
# Unlink globally
npm unlink -g resourcespace-mcp-server

# Remove the directory
cd ..
rm -rf ressourcespaceMCP
```

## Troubleshooting

### "command not found" Error

If you get a "command not found" error after `npm link`:

1. Make sure `npm link` completed successfully
2. Check that your npm global bin directory is in your PATH:
   ```bash
   npm config get prefix
   ```
3. The bin directory should be in your PATH (usually `/usr/local/bin` or similar)

### Build Errors

If you get build errors during `npm install`:

1. Make sure you have Node.js 18 or higher:
   ```bash
   node --version
   ```
2. Clear npm cache and try again:
   ```bash
   npm cache clean --force
   npm install
   ```

### Connection Errors

If the server starts but can't connect to ResourceSpace:

1. Verify your `RESOURCESPACE_URL` is correct (include `https://`)
2. Verify your API key is valid
3. Check that your ResourceSpace instance has API access enabled
4. Test the API manually with curl (see [DEBUGGING_AUTH.md](DEBUGGING_AUTH.md))

## Support

- **Documentation**: See [README.md](README.md) and [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md)
- **Issues**: https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/issues
- **API Reference**: [API_MAPPING.md](API_MAPPING.md)

## Next Steps

After installation:

1. ✅ Configure your MCP client (Cursor or Claude Desktop)
2. ✅ Restart your IDE/application
3. ✅ Test the connection by asking your AI assistant to interact with ResourceSpace
4. ✅ See [EXAMPLES.md](EXAMPLES.md) for usage examples
