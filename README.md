# Azure DevOps CLI MCP Server

This MCP server wraps Azure DevOps CLI commands and exposes them as MCP tools for AI agents. It uses Personal Access Token (PAT) authentication and is designed to work seamlessly with VS Code and other MCP clients.

## Prerequisites

- Node.js (v16+) 
- npm
- Azure CLI with DevOps extension: `az extension add --name azure-devops`

## Setup

1. Clone this repository and install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript project:
   ```bash
   npm run build
   ```

3. Configure your MCP client (e.g., VS Code) with environment variables in `mcp.json`:
   ```json
   {
     "servers": {
       "ado-server-mcp": {
         "type": "stdio",
         "command": "node",
         "args": ["z:/repos/ado-server-mcp/build/index.js"],
         "env": {
           "AZURE_DEVOPS_PAT": "your_pat_token_here",
           "AZURE_DEVOPS_ORG": "https://dev.azure.com/yourorg"
         }
       }
     }
   }
   ```

4. Restart your MCP client to connect to the server

## Available Tools

- **`list_projects`** - Lists all Azure DevOps projects in your organization

## Development

- **Build**: `npm run build` - Compiles TypeScript to `build/`
- **Start**: `npm run start` - Runs the MCP server in stdio mode
- **Debug**: Check MCP client logs for connection issues

## Adding New Tools

Follow the pattern in `src/index.ts`:

```typescript
server.tool("tool_name", "Description", {}, async (args, extra): Promise<MCPToolResponse> => {
  const pat = process.env.AZURE_DEVOPS_PAT;
  const org = process.env.AZURE_DEVOPS_ORG;
  
  // Validate environment variables...
  
  return await runAzCli(["devops", "your-command", "--organization", org], pat);
});
```

## Troubleshooting

- **"Server exited before responding"**: Check for stdout pollution (use `dotenv@^16.x` not `@17.x`)
- **"spawn az ENOENT"**: Ensure Azure CLI is installed and in PATH
- **Authentication errors**: Verify your PAT has appropriate permissions and organization URL is correct

## Security

- PAT tokens are passed via environment variables, never logged
- `.env` files are gitignored to prevent accidental commits
- Authentication is handled through Azure CLI's standard mechanisms

## References
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Concepts](https://modelcontextprotocol.io/quickstart/server)
- [Azure DevOps CLI Docs](https://learn.microsoft.com/en-us/cli/azure/devops)
