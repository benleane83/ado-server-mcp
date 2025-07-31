import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure DevOps Wiki tools
 */
export function registerWikiTools(server: McpServer) {
  
  // Tool: List wikis
  server.tool(
    "wiki_list",
    "List wikis in the project",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["devops", "wiki", "list", "--output", "json"];
      
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Show wiki details
  server.tool(
    "wiki_show",
    "View wiki details",
    {
      wiki: z.string().describe("Wiki name or ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "devops", "wiki", "show",
        "--wiki", args.wiki,
        "--output", "json"
      ];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

//   // Tool: Create wiki
//   server.tool(
//     "wiki_create",
//     "Create a wiki",
//     {
//       name: z.string().describe("Wiki name"),
//       type: z.enum(["projectwiki", "codewiki"]).optional().describe("Wiki type (default: projectwiki)"),
//       project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
//     },
//     async (args, extra): Promise<MCPToolResponse> => {
//       const pat = process.env.AZURE_DEVOPS_PAT;
//       const patError = validatePAT(pat);
//       if (patError) return patError;
      
//       const createArgs = [
//         "devops", "wiki", "create",
//         "--name", args.name,
//         "--output", "json"
//       ];
      
//       if (args.type) {
//         createArgs.push("--type", args.type);
//       }
//       if (args.project) {
//         createArgs.push("--project", args.project);
//       }
      
//       return await runAzCli(createArgs, pat!);
//     }
//   );

//   // Tool: Delete wiki
//   server.tool(
//     "wiki_delete",
//     "Delete a wiki",
//     {
//       wiki: z.string().describe("Wiki name or ID"),
//       project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
//     },
//     async (args, extra): Promise<MCPToolResponse> => {
//       const pat = process.env.AZURE_DEVOPS_PAT;
//       const patError = validatePAT(pat);
//       if (patError) return patError;
      
//       const deleteArgs = [
//         "devops", "wiki", "delete",
//         "--wiki", args.wiki,
//         "--yes", // Skip confirmation
//         "--output", "json"
//       ];
      
//       if (args.project) {
//         deleteArgs.push("--project", args.project);
//       }
      
//       return await runAzCli(deleteArgs, pat!);
//     }
//   );

//   // Tool: Create wiki from repository
//   server.tool(
//     "wiki_create_from_repo",
//     "Create a wiki from a repository", 
//     {
//       name: z.string().describe("Wiki name"),
//       repository: z.string().describe("Repository name or ID"),
//       branch: z.string().optional().describe("Branch name (default: main)"),
//       mappedPath: z.string().optional().describe("Mapped path in repository (default: /)"),
//       project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
//     },
//     async (args, extra): Promise<MCPToolResponse> => {
//       const pat = process.env.AZURE_DEVOPS_PAT;
//       const patError = validatePAT(pat);
//       if (patError) return patError;
      
//       const createArgs = [
//         "devops", "wiki", "create",
//         "--name", args.name,
//         "--type", "codewiki",
//         "--repository", args.repository,
//         "--output", "json"
//       ];
      
//       if (args.branch) {
//         createArgs.push("--version", args.branch);
//       }
//       if (args.mappedPath) {
//         createArgs.push("--mapped-path", args.mappedPath);
//       }
//       if (args.project) {
//         createArgs.push("--project", args.project);
//       }
      
//       return await runAzCli(createArgs, pat!);
//     }
//   );

  // Tool: Create wiki page
  server.tool(
    "wiki_page_create",
    "Add a wiki page",
    {
      wiki: z.string().describe("Wiki name or ID"),
      path: z.string().describe("Page path"),
      content: z.string().describe("Page content (markdown)"),
      comment: z.string().optional().describe("Commit comment"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "devops", "wiki", "page", "create",
        "--wiki", args.wiki,
        "--path", args.path,
        "--content", args.content,
        "--output", "json"
      ];
      
      if (args.comment) {
        createArgs.push("--comment", args.comment);
      }
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Show wiki page
  server.tool(
    "wiki_page_show",
    "View a wiki page",
    {
      wiki: z.string().describe("Wiki name or ID"),
      path: z.string().describe("Page path"),
      version: z.string().optional().describe("Version to show"),
      includeContent: z.boolean().optional().describe("Include page content"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "devops", "wiki", "page", "show",
        "--wiki", args.wiki,
        "--path", args.path,
        "--output", "json"
      ];
      
      if (args.version) {
        showArgs.push("--version", args.version);
      }
      if (args.includeContent) {
        showArgs.push("--include-content");
      }
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

//   // Tool: Update wiki page
//   server.tool(
//     "wiki_page_update",
//     "Edit a wiki page",
//     {
//       wiki: z.string().describe("Wiki name or ID"), 
//       path: z.string().describe("Page path"),
//       content: z.string().describe("New page content (markdown)"),
//       comment: z.string().optional().describe("Commit comment"),
//       version: z.string().optional().describe("Version to update from"),
//       project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
//     },
//     async (args, extra): Promise<MCPToolResponse> => {
//       const pat = process.env.AZURE_DEVOPS_PAT;
//       const patError = validatePAT(pat);
//       if (patError) return patError;
      
//       const updateArgs = [
//         "devops", "wiki", "page", "update",
//         "--wiki", args.wiki,
//         "--path", args.path,  
//         "--content", args.content,
//         "--output", "json"
//       ];
      
//       if (args.comment) {
//         updateArgs.push("--comment", args.comment);
//       }
//       if (args.version) {
//         updateArgs.push("--version", args.version);
//       }
//       if (args.project) {
//         updateArgs.push("--project", args.project);
//       }
      
//       return await runAzCli(updateArgs, pat!);
//     }
//   );

//   // Tool: Delete wiki page
//   server.tool(
//     "wiki_page_delete",
//     "Delete a wiki page",
//     {
//       wiki: z.string().describe("Wiki name or ID"),
//       path: z.string().describe("Page path"),
//       comment: z.string().optional().describe("Commit comment"),
//       project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
//     },
//     async (args, extra): Promise<MCPToolResponse> => {
//       const pat = process.env.AZURE_DEVOPS_PAT;
//       const patError = validatePAT(pat);
//       if (patError) return patError;
      
//       const deleteArgs = [
//         "devops", "wiki", "page", "delete",
//         "--wiki", args.wiki,
//         "--path", args.path,
//         "--yes", // Skip confirmation
//         "--output", "json"
//       ];
      
//       if (args.comment) {
//         deleteArgs.push("--comment", args.comment);
//       }
//       if (args.project) {
//         deleteArgs.push("--project", args.project);
//       }
      
//       return await runAzCli(deleteArgs, pat!);
//     }
//   );
}
