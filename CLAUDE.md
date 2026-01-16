# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies (auto-builds via postinstall)
npm install

# Build TypeScript to dist/
npm run build

# Development with hot reload
npm run dev

# Watch mode
npm run watch

# Link globally for local testing
npm link
```

## Running the Servers

After building, four MCP server commands are available:

```bash
resourcespace-mcp-server      # Main server (44 tools) - core DAM operations
resourcespace-admin-mcp       # Admin server (18 tools) - user & system management
resourcespace-iiif-mcp        # IIIF server (5 tools) - IIIF image protocol
resourcespace-consent-mcp     # Consent server (8 tools) - consent management
```

Servers require these environment variables:
- `RESOURCESPACE_URL` - ResourceSpace instance URL
- `RESOURCESPACE_USER` - API username
- `RESOURCESPACE_API_KEY` - API key

## Architecture Overview

This is a multi-server MCP implementation for the ResourceSpace DAM API. The codebase is split into 4 modular servers to stay under Cursor IDE's 80-tool limit per server.

### Entry Points

Each server has its own entry point that bootstraps an MCP `Server` instance:
- `src/index.ts` - Main server (includes tools, resources, and prompts)
- `src/index-admin.ts` - Admin server (tools only)
- `src/index-iiif.ts` - IIIF server (tools only)
- `src/index-consent.ts` - Consent server (tools only)

### Core Components

**ResourceSpaceClient** (`src/client/resourcespace.ts`):
- Handles all API communication with ResourceSpace
- Implements SHA256 signature authentication (query string + API key hash)
- Provides `call()` for positional params and `callWithParams()` for named params
- Includes retry logic with exponential backoff for network/5xx errors

**Configuration** (`src/config.ts`):
- Loads from environment variables
- Validates using Zod schemas
- Exports typed `Config` object

### Tool Organization

Tools are defined in `src/tools/` and follow the `MCPTool` interface from `src/tools/shared/types.ts`:

```
src/tools/
├── main/           # Main server tools
│   ├── resources.ts
│   ├── search.ts
│   ├── collections.ts
│   ├── metadata.ts
│   └── batch.ts
├── admin/          # Admin server tools (users.ts, system.ts)
├── iiif/           # IIIF protocol tools
├── consent/        # Consent management tools
└── shared/types.ts # MCPTool interface
```

Each tool module exports a factory function (e.g., `createMainResourceTools(client)`) that returns an array of `MCPTool` objects with:
- `name` - Tool identifier
- `description` - Tool description
- `inputSchema` - Zod schema for validation
- `handler` - Async function that calls the ResourceSpace API

### MCP Resources & Prompts

The main server also exposes:
- **Resources** (`src/resources/`): URI-based access to assets and collections (e.g., `resource://assets/{id}`)
- **Prompts** (`src/prompts/`): Workflow templates for common DAM tasks

### Adding New Tools

1. Choose the appropriate server based on functionality
2. Add tool definition to the relevant module in `src/tools/`
3. Use Zod for input validation
4. Call `client.call()` or `client.callWithParams()` in the handler
5. Keep total tools per server under 80

### TypeScript Configuration

- Target: ES2022, Module: Node16
- Strict mode enabled with additional checks (noUnusedLocals, noImplicitReturns, etc.)
- Output to `dist/` with source maps and declarations
