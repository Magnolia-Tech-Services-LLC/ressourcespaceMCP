# Changelog

All notable changes to the ResourceSpace MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-13

### Added
- Multi-server architecture with 4 modular MCP servers
- Main server (44 tools) for core DAM operations
- Admin server (18 tools) for user and system management  
- IIIF server (5 tools) for IIIF protocol support
- Consent Manager server (8 tools) for consent plugin operations
- CRUD consolidation using action parameters
- Comprehensive documentation (README, INSTALLATION, QUICK_START, MULTI_SERVER_GUIDE)
- API_MAPPING.md for tool reference
- EXAMPLES.md with usage examples
- Automatic build on install via postinstall script
- Global command installation via npm link

### Changed
- Reduced tool count from 113 to 75 through consolidation (33.6% reduction)
- Authentication now uses SHA256 instead of MD5 for API signatures
- Simplified installation process (clone → install → link)
- Configuration moved from .env files to MCP config files
- All servers stay under 80-tool limit for optimal IDE performance

### Fixed
- API signature generation for ResourceSpace authentication
- URL encoding in query strings for API calls

## [0.1.0] - Initial Development

### Added
- Initial implementation with single MCP server
- 113 individual tools covering ResourceSpace API
- Basic MCP resources and prompts
- TypeScript implementation with type safety
- Environment-based configuration

---

## Release Notes

### v1.0.0 - Multi-Server Architecture

This major release introduces a modular multi-server architecture that dramatically improves performance and usability:

**Performance Improvements:**
- Each server stays well under the 80-tool limit recommended by Cursor IDE
- Main server has only 44 tools (45% below limit)
- Faster tool discovery and selection for AI assistants

**Better Organization:**
- Clear separation between core operations and admin tasks
- Optional IIIF and Consent servers for specialized needs
- Users install only what they need

**Simplified Installation:**
- One-command installation from GitHub
- Automatic build process
- No npm publishing required

**Enhanced Developer Experience:**
- Consolidated CRUD operations reduce API surface
- Consistent action parameter pattern across tools
- Comprehensive documentation and examples

For detailed migration instructions, see [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md).

---

[1.0.0]: https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/releases/tag/v1.0.0
[0.1.0]: https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/releases/tag/v0.1.0

