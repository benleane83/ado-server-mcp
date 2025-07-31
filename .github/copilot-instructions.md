# Azure DevOps CLI MCP Server

This is a Node.js/TypeScript MCP server that wraps Azure DevOps CLI commands and exposes them as tools for AI agents.

## Architecture

- **MCP Server Pattern**: Uses `@modelcontextprotocol/sdk` with stdio transport for AI integration
- **CLI Wrapper**: Spawns Azure CLI (`az devops`) processes with PAT authentication
- **Environment-Based Config**: Authentication via `AZURE_DEVOPS_PAT` and `AZURE_DEVOPS_ORG` env vars

## Key Files

- `src/index.ts` - Main server logic with tool registration and CLI integration
- `build/index.js` - Compiled output (entry point for MCP connections)
- `.env` - Local PAT storage (gitignored, not for production)

## Development Workflow

```bash
npm run build    # TypeScript compilation to build/
npm run start    # Start MCP server (stdio mode)
```

## MCP Tool Pattern

Tools follow this structure in `src/index.ts`:
```typescript
server.tool("tool_name", "Description", {}, async (args, extra): Promise<MCPToolResponse> => {
  // Validate environment variables
  const pat = process.env.AZURE_DEVOPS_PAT;
  const org = process.env.AZURE_DEVOPS_ORG;
  
  // Call Azure CLI via runAzCli helper
  return await runAzCli(["devops", "command", "--organization", org], pat);
});
```

## Azure CLI Integration

- **Cross-platform**: Uses `az.cmd` on Windows, `az` on Unix
- **Authentication**: Injects both `AZURE_DEVOPS_EXT_PAT` and `AZURE_DEVOPS_PAT` env vars
- **Shell execution**: `{ shell: true }` for proper Windows PATH resolution
- **Error handling**: Returns `MCPToolResponse` with `isError: true` for failures

## MCP Configuration

Environment variables are passed through MCP client config (e.g., VSCode's `mcp.json`):
```json
{
  "servers": {
    "ado-cli-server": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"],
      "env": {
        "AZURE_DEVOPS_PAT": "your_pat_here",
        "AZURE_DEVOPS_ORG": "https://dev.azure.com/yourorg"
      }
    }
  }
}
```

## Critical Constraints

- **No stdout pollution**: MCP protocol breaks if anything other than protocol messages go to stdout
- **Standard dotenv**: Use `dotenv@^16.x`, not `dotenvx@17.x` (causes verbose logging)
- **Windows paths**: Azure CLI may not be in PATH when spawned by Node.js
