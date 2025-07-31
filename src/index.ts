import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { spawn } from "child_process";
import dotenv from "dotenv";
import { registerAllTools } from "./tools/index.js";

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

// Register all Azure DevOps CLI tools
registerAllTools(server);

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
