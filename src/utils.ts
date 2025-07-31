import { spawn } from "child_process";
import { MCPToolResponse } from "./types.js";

/**
 * Helper to run az cli with PAT authentication
 */
export async function runAzCli(args: string[], pat: string): Promise<MCPToolResponse> {
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

/**
 * Validate PAT is available and return error response if not
 */
export function validatePAT(pat: string | undefined): MCPToolResponse | null {
  if (!pat) {
    return {
      content: [{ type: "text", text: "AZURE_DEVOPS_PAT not set in environment" }],
      isError: true
    };
  }
  return null;
}
