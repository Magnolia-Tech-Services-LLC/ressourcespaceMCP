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
