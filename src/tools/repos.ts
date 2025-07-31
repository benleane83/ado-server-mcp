import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure Repos tools
 */
export function registerReposTools(server: McpServer) {
  
  // Tool: List repositories
  server.tool(
    "repos_list",
    "List repositories in the project",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const reposArgs = ["repos", "list", "--output", "json"];
      
      if (args.project) {
        reposArgs.push("--project", args.project);
      }
      
      return await runAzCli(reposArgs, pat!);
    }
  );

  // Tool: Show repository details
  server.tool(
    "repo_show",
    "Show details for a specific repository",
    {
      repository: z.string().describe("Repository name or ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = ["repos", "show", "--repository", args.repository, "--output", "json"];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: Create repository
  server.tool(
    "repos_create",
    "Create a new repository",
    {
      name: z.string().describe("Repository name"),
      detectFormat: z.boolean().optional().describe("Detect file format from first file"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "repos", "create",
        "--name", args.name,
        "--output", "json"
      ];
      
      if (args.detectFormat) {
        createArgs.push("--detect", "true");
      }
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // // Tool: Delete repository
  // server.tool(
  //   "repos_delete",
  //   "Delete a repository",
  //   {
  //     id: z.string().describe("Repository ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const deleteArgs = [
  //       "repos", "delete",
  //       "--id", args.id,
  //       "--yes", // Skip confirmation
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       deleteArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(deleteArgs, pat!);
  //   }
  // );

  // Tool: Update repository
  server.tool(
    "repos_update",
    "Update a repository",
    {
      repository: z.string().describe("Repository name or ID"),
      name: z.string().optional().describe("New repository name"),
      defaultBranch: z.string().optional().describe("Default branch name"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "repos", "update",
        "--repository", args.repository,
        "--output", "json"
      ];
      
      if (args.name) {
        updateArgs.push("--name", args.name);
      }
      if (args.defaultBranch) {
        updateArgs.push("--default-branch", args.defaultBranch);
      }
      if (args.project) {
        updateArgs.push("--project", args.project);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // // Tool: Import repository
  // server.tool(
  //   "repos_import",
  //   "Import a repository",
  //   {
  //     gitSource: z.string().describe("Git source URL"),
  //     name: z.string().describe("Repository name"),
  //     gitServiceEndpoint: z.string().optional().describe("Service endpoint for authentication"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const importArgs = [
  //       "repos", "import", "create",
  //       "--git-source-url", args.gitSource,
  //       "--repository", args.name,
  //       "--output", "json"
  //     ];
      
  //     if (args.gitServiceEndpoint) {
  //       importArgs.push("--git-service-endpoint-id", args.gitServiceEndpoint);
  //     }
  //     if (args.project) {
  //       importArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(importArgs, pat!);
  //   }
  // );

  // Tool: List pull requests
  server.tool(
    "repos_pr_list",
    "List pull requests",
    {
      repository: z.string().optional().describe("Repository name or ID"),
      status: z.enum(["active", "abandoned", "completed", "all"]).optional().describe("PR status filter"),
      createdBy: z.string().optional().describe("Filter by PR creator"),
      reviewer: z.string().optional().describe("Filter by reviewer"),
      sourceBranch: z.string().optional().describe("Filter by source branch"),
      targetBranch: z.string().optional().describe("Filter by target branch"),
      top: z.number().optional().describe("Maximum number of PRs to return"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["repos", "pr", "list", "--output", "json"];
      
      if (args.repository) {
        listArgs.push("--repository", args.repository);
      }
      if (args.status) {
        listArgs.push("--status", args.status);
      }
      if (args.createdBy) {
        listArgs.push("--creator", args.createdBy);
      }
      if (args.reviewer) {
        listArgs.push("--reviewer", args.reviewer);
      }
      if (args.sourceBranch) {
        listArgs.push("--source-branch", args.sourceBranch);
      }
      if (args.targetBranch) {
        listArgs.push("--target-branch", args.targetBranch);
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

  // Tool: Show pull request details
  server.tool(
    "repos_pr_show",
    "Show pull request details",
    {
      id: z.number().describe("Pull request ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "repos", "pr", "show",
        "--id", args.id.toString(),
        "--output", "json"
      ];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: Create pull request
  server.tool(
    "repos_pr_create",
    "Create a pull request",
    {
      repository: z.string().describe("Repository name or ID"),
      sourceBranch: z.string().describe("Source branch name"),
      targetBranch: z.string().describe("Target branch name"),
      title: z.string().describe("Pull request title"),
      description: z.string().optional().describe("Pull request description"),
      reviewers: z.array(z.string()).optional().describe("List of reviewers"),
      workItems: z.array(z.string()).optional().describe("List of work item IDs to link"),
      draft: z.boolean().optional().describe("Create as draft pull request"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "repos", "pr", "create",
        "--repository", args.repository,
        "--source-branch", args.sourceBranch,
        "--target-branch", args.targetBranch,
        "--title", args.title,
        "--output", "json"
      ];
      
      if (args.description) {
        createArgs.push("--description", args.description);
      }
      if (args.reviewers && args.reviewers.length > 0) {
        createArgs.push("--reviewers", args.reviewers.join(" "));
      }
      if (args.workItems && args.workItems.length > 0) {
        createArgs.push("--work-items", args.workItems.join(" "));
      }
      if (args.draft) {
        createArgs.push("--draft", "true");
      }
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Update pull request
  server.tool(
    "repos_pr_update",
    "Update a pull request",
    {
      id: z.number().describe("Pull request ID"),
      title: z.string().optional().describe("New pull request title"),
      description: z.string().optional().describe("New pull request description"),
      status: z.enum(["abandoned", "active", "completed"]).optional().describe("New pull request status"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "repos", "pr", "update",
        "--id", args.id.toString(),
        "--output", "json"
      ];
      
      if (args.title) {
        updateArgs.push("--title", args.title);
      }
      if (args.description) {
        updateArgs.push("--description", args.description);
      }
      if (args.status) {
        updateArgs.push("--status", args.status);
      }
      if (args.project) {
        updateArgs.push("--project", args.project);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // Tool: Set vote on pull request
  server.tool(
    "repos_pr_set_vote",
    "Set vote on a pull request",
    {
      id: z.number().describe("Pull request ID"),
      vote: z.enum(["approve", "approve-with-suggestions", "reject", "reset", "wait-for-author"]).describe("Vote value"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const voteArgs = [
        "repos", "pr", "set-vote",
        "--id", args.id.toString(),
        "--vote", args.vote,
        "--output", "json"
      ];
      
      if (args.project) {
        voteArgs.push("--project", args.project);
      }
      
      return await runAzCli(voteArgs, pat!);
    }
  );

  // Tool: Add reviewers to pull request
  server.tool(
    "repos_pr_reviewer_add",
    "Add reviewers to a pull request",
    {
      id: z.number().describe("Pull request ID"),
      reviewers: z.array(z.string()).describe("List of reviewers to add"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const addArgs = [
        "repos", "pr", "reviewer", "add",
        "--id", args.id.toString(),
        "--reviewers", args.reviewers.join(" "),
        "--output", "json"
      ];
      
      if (args.project) {
        addArgs.push("--project", args.project);
      }
      
      return await runAzCli(addArgs, pat!);
    }
  );

  // Tool: Remove reviewers from pull request
  server.tool(
    "repos_pr_reviewer_remove",
    "Remove reviewers from a pull request",
    {
      id: z.number().describe("Pull request ID"),
      reviewers: z.array(z.string()).describe("List of reviewers to remove"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const removeArgs = [
        "repos", "pr", "reviewer", "remove",
        "--id", args.id.toString(),
        "--reviewers", args.reviewers.join(" "),
        "--output", "json"
      ];
      
      if (args.project) {
        removeArgs.push("--project", args.project);
      }
      
      return await runAzCli(removeArgs, pat!);
    }
  );

  // // Tool: List repository policies
  // server.tool(
  //   "repos_policy_list",
  //   "List repository policies",
  //   {
  //     repository: z.string().describe("Repository name or ID"),
  //     branch: z.string().optional().describe("Branch name to filter policies"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const listArgs = [
  //       "repos", "policy", "list",
  //       "--repository-id", args.repository,
  //       "--output", "json"
  //     ];
      
  //     if (args.branch) {
  //       listArgs.push("--branch", args.branch);
  //     }
  //     if (args.project) {
  //       listArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(listArgs, pat!);
  //   }
  // );

  // // Tool: Show repository policy details
  // server.tool(
  //   "repos_policy_show",
  //   "Show repository policy details",
  //   {
  //     policyId: z.string().describe("Policy ID"),
  //     project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
  //   },
  //   async (args, extra): Promise<MCPToolResponse> => {
  //     const pat = process.env.AZURE_DEVOPS_PAT;
  //     const patError = validatePAT(pat);
  //     if (patError) return patError;
      
  //     const showArgs = [
  //       "repos", "policy", "show",
  //       "--policy-id", args.policyId,
  //       "--output", "json"
  //     ];
      
  //     if (args.project) {
  //       showArgs.push("--project", args.project);
  //     }
      
  //     return await runAzCli(showArgs, pat!);
  //   }
  // );
}
