import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure DevOps Banner Management tools
 */
export function registerBannerTools(server: McpServer) {
  
  // Tool: List banners
  server.tool(
    "banner_list",
    "List banners in the organization",
    {},
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      return await runAzCli(["devops", "admin", "banner", "list", "--output", "json"], pat!);
    }
  );

  // Tool: Show banner details
  server.tool(
    "banner_show",
    "Show banner details",
    {
      id: z.string().describe("Banner ID")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      return await runAzCli([
        "devops", "admin", "banner", "show",
        "--id", args.id,
        "--output", "json"
      ], pat!);
    }
  );

  // Tool: Add banner
  server.tool(
    "banner_add",
    "Add a new banner",
    {
      message: z.string().describe("Banner message"),
      type: z.enum(["error", "info", "warning"]).optional().describe("Banner type (default: info)"),
      expiration: z.string().optional().describe("Banner expiration date (YYYY-MM-DD)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const addArgs = [
        "devops", "admin", "banner", "add",
        "--message", args.message,
        "--output", "json"
      ];
      
      if (args.type) {
        addArgs.push("--type", args.type);
      }
      if (args.expiration) {
        addArgs.push("--expiration", args.expiration);
      }
      
      return await runAzCli(addArgs, pat!);
    }
  );

  // Tool: Update banner
  server.tool(
    "banner_update",
    "Update a banner",
    {
      id: z.string().describe("Banner ID"),
      message: z.string().optional().describe("New banner message"),
      type: z.enum(["error", "info", "warning"]).optional().describe("New banner type"),
      expiration: z.string().optional().describe("New banner expiration date (YYYY-MM-DD)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "devops", "admin", "banner", "update",
        "--id", args.id,
        "--output", "json"
      ];
      
      if (args.message) {
        updateArgs.push("--message", args.message);
      }
      if (args.type) {
        updateArgs.push("--type", args.type);
      }
      if (args.expiration) {
        updateArgs.push("--expiration", args.expiration);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // Tool: Remove banner
  server.tool(
    "banner_remove",
    "Remove a banner",
    {
      id: z.string().describe("Banner ID")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      return await runAzCli([
        "devops", "admin", "banner", "remove",
        "--id", args.id,
        "--yes", // Skip confirmation
        "--output", "json"
      ], pat!);
    }
  );
}
