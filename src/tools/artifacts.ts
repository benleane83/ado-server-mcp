import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure Artifacts tools
 */
export function registerArtifactsTools(server: McpServer) {
  
  // Tool: List feeds
  server.tool(
    "artifacts_feeds_list",
    "List artifact feeds in the project or organization",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)"),
      scope: z.enum(["project", "organization"]).optional().describe("Scope of feeds to list (default: project)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const feedsArgs = ["artifacts", "universal", "list", "--output", "json"];
      
      if (args.project) {
        feedsArgs.push("--project", args.project);
      }
      if (args.scope) {
        feedsArgs.push("--scope", args.scope);
      }
      
      return await runAzCli(feedsArgs, pat!);
    }
  );

  // Tool: Create feed
  server.tool(
    "artifacts_feed_create",
    "Create an artifact feed",
    {
      name: z.string().describe("Feed name"),
      description: z.string().optional().describe("Feed description"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "artifacts", "universal", "create",
        "--name", args.name,
        "--output", "json"
      ];
      
      if (args.description) {
        createArgs.push("--description", args.description);
      }
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Publish universal package
  server.tool(
    "artifacts_universal_publish",
    "Publish a universal package",
    {
      feed: z.string().describe("Feed name or ID"),
      name: z.string().describe("Package name"),
      version: z.string().describe("Package version"),
      path: z.string().describe("Directory path to publish"),
      description: z.string().optional().describe("Package description"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const publishArgs = [
        "artifacts", "universal", "publish",
        "--feed", args.feed,
        "--name", args.name,
        "--version", args.version,
        "--path", args.path,
        "--output", "json"
      ];
      
      if (args.description) {
        publishArgs.push("--description", args.description);
      }
      if (args.project) {
        publishArgs.push("--project", args.project);
      }
      
      return await runAzCli(publishArgs, pat!);
    }
  );

  // Tool: Download universal package
  server.tool(
    "artifacts_universal_download",
    "Download a universal package",
    {
      feed: z.string().describe("Feed name or ID"),
      name: z.string().describe("Package name"),
      version: z.string().describe("Package version"),
      path: z.string().describe("Directory path to download to"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const downloadArgs = [
        "artifacts", "universal", "download",
        "--feed", args.feed,
        "--name", args.name,
        "--version", args.version,
        "--path", args.path,
        "--output", "json"
      ];
      
      if (args.project) {
        downloadArgs.push("--project", args.project);
      }
      
      return await runAzCli(downloadArgs, pat!);
    }
  );
}
