# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResourceSpace MCP Server — a TypeScript Model Context Protocol implementation providing ~30 consolidated tools for interacting with the ResourceSpace Digital Asset Management (DAM) API. Split into 2 servers to stay under the 80-tool-per-server IDE limit.

## Commands

```bash
npm run build          # Compile TypeScript (tsc) — also runs automatically via postinstall
npm run dev            # Run main server in dev mode (tsx src/index.ts)
npm run watch          # Watch mode with tsx
npm run start          # Run compiled main server (node dist/index.js)
npm link               # Install globally — exposes both CLI commands
```

No automated test suite exists. Verify changes by building (`npm run build`) and testing each affected server against a live ResourceSpace instance.

## Architecture

### Multi-Server Design

Two independent MCP servers, each with its own entry point:

| Server | Entry Point | CLI Command | Domains |
|--------|-------------|-------------|---------|
| Main | `src/index.ts` | `resourcespace-mcp-server` | resources, search, collections, metadata, batch, IIIF |
| Admin | `src/index-admin.ts` | `resourcespace-admin-mcp` | users, groups, system, consent |

### Key Design Patterns

**Consolidated CRUD tools** — Instead of separate get/create/delete/copy tools, a single tool uses an `action` parameter. This keeps tool counts low.

**Tool definition pattern** — Each tool is an `MCPTool` object (`src/tools/shared/types.ts`) with `name`, `description`, `inputSchema` (Zod schema), and `handler`. Tools are grouped by domain in files under `src/tools/{server}/`, aggregated by each server's `index.ts`.

**API client** — `src/client/resourcespace.ts` handles all HTTP calls via Axios. Authentication uses SHA256 signing: `sha256(apiKey + queryString)`. Includes automatic retry with exponential backoff for transient errors.

**Configuration** — `src/config.ts` validates env vars with Zod. Required: `RESOURCESPACE_URL`, `RESOURCESPACE_USER`, `RESOURCESPACE_API_KEY`. Optional: `LOG_LEVEL`, `REQUEST_TIMEOUT`, `MAX_RETRIES`, `RETRY_DELAY`.

**Server startup flow** — Each entry point: loads config → creates `ResourceSpaceClient` → builds tools via factory functions → registers MCP handlers (ListTools, CallTool, ListResources, ReadResource, ListPrompts, GetPrompt) → tests API connection → connects to stdio transport.

### Code Organization

```
src/
├── client/resourcespace.ts    # API client (SHA256 auth, retry logic)
├── config.ts                  # Zod-validated env config
├── types/resourcespace.ts     # Shared TypeScript types & Zod schemas
├── tools/
│   ├── shared/types.ts        # MCPTool interface
│   ├── main/                  # Main server: resources, search, collections, metadata, batch
│   ├── admin/                 # Admin server: users, system
│   ├── iiif/                  # IIIF tools (included in main server)
│   └── consent/               # Consent tools (included in admin server)
├── resources/                 # MCP Resources (URI-based asset/collection browsing)
├── prompts/                   # MCP Prompts (workflow templates)
├── index.ts                   # Main server entry
└── index-admin.ts             # Admin server entry
```

## TypeScript Conventions

- ES modules (`"type": "module"`) — use explicit `.js` extensions in imports for Node16 module resolution
- Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- Target: ES2022, Module: Node16
- Zod for both runtime validation and type inference (`z.infer<typeof schema>`)
- 2-space indentation, 120-char max line length (see `.editorconfig`)
- Conventional commits: `type(scope): description` (feat, fix, docs, refactor, test, chore)

## Constraints

- Each server must stay **under 80 tools** — consolidate with action parameters when adding new tools
- No CommonJS — this is a pure ES module project
- Requires Node.js 18+, npm 9+
