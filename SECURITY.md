# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these guidelines:

### 🔒 Do NOT

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed
- **Do not** exploit the vulnerability beyond what is necessary to demonstrate it

### ✅ Do

1. **Report privately**: Email security details to the repository maintainers
   - Use GitHub's private security advisory feature if possible
   - Or create a private issue if you're a collaborator

2. **Include details**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)
   - Your contact information

3. **Wait for response**: We will acknowledge receipt within 48 hours and provide a timeline for a fix

### 🛡️ What Happens Next

1. **Acknowledgment**: We confirm receipt of your report (within 48 hours)
2. **Investigation**: We investigate and assess the severity (1-7 days)
3. **Fix Development**: We develop and test a fix (timeline depends on severity)
4. **Disclosure**: We coordinate disclosure timing with you
5. **Release**: We release a patch and publish a security advisory
6. **Credit**: We credit you in the security advisory (if desired)

## Security Considerations

### API Keys

- **Never commit API keys**: Always use environment variables or MCP configuration files
- **Rotate keys**: If you suspect a key has been compromised, regenerate it immediately
- **Least privilege**: Use ResourceSpace accounts with minimal necessary permissions

### Configuration Files

- **Secure storage**: Store MCP configuration files with appropriate permissions
- **No sensitive data in repos**: Never commit files containing API keys
- **Example configs**: Only provide example configurations with placeholder values

### Network Security

- **HTTPS only**: Always use HTTPS URLs for ResourceSpace instances
- **Verify certificates**: Ensure SSL/TLS certificates are valid
- **No proxy credentials**: Don't hardcode proxy credentials if using proxies

### Input Validation

- **Zod validation**: All tool inputs are validated using Zod schemas
- **Parameter sanitization**: User inputs are sanitized before API calls
- **Error messages**: Error messages don't leak sensitive information

## Known Security Considerations

### API Key Exposure

**Risk**: API keys in MCP configuration files are stored in plain text

**Mitigation**:
- Configuration files should have restricted file permissions (chmod 600)
- Keys are not logged or displayed in error messages
- Users should follow ResourceSpace security best practices

### Client-Side Execution

**Risk**: MCP servers run with the privileges of the user's account

**Mitigation**:
- Servers don't execute arbitrary code from ResourceSpace
- All API calls go through validated channels
- Input validation prevents injection attacks

### Rate Limiting

**Risk**: Excessive API calls could impact ResourceSpace performance

**Mitigation**:
- Built-in retry logic with exponential backoff
- Configurable request timeouts
- Users should implement rate limiting at the MCP client level if needed

## Best Practices for Users

### Installation

1. **Verify source**: Only install from official repository
2. **Check dependencies**: Review package.json dependencies
3. **Build from source**: Review code before building

### Configuration

1. **Secure config files**: Set appropriate file permissions
2. **Separate credentials**: Use different API keys per environment
3. **Monitor access**: Regularly review ResourceSpace API usage logs

### Updates

1. **Stay current**: Keep the MCP server updated
2. **Review changelogs**: Check CHANGELOG.md for security fixes
3. **Test updates**: Test in development before production

### ResourceSpace Server

1. **Keep updated**: Ensure your ResourceSpace instance is patched
2. **Access control**: Implement proper user permissions
3. **Audit logs**: Monitor API access logs
4. **Network security**: Use firewalls and network segmentation

## Security Features

### Built-in Protections

- ✅ SHA256 signature authentication (more secure than MD5)
- ✅ Input validation with Zod schemas
- ✅ Type-safe TypeScript implementation
- ✅ No arbitrary code execution
- ✅ Error handling that doesn't leak sensitive data
- ✅ Configurable timeouts to prevent hanging requests

### What We Don't Do

- ❌ Store API keys in the application
- ❌ Log sensitive information
- ❌ Execute arbitrary code from API responses
- ❌ Make requests to unauthorized endpoints

## Disclosure Policy

- We follow **coordinated disclosure**
- Security advisories are published after fixes are released
- We credit security researchers (unless they prefer anonymity)
- We maintain transparency about security issues

## Security Updates

Security updates will be:
- Released as soon as possible after verification
- Announced in GitHub security advisories
- Documented in CHANGELOG.md
- Tagged with security labels in release notes

## Contact

For security issues:
- **GitHub**: Use private security advisory feature
- **Issues**: [https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/security](https://github.com/Magnolia-Tech-Services-LLC/ressourcespaceMCP/security/advisories)

For general security questions or concerns, please open a discussion in the repository.

---

Thank you for helping keep ResourceSpace MCP Server secure! 🔒

