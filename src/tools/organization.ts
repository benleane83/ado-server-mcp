import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure DevOps Organization tools
 */
export function registerOrganizationTools(server: McpServer) {
  
  // Tool: List Azure DevOps projects
  server.tool(
    "list_projects",
    "List Azure DevOps projects using az cli (uses configured defaults)",
    {},
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      // Use az devops defaults (configured at startup) - no need to specify --organization
      return await runAzCli(["devops", "project", "list", "--output", "json"], pat!);
    }
  );

  // Tool: Show project details
  server.tool(
    "project_show",
    "Show details for a specific project",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = ["devops", "project", "show", "--output", "json"];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: List teams
  server.tool(
    "teams_list",
    "List teams in the project",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const teamsArgs = ["devops", "team", "list", "--output", "json"];
      
      if (args.project) {
        teamsArgs.push("--project", args.project);
      }
      
      return await runAzCli(teamsArgs, pat!);
    }
  );

  // Tool: Show team details
  server.tool(
    "team_show",
    "Show details for a specific team",
    {
      team: z.string().describe("Team name or ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const teamArgs = ["devops", "team", "show", "--team", args.team, "--output", "json"];
      
      if (args.project) {
        teamArgs.push("--project", args.project);
      }
      
      return await runAzCli(teamArgs, pat!);
    }
  );

  // Tool: List team members
  server.tool(
    "team_members_list",
    "List members of a team",
    {
      team: z.string().describe("Team name or ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const membersArgs = ["devops", "team", "list-member", "--team", args.team, "--output", "json"];
      
      if (args.project) {
        membersArgs.push("--project", args.project);
      }
      
      return await runAzCli(membersArgs, pat!);
    }
  );

  // // Tool: Create project
  // server.tool(
  //   "project_create",
  //   "Create a new project",
  //   {
  //     name: z.string().describe("Project name"),
  //     description: z.string().optional().describe("Project description"),
  //     visibility: z.enum(["private", "public"]).optional().describe("Project visibility"),
  //     processTemplate: z.string().optional().describe("Process template name"),
  //     sourceControl: z.enum(["git", "tfvc"]).optional().describe("Source control type")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const createArgs = [
  //       "devops", "project", "create",
  //       "--name", args.name,
  //       "--output", "json"
  //     ];
      
  //     if (args.description) {
  //       createArgs.push("--description", args.description);
  //     }
  //     if (args.visibility) {
  //       createArgs.push("--visibility", args.visibility);
  //     }
  //     if (args.processTemplate) {
  //       createArgs.push("--process", args.processTemplate);
  //     }
  //     if (args.sourceControl) {
  //       createArgs.push("--source-control", args.sourceControl);
  //     }
      
  //     return await runAzCli(createArgs, pat!);
  //   }
  // );

  // // Tool: Delete project
  // server.tool(
  //   "project_delete",
  //   "Delete a project",
  //   {
  //     project: z.string().describe("Project name or ID to delete")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "devops", "project", "delete",
  //       "--id", args.project,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // // Tool: Create team
  // server.tool(
  //   "team_create",
  //   "Create a new team",
  //   {
  //     name: z.string().describe("Team name"),
  //     description: z.string().optional().describe("Team description"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const createArgs = [
  //       "devops", "team", "create",
  //       "--name", args.name,
  //       "--output", "json"
  //     ];
      
  //     if (args.description) {
  //       createArgs.push("--description", args.description);
  //     }
  //     if (args.project) {
  //       createArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(createArgs, pat!);
  //   }
  // );

  // // Tool: Delete team
  // server.tool(
  //   "team_delete",
  //   "Delete a team",
  //   {
  //     team: z.string().describe("Team name or ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "devops", "team", "delete",
  //       "--id", args.team,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       deleteArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // // Tool: Update team
  // server.tool(
  //   "team_update",
  //   "Update a team",
  //   {
  //     team: z.string().describe("Team name or ID"),
  //     name: z.string().optional().describe("New team name"),
  //     description: z.string().optional().describe("New team description"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const updateArgs = [
  //       "devops", "team", "update",
  //       "--id", args.team,
  //       "--output", "json"
  //     ];
      
  //     if (args.name) {
  //       updateArgs.push("--name", args.name);
  //     }
  //     if (args.description) {
  //       updateArgs.push("--description", args.description);
  //     }
  //     if (args.project) {
  //       updateArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(updateArgs, pat!);
  //   }
  // );

  // Tool: List users
  server.tool(
    "users_list",
    "List users in the organization",
    {
      top: z.number().optional().describe("Maximum number of users to return"),
      skip: z.number().optional().describe("Number of users to skip")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["devops", "user", "list", "--output", "json"];
      
      if (args.top) {
        listArgs.push("--top", args.top.toString());
      }
      if (args.skip) {
        listArgs.push("--skip", args.skip.toString());
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Show user details
  server.tool(
    "user_show",
    "Show user details",
    {
      user: z.string().describe("User email or ID")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "devops", "user", "show",
        "--user", args.user,
        "--output", "json"
      ];
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // // Tool: Add user to organization
  // server.tool(
  //   "user_add",
  //   "Add a user to the organization",
  //   {
  //     emailId: z.string().describe("User email address"),
  //     licenseType: z.enum(["basic", "stakeholder", "express"]).optional().describe("License type to assign"),
  //     sendEmailInvite: z.boolean().optional().describe("Send email invitation")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const addArgs = [
  //       "devops", "user", "add",
  //       "--email-id", args.emailId,
  //       "--output", "json"
  //     ];
      
  //     if (args.licenseType) {
  //       addArgs.push("--license-type", args.licenseType);
  //     }
  //     if (args.sendEmailInvite !== undefined) {
  //       addArgs.push("--send-email-invite", args.sendEmailInvite.toString());
  //     }
      
  //     return await runAzCli(addArgs, pat!);
  //   }
  // );

  // // Tool: Remove user from organization
  // server.tool(
  //   "user_remove",
  //   "Remove a user from the organization",
  //   {
  //     user: z.string().describe("User email or ID")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const removeArgs = [
  //       "devops", "user", "remove",
  //       "--user", args.user,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     return await runAzCli(removeArgs, pat!);
  //   }
  // );

  // // Tool: Update user
  // server.tool(
  //   "user_update",
  //   "Update a user",
  //   {
  //     user: z.string().describe("User email or ID"),
  //     licenseType: z.enum(["basic", "stakeholder", "express"]).optional().describe("New license type")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const updateArgs = [
  //       "devops", "user", "update",
  //       "--user", args.user,
  //       "--output", "json"
  //     ];
      
  //     if (args.licenseType) {
  //       updateArgs.push("--license-type", args.licenseType);
  //     }
      
  //     return await runAzCli(updateArgs, pat!);
  //   }
  // );

  // // Tool: List extensions
  // server.tool(
  //   "extension_list",
  //   "List installed extensions",
  //   {
  //     includeBuiltIn: z.boolean().optional().describe("Include built-in extensions"),
  //     includeDisabled: z.boolean().optional().describe("Include disabled extensions")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = ["devops", "extension", "list", "--output", "json"];
      
  //     if (args.includeBuiltIn) {
  //       listArgs.push("--include-built-in");
  //     }
  //     if (args.includeDisabled) {
  //       listArgs.push("--include-disabled");
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Show extension details
  // server.tool(
  //   "extension_show",
  //   "Show extension details",
  //   {
  //     publisherId: z.string().describe("Extension publisher ID"),
  //     extensionId: z.string().describe("Extension ID")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const showArgs = [
  //       "devops", "extension", "show",
  //       "--publisher-id", args.publisherId,
  //       "--extension-id", args.extensionId,
  //       "--output", "json"
  //     ];
      
  //     return await runAzCli(showArgs, pat!);
  //   }
  // );

  // // Tool: Install extension
  // server.tool(
  //   "extension_install",
  //   "Install an extension",
  //   {
  //     publisherId: z.string().describe("Extension publisher ID"),
  //     extensionId: z.string().describe("Extension ID")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const installArgs = [
  //       "devops", "extension", "install",
  //       "--publisher-id", args.publisherId,
  //       "--extension-id", args.extensionId,
  //       "--output", "json"
  //     ];
      
  //     return await runAzCli(installArgs, pat!);
  //   }
  // );

  // // Tool: Uninstall extension
  // server.tool(
  //   "extension_uninstall",
  //   "Uninstall an extension",
  //   {
  //     publisherId: z.string().describe("Extension publisher ID"),
  //     extensionId: z.string().describe("Extension ID")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const uninstallArgs = [
  //       "devops", "extension", "uninstall",
  //       "--publisher-id", args.publisherId,
  //       "--extension-id", args.extensionId,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     return await runAzCli(uninstallArgs, pat!);
  //   }
  // );
}
