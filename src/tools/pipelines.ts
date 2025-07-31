import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure Pipelines tools
 */
export function registerPipelinesTools(server: McpServer) {
  
  // Tool: List pipelines
  server.tool(
    "pipelines_list",
    "List pipelines in the project",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)"),
      name: z.string().optional().describe("Filter pipelines by name"),
      folder: z.string().optional().describe("Filter pipelines by folder path")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const pipelineArgs = ["pipelines", "list", "--output", "json"];
      
      if (args.project) {
        pipelineArgs.push("--project", args.project);
      }
      if (args.name) {
        pipelineArgs.push("--name", args.name);
      }
      if (args.folder) {
        pipelineArgs.push("--folder-path", args.folder);
      }
      
      return await runAzCli(pipelineArgs, pat!);
    }
  );

  // Tool: Show pipeline details
  server.tool(
    "pipeline_show",
    "Show details for a specific pipeline",
    {
      id: z.number().describe("Pipeline ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = ["pipelines", "show", "--id", args.id.toString(), "--output", "json"];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: Create pipeline
  server.tool(
    "pipelines_create",
    "Create a new pipeline",
    {
      name: z.string().describe("Pipeline name"),
      repository: z.string().describe("Repository name"),
      repositoryType: z.enum(["github", "tfsgit", "bitbucket"]).optional().describe("Repository type (default: tfsgit)"),
      branch: z.string().optional().describe("Branch name (default: main)"),
      yamlPath: z.string().optional().describe("Path to YAML file (default: azure-pipelines.yml)"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "pipelines", "create",
        "--name", args.name,
        "--repository", args.repository,
        "--output", "json"
      ];
      
      if (args.repositoryType) {
        createArgs.push("--repository-type", args.repositoryType);
      }
      if (args.branch) {
        createArgs.push("--branch", args.branch);
      }
      if (args.yamlPath) {
        createArgs.push("--yaml-path", args.yamlPath);
      }
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Run pipeline
  server.tool(
    "pipelines_run",
    "Run a pipeline",  
    {
      id: z.number().describe("Pipeline ID"),
      branch: z.string().optional().describe("Branch to run from"),
      commit: z.string().optional().describe("Commit ID to run from"),
      variables: z.record(z.string()).optional().describe("Variables to pass to the pipeline"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const runArgs = [
        "pipelines", "run",
        "--id", args.id.toString(),
        "--output", "json"
      ];
      
      if (args.branch) {
        runArgs.push("--branch", args.branch);
      }
      if (args.commit) {
        runArgs.push("--commit", args.commit);
      }
      if (args.variables) {
        for (const [key, value] of Object.entries(args.variables)) {
          runArgs.push("--variables", `${key}=${value}`);
        }
      }
      if (args.project) {
        runArgs.push("--project", args.project);
      }
      
      return await runAzCli(runArgs, pat!);
    }
  );

  // Tool: Update pipeline
  server.tool(
    "pipelines_update",
    "Update a pipeline",
    {
      id: z.number().describe("Pipeline ID"),
      name: z.string().optional().describe("New pipeline name"),
      description: z.string().optional().describe("New pipeline description"),
      branch: z.string().optional().describe("Default branch"),
      yamlPath: z.string().optional().describe("Path to YAML file"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "pipelines", "update",
        "--id", args.id.toString(),
        "--output", "json"
      ];
      
      if (args.name) {
        updateArgs.push("--name", args.name);
      }
      if (args.description) {
        updateArgs.push("--description", args.description);
      }
      if (args.branch) {
        updateArgs.push("--branch", args.branch);
      }
      if (args.yamlPath) {
        updateArgs.push("--yaml-path", args.yamlPath);
      }
      if (args.project) {
        updateArgs.push("--project", args.project);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // Tool: Delete pipeline
  server.tool(
    "pipelines_delete",
    "Delete a pipeline",
    {
      id: z.number().describe("Pipeline ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const deleteArgs = [
        "pipelines", "delete",
        "--id", args.id.toString(),
        "--yes", // Skip confirmation
        "--output", "json"
      ];
      
      if (args.project) {
        deleteArgs.push("--project", args.project);
      }
      
      return await runAzCli(deleteArgs, pat!);
    }
  );

  // Tool: List pipeline runs
  server.tool(
    "pipelines_runs_list",
    "List pipeline runs",
    {
      pipelineId: z.number().optional().describe("Pipeline ID to filter runs"),
      branch: z.string().optional().describe("Branch name to filter runs"),
      status: z.enum(["completed", "inProgress", "notStarted", "cancelling", "postponed"]).optional().describe("Status to filter runs"),
      top: z.number().optional().describe("Maximum number of runs to return"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["pipelines", "runs", "list", "--output", "json"];
      
      if (args.pipelineId) {
        listArgs.push("--pipeline-ids", args.pipelineId.toString());
      }
      if (args.branch) {
        listArgs.push("--branch", args.branch);
      }
      if (args.status) {
        listArgs.push("--status", args.status);
      }
      if (args.top) {
        listArgs.push("--top", args.top.toString());
      }
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Show pipeline run details
  server.tool(
    "pipelines_runs_show",
    "Show pipeline run details",
    {
      id: z.number().describe("Pipeline run ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "pipelines", "runs", "show",
        "--id", args.id.toString(),
        "--output", "json"
      ];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // // Tool: Add tag to pipeline run
  // server.tool(
  //   "pipelines_runs_tag_add",
  //   "Add tag to pipeline run",
  //   {
  //     runId: z.number().describe("Pipeline run ID"),
  //     tags: z.array(z.string()).describe("Tags to add"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const tagArgs = [
  //       "pipelines", "runs", "tag", "add",
  //       "--run-id", args.runId.toString(),
  //       "--tags", args.tags.join(" "),
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       tagArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(tagArgs, pat!);
  //   }
  // );

  // // Tool: List pipeline run tags
  // server.tool(
  //   "pipelines_runs_tag_list",
  //   "List pipeline run tags",
  //   {
  //     runId: z.number().describe("Pipeline run ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = [
  //       "pipelines", "runs", "tag", "list",
  //       "--run-id", args.runId.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Delete tag from pipeline run
  // server.tool(
  //   "pipelines_runs_tag_delete",
  //   "Delete tag from pipeline run",
  //   {
  //     runId: z.number().describe("Pipeline run ID"),
  //     tag: z.string().describe("Tag to delete"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "pipelines", "runs", "tag", "delete",
  //       "--run-id", args.runId.toString(),
  //       "--tag", args.tag,
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       deleteArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // Tool: List variables
  server.tool(
    "pipelines_variable_list",
    "List variables for a pipeline",
    {
      pipelineId: z.number().describe("Pipeline ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = [
        "pipelines", "variable", "list",
        "--pipeline-id", args.pipelineId.toString(),
        "--output", "json"
      ];
      
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Create variable
  server.tool(
    "pipelines_variable_create",
    "Create a pipeline variable",
    {
      pipelineId: z.number().describe("Pipeline ID"),
      name: z.string().describe("Variable name"),
      value: z.string().describe("Variable value"),
      secret: z.boolean().optional().describe("Mark variable as secret"),
      allowOverride: z.boolean().optional().describe("Allow variable to be overridden at queue time"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "pipelines", "variable", "create",
        "--pipeline-id", args.pipelineId.toString(),
        "--name", args.name,
        "--value", args.value,
        "--output", "json"
      ];
      
      if (args.secret) {
        createArgs.push("--secret", "true");
      }
      if (args.allowOverride) {
        createArgs.push("--allow-override", "true");
      }
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Update variable
  server.tool(
    "pipelines_variable_update",
    "Update a pipeline variable",
    {
      pipelineId: z.number().describe("Pipeline ID"),
      name: z.string().describe("Variable name"),
      value: z.string().optional().describe("New variable value"),
      secret: z.boolean().optional().describe("Mark variable as secret"),
      allowOverride: z.boolean().optional().describe("Allow variable to be overridden at queue time"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "pipelines", "variable", "update",
        "--pipeline-id", args.pipelineId.toString(),
        "--name", args.name,
        "--output", "json"
      ];
      
      if (args.value) {
        updateArgs.push("--value", args.value);
      }
      if (args.secret !== undefined) {
        updateArgs.push("--secret", args.secret.toString());
      }
      if (args.allowOverride !== undefined) {
        updateArgs.push("--allow-override", args.allowOverride.toString());
      }
      if (args.project) {
        updateArgs.push("--project", args.project);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // // Tool: Delete variable
  // server.tool(
  //   "pipelines_variable_delete",
  //   "Delete a pipeline variable",
  //   {
  //     pipelineId: z.number().describe("Pipeline ID"),
  //     name: z.string().describe("Variable name"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "pipelines", "variable", "delete",
  //       "--pipeline-id", args.pipelineId.toString(),
  //       "--name", args.name,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       deleteArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // // Tool: List variable groups
  // server.tool(
  //   "pipelines_variable_group_list",
  //   "List variable groups",
  //   {
  //     groupName: z.string().optional().describe("Filter by variable group name"),
  //     actionFilter: z.enum(["manage", "none", "use"]).optional().describe("Action filter"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = ["pipelines", "variable-group", "list", "--output", "json"];
      
  //     if (args.groupName) {
  //       listArgs.push("--group-name", args.groupName);
  //     }
  //     if (args.actionFilter) {
  //       listArgs.push("--action-filter", args.actionFilter);
  //     }
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Show variable group details
  // server.tool(
  //   "pipelines_variable_group_show",
  //   "Show details for a variable group",
  //   {
  //     id: z.number().describe("Variable group ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const showArgs = [
  //       "pipelines", "variable-group", "show",
  //       "--id", args.id.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       showArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(showArgs, pat!);
  //   }
  // );

  // // Tool: Create variable group
  // server.tool(
  //   "pipelines_variable_group_create",
  //   "Create a variable group",
  //   {
  //     name: z.string().describe("Variable group name"),
  //     description: z.string().optional().describe("Variable group description"),
  //     variables: z.record(z.string()).describe("Variables in key=value format"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const createArgs = [
  //       "pipelines", "variable-group", "create",
  //       "--name", args.name,
  //       "--output", "json"
  //     ];
      
  //     if (args.description) {
  //       createArgs.push("--description", args.description);
  //     }
      
  //     // Add variables
  //     for (const [key, value] of Object.entries(args.variables)) {
  //       createArgs.push("--variables", `${key}=${value}`);
  //     }
      
  //     if (args.project) {
  //       createArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(createArgs, pat!);
  //   }
  // );

  // // Tool: Update variable group
  // server.tool(
  //   "pipelines_variable_group_update",
  //   "Update a variable group",
  //   {
  //     id: z.number().describe("Variable group ID"),
  //     name: z.string().optional().describe("New variable group name"),
  //     description: z.string().optional().describe("New variable group description"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const updateArgs = [
  //       "pipelines", "variable-group", "update",
  //       "--id", args.id.toString(),
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

  // // Tool: Delete variable group
  // server.tool(
  //   "pipelines_variable_group_delete",
  //   "Delete a variable group",
  //   {
  //     id: z.number().describe("Variable group ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "pipelines", "variable-group", "delete",
  //       "--id", args.id.toString(),
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       deleteArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // // Tool: List variable group variables
  // server.tool(
  //   "pipelines_variable_group_variable_list",
  //   "List variables in a variable group",
  //   {
  //     groupId: z.number().describe("Variable group ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = [
  //       "pipelines", "variable-group", "variable", "list",
  //       "--group-id", args.groupId.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Create variable group variable
  // server.tool(
  //   "pipelines_variable_group_variable_create",
  //   "Add variables to a variable group",
  //   {
  //     groupId: z.number().describe("Variable group ID"),
  //     name: z.string().describe("Variable name"),
  //     value: z.string().describe("Variable value"),
  //     secret: z.boolean().optional().describe("Mark variable as secret"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const createArgs = [
  //       "pipelines", "variable-group", "variable", "create",
  //       "--group-id", args.groupId.toString(),
  //       "--name", args.name,
  //       "--value", args.value,
  //       "--output", "json"
  //     ];
      
  //     if (args.secret) {
  //       createArgs.push("--secret", "true");
  //     }
  //     if (args.project) {
  //       createArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(createArgs, pat!);
  //   }
  // );

  // // Tool: Update variable group variable
  // server.tool(
  //   "pipelines_variable_group_variable_update",
  //   "Update variables in a variable group",
  //   {
  //     groupId: z.number().describe("Variable group ID"),
  //     name: z.string().describe("Variable name"),
  //     value: z.string().optional().describe("New variable value"),
  //     secret: z.boolean().optional().describe("Mark variable as secret"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const updateArgs = [
  //       "pipelines", "variable-group", "variable", "update",
  //       "--group-id", args.groupId.toString(),
  //       "--name", args.name,
  //       "--output", "json"
  //     ];
      
  //     if (args.value) {
  //       updateArgs.push("--value", args.value);
  //     }
  //     if (args.secret !== undefined) {
  //       updateArgs.push("--secret", args.secret.toString());
  //     }
  //     if (args.project) {
  //       updateArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(updateArgs, pat!);
  //   }
  // );

  // // Tool: Delete variable group variable
  // server.tool(
  //   "pipelines_variable_group_variable_delete",
  //   "Delete variables from a variable group",
  //   {
  //     groupId: z.number().describe("Variable group ID"),
  //     name: z.string().describe("Variable name"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "pipelines", "variable-group", "variable", "delete",
  //       "--group-id", args.groupId.toString(),
  //       "--name", args.name,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       deleteArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // // Tool: List agent pools
  // server.tool(
  //   "pipelines_pool_list",
  //   "List agent pools",
  //   {
  //     poolName: z.string().optional().describe("Filter by pool name"),
  //     poolType: z.string().optional().describe("Filter by pool type"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = ["pipelines", "pool", "list", "--output", "json"];
      
  //     if (args.poolName) {
  //       listArgs.push("--pool-name", args.poolName);
  //     }
  //     if (args.poolType) {
  //       listArgs.push("--pool-type", args.poolType);
  //     }
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Show agent pool details
  // server.tool(
  //   "pipelines_pool_show",
  //   "Show agent pool details",
  //   {
  //     poolId: z.number().describe("Agent pool ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const showArgs = [
  //       "pipelines", "pool", "show",
  //       "--pool-id", args.poolId.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       showArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(showArgs, pat!);
  //   }
  // );

  // // Tool: List agents
  // server.tool(
  //   "pipelines_agent_list",
  //   "List agents in a pool",
  //   {
  //     poolId: z.number().describe("Agent pool ID"),
  //     agentName: z.string().optional().describe("Filter by agent name"),
  //     includeCapabilities: z.boolean().optional().describe("Include agent capabilities"),
  //     includeAssignedRequest: z.boolean().optional().describe("Include assigned request information"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = [
  //       "pipelines", "agent", "list",
  //       "--pool-id", args.poolId.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.agentName) {
  //       listArgs.push("--agent-name", args.agentName);
  //     }
  //     if (args.includeCapabilities) {
  //       listArgs.push("--include-capabilities");
  //     }
  //     if (args.includeAssignedRequest) {
  //       listArgs.push("--include-assigned-request");
  //     }
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Show agent details
  // server.tool(
  //   "pipelines_agent_show",
  //   "Show agent details",
  //   {
  //     poolId: z.number().describe("Agent pool ID"),
  //     agentId: z.number().describe("Agent ID"),
  //     includeCapabilities: z.boolean().optional().describe("Include agent capabilities"),
  //     includeAssignedRequest: z.boolean().optional().describe("Include assigned request information"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const showArgs = [
  //       "pipelines", "agent", "show",
  //       "--pool-id", args.poolId.toString(),
  //       "--agent-id", args.agentId.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.includeCapabilities) {
  //       showArgs.push("--include-capabilities");
  //     }
  //     if (args.includeAssignedRequest) {
  //       showArgs.push("--include-assigned-request");
  //     }
  //     if (args.project) {
  //       showArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(showArgs, pat!);
  //   }
  // );

  // // Tool: List agent queues
  // server.tool(
  //   "pipelines_queue_list",
  //   "List agent queues",
  //   {
  //     queueName: z.string().optional().describe("Filter by queue name"),
  //     actionFilter: z.enum(["manage", "use", "none"]).optional().describe("Action filter"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = ["pipelines", "queue", "list", "--output", "json"];
      
  //     if (args.queueName) {
  //       listArgs.push("--queue-name", args.queueName);
  //     }
  //     if (args.actionFilter) {
  //       listArgs.push("--action-filter", args.actionFilter);
  //     }
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Show agent queue details
  // server.tool(
  //   "pipelines_queue_show",
  //   "Show agent queue details",
  //   {
  //     queueId: z.number().describe("Agent queue ID"),
  //     actionFilter: z.enum(["manage", "use", "none"]).optional().describe("Action filter"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const showArgs = [
  //       "pipelines", "queue", "show",
  //       "--queue-id", args.queueId.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.actionFilter) {
  //       showArgs.push("--action-filter", args.actionFilter);
  //     }
  //     if (args.project) {
  //       showArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(showArgs, pat!);
  //   }
  // );

  // // Tool: List build artifacts
  // server.tool(
  //   "pipelines_build_artifact_list",
  //   "List build artifacts",
  //   {
  //     buildId: z.number().describe("Build ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = [
  //       "pipelines", "build", "artifact", "list",
  //       "--build-id", args.buildId.toString(),
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Download build artifact
  // server.tool(
  //   "pipelines_build_artifact_download",
  //   "Download build artifacts",
  //   {
  //     buildId: z.number().describe("Build ID"),
  //     artifactName: z.string().describe("Artifact name"),
  //     path: z.string().describe("Local directory path to download to"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const downloadArgs = [
  //       "pipelines", "build", "artifact", "download",
  //       "--build-id", args.buildId.toString(),
  //       "--artifact-name", args.artifactName,
  //       "--path", args.path,
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       downloadArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(downloadArgs, pat!);
  //   }
  // );
}
