import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { spawn } from "child_process";
import dotenv from "dotenv";

dotenv.config();

// Configure Azure DevOps defaults on server startup
async function configureAzureDevOps(): Promise<void> {
  const organization = process.env.AZURE_DEVOPS_ORG;
  const project = process.env.AZURE_DEVOPS_PROJECT;
  
  if (!organization) {
    console.error("AZURE_DEVOPS_ORG not set - skipping az devops configure");
    return;
  }
  
  const configArgs = ["devops", "configure", "--defaults", `organization=${organization}`];
  if (project) {
    configArgs.push(`project=${project}`);
  }
  
  return new Promise((resolve, reject) => {
    let azPath = "az";
    if (process.platform === "win32") {
      azPath = "az.cmd";
    }
    
    const az = spawn(azPath, configArgs, { shell: true });
    let error = "";
    
    az.stderr.on("data", (data) => { error += data.toString(); });
    az.on("close", (code) => {
      if (code === 0) {
        console.error(`Azure DevOps defaults configured: org=${organization}${project ? `, project=${project}` : ''}`);
        resolve();
      } else {
        console.error(`Failed to configure Azure DevOps defaults: ${error}`);
        reject(new Error(`az devops configure failed with code ${code}`));
      }
    });
    
    az.on("error", (err) => {
      console.error(`Error configuring Azure DevOps: ${err.message}`);
      reject(err);
    });
  });
}

const server = new McpServer({
  name: "ado-cli-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Tool: List Azure DevOps projects
server.tool(
  "list_projects",
  "List Azure DevOps projects using az cli (uses configured defaults)",
  {},
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      
      if (!pat) {
        return {
          content: [{ type: "text", text: "AZURE_DEVOPS_PAT not set in environment" }],
          isError: true
        };
      }
      
      // Use az devops defaults (configured at startup) - no need to specify --organization
      return await runAzCli(["devops", "project", "list", "--output", "json"], pat);
    }
);

// Helper to run az cli with PAT
type MCPToolResponse = { content: { type: "text"; text: string }[]; isError?: boolean };
async function runAzCli(args: string[], pat: string): Promise<MCPToolResponse> {
  return new Promise((resolve) => {
    // Set both possible environment variable names for Azure DevOps PAT
    const env = { 
      ...process.env, 
      AZURE_DEVOPS_EXT_PAT: pat,
      AZURE_DEVOPS_PAT: pat
    };
    
    let azPath = "az";
    if (process.platform === "win32") {
      azPath = "az.cmd";
    }
    
    const az = spawn(azPath, args, { env, shell: true });
    let output = "";
    let error = "";
    
    az.stdout.on("data", (data) => { output += data.toString(); });
    az.stderr.on("data", (data) => { error += data.toString(); });
    az.on("close", (code) => {
      if (code === 0) {
        resolve({ content: [{ type: "text", text: output }] });
      } else {
        resolve({ content: [{ type: "text", text: error || `az exited with code ${code}` }], isError: true });
      }
    });
    
    az.on("error", (err) => {
      resolve({ content: [{ type: "text", text: `Error spawning az: ${err.message}` }], isError: true });
    });
  });
}

// Main function to start the server
async function main() {
  try {
    // Configure Azure DevOps defaults before starting the server
    await configureAzureDevOps();
  } catch (error) {
    console.error("Warning: Failed to configure Azure DevOps defaults:", error);
    // Continue starting the server even if configuration fails
  }
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
