# Azure DevOps CLI MCP Server

This MCP server wraps Azure DevOps CLI commands and exposes them as MCP tools for AI agents. It supports both **Azure DevOps Services** (cloud) and **Azure DevOps Server** (on-premises) with Personal Access Token (PAT) authentication.

## Key Features

- ✅ **Azure DevOps Services** (dev.azure.com) support
- ✅ **Azure DevOps Server** (on-premises) support  
- ✅ **Automatic CLI Configuration** - Sets organization and project defaults on startup
- ✅ **Cross-platform** - Works on Windows, macOS, and Linux
- ✅ **Secure Authentication** - Uses Azure CLI's standard PAT mechanism

## Prerequisites

- Node.js (v16+) 
- npm
- Azure CLI with DevOps extension: `az extension add --name azure-devops`

## Setup

1. **Install Prerequisites:**
   ```bash
   # Install Azure CLI (if not already installed)
   # Windows: https://aka.ms/installazurecliwindows
   # macOS: brew install azure-cli
   # Linux: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-linux
   
   # Add Azure DevOps extension
   az extension add --name azure-devops
   ```

2. **Clone and Build:**
   ```bash
   git clone <repository-url>
   cd ado-server-mcp
   npm install
   npm run build
   ```

3. **Configure MCP Client:**
   - Add the configuration shown above to your MCP client
   - Replace placeholder values with your actual PAT and organization URL
   - Restart your MCP client to connect to the server

## How It Works

1. **Startup Configuration:** When the server starts, it automatically runs `az devops configure` to set your organization and project as defaults
2. **Tool Execution:** MCP tools use the configured defaults, so you don't need to specify `--organization` or `--project` in individual commands
3. **Authentication:** Your PAT is securely passed to Azure CLI via environment variables

## Configuration

### Environment Variables

The server requires these environment variables to be configured in your MCP client:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `AZURE_DEVOPS_PAT` | ✅ Yes | Personal Access Token for authentication | `your_pat_token_here` |
| `AZURE_DEVOPS_ORG` | ✅ Yes | Organization or server URL | See examples below |
| `AZURE_DEVOPS_PROJECT` | ⚪ Optional | Default project name | `MyProject` |

### Organization URL Examples

**Azure DevOps Services (Cloud):**
```
https://dev.azure.com/yourorg
```

**Azure DevOps Server (On-premises):**
```
https://devops.mycompany.com/DefaultCollection
https://tfs.mycompany.com:8080/tfs/DefaultCollection
```

### MCP Client Configuration

Add this configuration to your MCP client (e.g., VS Code's `mcp.json`):

```json
{
  "servers": {
    "ado-server-mcp": {
      "type": "stdio", 
      "command": "node",
      "args": ["z:/repos/ado-server-mcp/build/index.js"],
      "env": {
        "AZURE_DEVOPS_PAT": "your_pat_token_here",
        "AZURE_DEVOPS_ORG": "https://dev.azure.com/yourorg",
        "AZURE_DEVOPS_PROJECT": "MyProject"
      }
    }
  }
}
```

> **Note:** The `AZURE_DEVOPS_PROJECT` parameter is optional but recommended. When set, it becomes the default project for all Azure CLI commands, eliminating the need to specify `--project` in individual tool calls.

## Available Tools

### `list_projects`
Lists all Azure DevOps projects in your organization.

**Usage:** Simply call the tool - it uses your configured organization defaults.

**Returns:** JSON array of projects with details including:
- Project name, ID, and description  
- State (wellFormed, etc.)
- Visibility (private/public)
- Last update time

**Example Response:**
```json
{
  "value": [
    {
      "id": "47dbf6d4-c346-44b9-a338-b335b317018f",
      "name": "MyProject", 
      "description": "My awesome project",
      "state": "wellFormed",
      "visibility": "private"
    }
  ]
}
```

## Development

- **Build**: `npm run build` - Compiles TypeScript to `build/`
- **Start**: `npm run start` - Runs the MCP server in stdio mode
- **Debug**: Check MCP client logs for connection issues

## Adding New Tools

Follow this pattern in `src/index.ts`:

```typescript
server.tool("tool_name", "Description", {}, async (args, extra): Promise<MCPToolResponse> => {
  const pat = process.env.AZURE_DEVOPS_PAT;
  
  if (!pat) {
    return {
      content: [{ type: "text", text: "AZURE_DEVOPS_PAT not set in environment" }],
      isError: true
    };
  }
  
  // Use configured defaults - no need to specify --organization or --project
  return await runAzCli(["devops", "your-command", "--output", "json"], pat);
});
```

**Key Points:**
- ✅ Always validate the PAT environment variable
- ✅ Use `--output json` for structured responses
- ✅ Leverage configured defaults (no need for `--organization` or `--project` flags)
- ✅ Return proper `MCPToolResponse` format with error handling

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Server exited before responding" | stdout pollution | Use `dotenv@^16.x` not `@17.x` |
| "spawn az ENOENT" | Azure CLI not found | Ensure Azure CLI is installed and in PATH |
| Authentication errors | Invalid PAT or permissions | Verify PAT has appropriate Azure DevOps permissions |
| "Organization not found" | Wrong organization URL | Check URL format for your ADO type (Services vs Server) |
| "Project not found" | Invalid project name | Verify project exists and PAT has access |

### Debug Tips

1. **Check MCP Client Logs:** Look for connection and tool execution errors
2. **Test Azure CLI Manually:** Run `az devops project list` to verify CLI setup
3. **Validate Environment Variables:** Ensure PAT and organization URL are correct
4. **Server Configuration:** Check startup logs for Azure DevOps configuration status

### PAT Permissions

Your Personal Access Token needs these scopes:
- **Project and Team:** Read (minimum)
- **Work Items:** Read (if working with work items)
- **Code:** Read (if working with repositories)
- **Build:** Read (if working with pipelines)

## Security

- PAT tokens are passed via environment variables, never logged
- `.env` files are gitignored to prevent accidental commits
- Authentication is handled through Azure CLI's standard mechanisms

## References
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Concepts](https://modelcontextprotocol.io/quickstart/server)
- [Azure DevOps CLI Docs](https://learn.microsoft.com/en-us/cli/azure/devops)
