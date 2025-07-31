import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure Boards tools
 */
export function registerBoardsTools(server: McpServer) {
  
  // Tool: Query work items
  server.tool(
    "boards_query",
    "Query Azure Boards work items using WIQL (Work Item Query Language) or existing query ID/path",
    {
      id: z.string().optional().describe("The ID of an existing query"),
      path: z.string().optional().describe("The path of an existing query (ignored if ID is specified)"),
      wiql: z.string().optional().describe("Work Item Query Language (WIQL) query string (ignored if ID or path specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const queryArgs = ["boards", "query", "--output", "json"];
      
      if (args.id) {
        queryArgs.push("--id", args.id);
      } else if (args.path) {
        queryArgs.push("--path", args.path);
      } else if (args.wiql) {
        queryArgs.push("--wiql", args.wiql);
      } else {
        return {
          content: [{ type: "text", text: "Must specify either 'id', 'path', or 'wiql' parameter" }],
          isError: true
        };
      }
      
      return await runAzCli(queryArgs, pat!);
    }
  );

  // Tool: Show work item details
  server.tool(
    "boards_work_item_show",
    "Show details for a specific work item by ID",
    {
      id: z.number().describe("Work item ID")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      return await runAzCli(["boards", "work-item", "show", "--id", args.id.toString(), "--output", "json"], pat!);
    }
  );

  // Tool: Create work item
  server.tool(
    "boards_work_item_create",
    "Create a new work item",
    {
      type: z.string().describe("Work item type (e.g., 'Bug', 'User Story', 'Task', 'Feature')"),
      title: z.string().describe("Work item title"),
      description: z.string().optional().describe("Work item description"),
      assignedTo: z.string().optional().describe("Assign work item to user (email or display name)"),
      area: z.string().optional().describe("Area path for the work item"),
      iteration: z.string().optional().describe("Iteration path for the work item")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "boards", "work-item", "create",
        "--type", args.type,
        "--title", args.title,
        "--output", "json"
      ];
      
      if (args.description) {
        createArgs.push("--description", args.description);
      }
      if (args.assignedTo) {
        createArgs.push("--assigned-to", args.assignedTo);
      }
      if (args.area) {
        createArgs.push("--area", args.area);
      } 
      if (args.iteration) {
        createArgs.push("--iteration", args.iteration);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Update work item
  server.tool(
    "boards_work_item_update", 
    "Update an existing work item",
    {
      id: z.number().describe("Work item ID to update"),
      title: z.string().optional().describe("New work item title"),
      description: z.string().optional().describe("New work item description"),
      state: z.string().optional().describe("New work item state (e.g., 'New', 'Active', 'Resolved', 'Closed')"),
      assignedTo: z.string().optional().describe("Assign work item to user (email or display name)"),
      area: z.string().optional().describe("Area path for the work item"),
      iteration: z.string().optional().describe("Iteration path for the work item")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "boards", "work-item", "update", 
        "--id", args.id.toString(),
        "--output", "json"
      ];
      
      if (args.title) {
        updateArgs.push("--title", args.title);
      }
      if (args.description) {
        updateArgs.push("--description", args.description);
      }
      if (args.state) {
        updateArgs.push("--state", args.state);
      }
      if (args.assignedTo) {
        updateArgs.push("--assigned-to", args.assignedTo);
      }
      if (args.area) {
        updateArgs.push("--area", args.area);
      }
      if (args.iteration) {
        updateArgs.push("--iteration", args.iteration);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // Tool: Delete work item
  server.tool(
    "boards_work_item_delete",
    "Delete a work item (moves to recycle bin)",
    {
      id: z.number().describe("Work item ID to delete"),
      destroy: z.boolean().optional().describe("Permanently delete instead of moving to recycle bin")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const deleteArgs = [
        "boards", "work-item", "delete",
        "--id", args.id.toString(),
        "--yes", // Skip confirmation prompt
        "--output", "json"
      ];
      
      if (args.destroy) {
        deleteArgs.push("--destroy");
      }
      
      return await runAzCli(deleteArgs, pat!);
    }
  );

  // Tool: List area paths for project
  server.tool(
    "boards_area_list",
    "List area paths for the project",
    {
      depth: z.number().optional().describe("Depth of the area paths to list (default: 1)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["boards", "area", "project", "list", "--output", "json"];
      
      if (args.depth) {
        listArgs.push("--depth", args.depth.toString());
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: List iteration paths for project
  server.tool(
    "boards_iteration_list", 
    "List iteration paths for the project",
    {
      depth: z.number().optional().describe("Depth of the iteration paths to list (default: 1)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["boards", "iteration", "project", "list", "--output", "json"];
      
      if (args.depth) {
        listArgs.push("--depth", args.depth.toString());
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: List work item relation types
  server.tool(
    "boards_work_item_relation_types",
    "List supported work item relation types in the organization",
    {},
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      return await runAzCli(["boards", "work-item", "relation", "list-type", "--output", "json"], pat!);
    }
  );

  // Tool: Add work item relation
  server.tool(
    "boards_work_item_relation_add",
    "Add relation(s) to a work item",
    {
      id: z.number().describe("Work item ID to add relations to"),
      relationName: z.string().describe("Relation type name (e.g., 'parent', 'child', 'related', 'duplicate')"),
      targetId: z.number().describe("Target work item ID for the relation")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      return await runAzCli([
        "boards", "work-item", "relation", "add",
        "--id", args.id.toString(),
        "--relation-type", args.relationName,
        "--target-id", args.targetId.toString(),
        "--output", "json"
      ], pat!);
    }
  );

  // // Tool: Create area path
  // server.tool(
  //   "boards_area_project_create",
  //   "Add a project area path",
  //   {
  //     name: z.string().describe("Area path name"),
  //     path: z.string().optional().describe("Parent area path"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const createArgs = [
  //       "boards", "area", "project", "create",
  //       "--name", args.name,
  //       "--output", "json"
  //     ];
      
  //     if (args.path) {
  //       createArgs.push("--path", args.path);
  //     }
  //     if (args.project) {
  //       createArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(createArgs, pat!);
  //   }
  // );

  // // Tool: Update area path
  // server.tool(
  //   "boards_area_project_update",
  //   "Rename or move an area path",
  //   {
  //     path: z.string().describe("Area path to update"),
  //     name: z.string().optional().describe("New area path name"),
  //     childId: z.string().optional().describe("Move area path under this parent"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const updateArgs = [
  //       "boards", "area", "project", "update",
  //       "--path", args.path,
  //       "--output", "json"
  //     ];
      
  //     if (args.name) {
  //       updateArgs.push("--name", args.name);
  //     }
  //     if (args.childId) {
  //       updateArgs.push("--child-id", args.childId);
  //     }
  //     if (args.project) {
  //       updateArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(updateArgs, pat!);
  //   }
  // );

  // // Tool: Delete area path
  // server.tool(
  //   "boards_area_project_delete",
  //   "Delete an area path",
  //   {
  //     path: z.string().describe("Area path to delete"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "boards", "area", "project", "delete",
  //       "--path", args.path,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       deleteArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // // Tool: Create iteration path
  // server.tool(
  //   "boards_iteration_project_create",
  //   "Add a project iteration",
  //   {
  //     name: z.string().describe("Iteration name"),
  //     path: z.string().optional().describe("Parent iteration path"),
  //     startDate: z.string().optional().describe("Start date (YYYY-MM-DD)"),
  //     finishDate: z.string().optional().describe("Finish date (YYYY-MM-DD)"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const createArgs = [
  //       "boards", "iteration", "project", "create",
  //       "--name", args.name,
  //       "--output", "json"
  //     ];
      
  //     if (args.path) {
  //       createArgs.push("--path", args.path);
  //     }
  //     if (args.startDate) {
  //       createArgs.push("--start-date", args.startDate);
  //     }
  //     if (args.finishDate) {
  //       createArgs.push("--finish-date", args.finishDate);
  //     }
  //     if (args.project) {
  //       createArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(createArgs, pat!);
  //   }
  // );

  // // Tool: Update iteration path
  // server.tool(
  //   "boards_iteration_project_update",
  //   "Rename or move an iteration",
  //   {
  //     path: z.string().describe("Iteration path to update"),
  //     name: z.string().optional().describe("New iteration name"),
  //     childId: z.string().optional().describe("Move iteration under this parent"),
  //     startDate: z.string().optional().describe("Start date (YYYY-MM-DD)"),
  //     finishDate: z.string().optional().describe("Finish date (YYYY-MM-DD)"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const updateArgs = [
  //       "boards", "iteration", "project", "update",
  //       "--path", args.path,
  //       "--output", "json"
  //     ];
      
  //     if (args.name) {
  //       updateArgs.push("--name", args.name);
  //     }
  //     if (args.childId) {
  //       updateArgs.push("--child-id", args.childId);
  //     }
  //     if (args.startDate) {
  //       updateArgs.push("--start-date", args.startDate);
  //     }
  //     if (args.finishDate) {
  //       updateArgs.push("--finish-date", args.finishDate);
  //     }
  //     if (args.project) {
  //       updateArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(updateArgs, pat!);
  //   }
  // );

  // // Tool: List team area paths
  // server.tool(
  //   "boards_area_team_list",
  //   "List team area paths",
  //   {
  //     team: z.string().describe("Team name or ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = [
  //       "boards", "area", "team", "list",
  //       "--team", args.team,
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Set team area paths
  // server.tool(
  //   "boards_area_team_update",
  //   "Set team area paths", 
  //   {
  //     team: z.string().describe("Team name or ID"),
  //     areaPaths: z.array(z.string()).describe("Area paths to set for the team"),
  //     defaultAreaPath: z.string().optional().describe("Default area path"),
  //     includeSubAreaPaths: z.boolean().optional().describe("Include sub area paths"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const updateArgs = [
  //       "boards", "area", "team", "update",
  //       "--team", args.team,
  //       "--area-paths", args.areaPaths.join(","),
  //       "--output", "json"
  //     ];
      
  //     if (args.defaultAreaPath) {
  //       updateArgs.push("--default-area-path", args.defaultAreaPath);
  //     }
  //     if (args.includeSubAreaPaths) {
  //       updateArgs.push("--include-sub-areas", "true");
  //     }
  //     if (args.project) {
  //       updateArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(updateArgs, pat!);
  //   }
  // );

  // // Tool: List team iterations
  // server.tool(
  //   "boards_iteration_team_list",
  //   "List team iterations",
  //   {
  //     team: z.string().describe("Team name or ID"),
  //     timeframe: z.string().optional().describe("Time frame filter"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = [
  //       "boards", "iteration", "team", "list",
  //       "--team", args.team,
  //       "--output", "json"
  //     ];
      
  //     if (args.timeframe) {
  //       listArgs.push("--timeframe", args.timeframe);
  //     }
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Set team iteration paths  
  // server.tool(
  //   "boards_iteration_team_set_backlog_iteration",
  //   "Select team sprints and set the default iteration path",
  //   {
  //     team: z.string().describe("Team name or ID"),
  //     id: z.string().describe("Iteration ID"),
  //     defaultIteration: z.boolean().optional().describe("Set as default iteration"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const setArgs = [
  //       "boards", "iteration", "team", "set-backlog-iteration",
  //       "--team", args.team,
  //       "--id", args.id,
  //       "--output", "json"
  //     ];
      
  //     if (args.defaultIteration) {
  //       setArgs.push("--default-iteration", "true");
  //     }
  //     if (args.project) {
  //       setArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(setArgs, pat!);
  //   }
  // );
}
