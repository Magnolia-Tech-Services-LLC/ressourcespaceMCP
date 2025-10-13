# Contributing to ResourceSpace MCP Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🐛 Reporting Bugs

Before creating a bug report, please check if the issue already exists in our [issue tracker](https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/issues).

When filing a bug report, include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the behavior
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: 
  - OS (macOS, Windows, Linux)
  - Node.js version
  - npm version
  - ResourceSpace version
  - Which MCP server (Main, Admin, IIIF, Consent)
- **Configuration**: Your MCP server configuration (remove sensitive data like API keys)
- **Logs**: Relevant error messages or logs

## 💡 Suggesting Features

We welcome feature suggestions! When proposing a new feature:

1. Check if the feature already exists or has been requested
2. Clearly describe the feature and its benefits
3. Explain the use case(s) it solves
4. Consider which server it belongs to (Main, Admin, IIIF, Consent)
5. If possible, outline implementation approach

## 🔧 Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- A ResourceSpace instance for testing
- Git

### Setup Steps

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/ressourcespaceMCP.git
cd ressourcespaceMCP

# Install dependencies
npm install

# Build the project
npm run build

# Link for local testing
npm link
```

### Project Structure

```
src/
├── client/           # ResourceSpace API client
├── config.ts         # Configuration management
├── types/            # TypeScript type definitions
├── tools/
│   ├── main/         # Main server tools
│   ├── admin/        # Admin server tools
│   ├── iiif/         # IIIF server tools
│   ├── consent/      # Consent manager tools
│   └── shared/       # Shared types
├── resources/        # MCP resources
├── prompts/          # MCP prompts
├── index.ts          # Main server entry point
├── index-admin.ts    # Admin server entry point
├── index-iiif.ts     # IIIF server entry point
└── index-consent.ts  # Consent server entry point
```

## 📝 Pull Request Process

### Before Submitting

1. **Create an issue first** to discuss major changes
2. **Check existing PRs** to avoid duplicate work
3. **Test your changes** with a real ResourceSpace instance
4. **Update documentation** if you change APIs or add features
5. **Follow the coding style** of the existing codebase

### Submission Steps

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our guidelines

3. Build and test:
   ```bash
   npm run build
   # Test each affected server
   resourcespace-mcp-server
   ```

4. Commit with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: clear description of what you did"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to any related issues
   - Screenshots/examples if applicable

### PR Requirements

- ✅ Builds successfully (`npm run build`)
- ✅ All servers start without errors
- ✅ Documentation updated if needed
- ✅ Follows existing code style
- ✅ No breaking changes (unless discussed)
- ✅ Tool count stays under 80 per server

## 🎨 Coding Guidelines

### TypeScript

- Use TypeScript's type system (avoid `any`)
- Define interfaces for complex objects
- Use `async/await` for async operations
- Handle errors appropriately

### Tool Development

When adding new tools:

1. **Choose the right server**: Main, Admin, IIIF, or Consent
2. **Keep tool count low**: Consider consolidating with existing tools
3. **Use action parameters**: For CRUD operations, use consolidated tools
4. **Clear descriptions**: Tool descriptions should be actionable
5. **Input validation**: Use Zod schemas for input validation
6. **Error handling**: Provide helpful error messages

Example tool structure:
```typescript
{
  name: 'tool_name',
  description: 'Clear description of what this tool does',
  inputSchema: z.object({
    param: z.string().describe('Parameter description'),
  }),
  handler: async (args) => {
    // Implementation with error handling
    try {
      const result = await client.call('api_function', args.param);
      return { result };
    } catch (error) {
      throw new Error(`Helpful error message: ${error.message}`);
    }
  },
}
```

### Documentation

- Update README.md for major features
- Add examples to EXAMPLES.md
- Update API_MAPPING.md for new tools
- Keep MULTI_SERVER_GUIDE.md current
- Add entries to CHANGELOG.md

### Commit Messages

Follow conventional commit format:

```
type(scope): brief description

Longer description if needed

Fixes #issue-number
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🧪 Testing

Currently, testing is manual:

1. Build the project: `npm run build`
2. Test each server with your ResourceSpace instance
3. Verify tool functionality through an MCP client (Cursor, Claude)
4. Check that all servers stay under 80 tools

**Future**: We welcome contributions to add automated testing!

## 📚 Documentation

Good documentation is crucial. When contributing:

- Update relevant .md files
- Add examples for new features
- Keep API_MAPPING.md current
- Ensure MULTI_SERVER_GUIDE.md reflects server changes
- Update CHANGELOG.md

## 🚀 Release Process

(For maintainers)

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.x.x`
4. Push tag: `git push origin v1.x.x`
5. Create GitHub release with notes

## 💬 Questions?

- **General questions**: Open a [discussion](https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/discussions)
- **Bug reports**: Create an [issue](https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/issues)
- **Security issues**: See [SECURITY.md](SECURITY.md)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ResourceSpace MCP Server! 🎉

