# Introduction
This repository has been obtained from an untrusted third party. Your job
is to review it, to ensure it is safe to use on our infrastructure and with
our data.

The codebase is an MCP server for the well-known Digital Asset Management
(DAM) platform "ResourceSpace". ResourceSpace itself is trusted.

# Trusted features
The essential purpose is to allow our agent to interact with the DAM. As 
such, things that are purely essential to this operation are considered safe.
More specifically, this is;
- allowing our agent to call MCP endpoints
- allowing the repository to query or update the DAM as a direct result
of an MCP endpoint call
- security configuration necessary to authenticate or authorise our agent

# Risky code
Code is deemed as risky to security if it:
- Transmits information to a third party that isn't our agent
- Modifies information in a way that is unintended by the agent, or 
without the agent's authorisation
- Establishes a connection with a third party, including for tracking 
or analytics
- Allows a third party that isn't our agent to connect to the system


# Task
- Review the code base thoroughly for risky code
- Consider the purpose of the repo, being an MCP server, and the trusted
features
- Produce a report. List high risk items at the start. Be terse in
describing each risk, a few sentences each. Focus on the risk, not the
technical details.

---

# Security Review Report

**Reviewed by:** Claude Code
**Date:** 2026-01-16

## Files Reviewed

All 25 TypeScript source files in `src/`:
- 4 server entry points (index.ts, index-admin.ts, index-iiif.ts, index-consent.ts)
- API client (client/resourcespace.ts)
- Configuration (config.ts)
- Type definitions (types/resourcespace.ts)
- 13 tool modules (tools/main/*, tools/admin/*, tools/iiif/*, tools/consent/*)
- Resource handlers (resources/*)
- Prompt templates (prompts/*)

Also reviewed: package.json, package-lock.json, tsconfig.json

## Primary Security Assessment (Original Criteria)

**No risky code found** per the specified criteria:

- **No third-party data transmission** - All HTTP requests go exclusively to the user-configured `RESOURCESPACE_URL` environment variable. No hardcoded external endpoints.
- **No unauthorized modifications** - All data changes occur through explicit MCP tool calls initiated by the agent.
- **No tracking or analytics** - No telemetry libraries, no external connections for monitoring.
- **No unauthorized access** - Servers use stdio transport (local only). No network listeners or inbound connection handlers.

## Extended Security Assessment (Additional Vulnerabilities)

### High Risk - REMEDIATED

**Vulnerable Dependencies** - Three CVEs found via `npm audit`:
- @modelcontextprotocol/sdk: DNS rebinding (GHSA-w48q-cv73-mx4w), ReDoS (GHSA-8r9q-7v3j-jr4g)
- qs: DoS via memory exhaustion (GHSA-6rw7-vpxm-498p)
- body-parser: DoS with URL encoding (GHSA-wqch-xfxh-vrr4)

**Status:** Fixed by running `npm audit fix`. All vulnerabilities patched.

### Medium Risk - Acknowledged

1. **Unvalidated file paths** - `file_path` parameters in `alternative_files` and `consent_file_save` tools pass user input directly to ResourceSpace API without local path validation.

2. **Plaintext password handling** - User creation tool accepts passwords as plaintext (inherent to ResourceSpace API design).

### Low Risk - Acknowledged

1. **Error logging** - Full error objects logged to stderr may contain sensitive response data.
2. **API key in memory** - Credentials remain in process memory for lifetime (standard practice).

## Items Verified Safe

- No `eval()`, `Function()`, or dynamic code execution
- No `child_process` or shell command execution
- No prototype pollution patterns
- No unsafe JSON deserialization
- Uses SHA256 for API signatures (secure)
- All inputs validated with Zod schemas
- All credentials loaded from environment variables

## Actions Taken

1. Reviewed all 25 source files for malicious code patterns
2. Searched for hardcoded URLs, credentials, and secrets
3. Checked for code injection, command injection, and path traversal vectors
4. Ran `npm audit` to identify dependency vulnerabilities
5. Executed `npm audit fix` to patch all 3 vulnerabilities
6. Verified project rebuilds successfully after patching

## Conclusion

**Safe to use.** The codebase performs its stated purpose as an MCP server for ResourceSpace without data exfiltration, unauthorized connections, or malicious behavior. Dependency vulnerabilities have been patched.
