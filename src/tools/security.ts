import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure DevOps Security tools
 */
export function registerSecurityTools(server: McpServer) {
  
  // Tool: List security groups
  server.tool(
    "security_group_list",
    "List security groups",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)"),
      subject: z.string().optional().describe("Filter by subject"),
      scope: z.enum(["local", "server"]).optional().describe("Scope of groups to list")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["devops", "security", "group", "list", "--output", "json"];
      
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      if (args.subject) {
        listArgs.push("--subject", args.subject);
      }
      if (args.scope) {
        listArgs.push("--scope", args.scope);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Show security group details
  server.tool(
    "security_group_show",
    "Show details of a security group",
    {
      id: z.string().describe("Security group ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "devops", "security", "group", "show",
        "--id", args.id,
        "--output", "json"
      ];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: Create security group
  server.tool(
    "security_group_create",
    "Create a security group",
    {
      name: z.string().describe("Security group name"),
      description: z.string().optional().describe("Security group description"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "devops", "security", "group", "create",
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

  // Tool: Update security group
  server.tool(
    "security_group_update",
    "Update a security group",
    {
      id: z.string().describe("Security group ID"),
      name: z.string().optional().describe("New security group name"),
      description: z.string().optional().describe("New security group description"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "devops", "security", "group", "update",
        "--id", args.id,
        "--output", "json"
      ];
      
      if (args.name) {
        updateArgs.push("--name", args.name);
      }
      if (args.description) {
        updateArgs.push("--description", args.description);
      }
      if (args.project) {
        updateArgs.push("--project", args.project);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // Tool: Delete security group  
  server.tool(
    "security_group_delete",
    "Delete a security group",
    {
      id: z.string().describe("Security group ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const deleteArgs = [
        "devops", "security", "group", "delete",
        "--id", args.id,
        "--yes", // Skip confirmation
        "--output", "json"
      ];
      
      if (args.project) {
        deleteArgs.push("--project", args.project);
      }
      
      return await runAzCli(deleteArgs, pat!);
    }
  );

  // Tool: Add member to security group
  server.tool(
    "security_group_membership_add",
    "Add a member to a security group",
    {
      groupId: z.string().describe("Security group ID"),
      memberId: z.string().describe("Member ID (user or group)"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const addArgs = [
        "devops", "security", "group", "membership", "add",
        "--group-id", args.groupId,
        "--member-id", args.memberId,
        "--output", "json"
      ];
      
      if (args.project) {
        addArgs.push("--project", args.project);
      }
      
      return await runAzCli(addArgs, pat!);
    }
  );

  // Tool: Remove member from security group
  server.tool(
    "security_group_membership_remove",
    "Remove a member from a security group",
    {
      groupId: z.string().describe("Security group ID"),
      memberId: z.string().describe("Member ID (user or group)"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const removeArgs = [
        "devops", "security", "group", "membership", "remove",
        "--group-id", args.groupId,
        "--member-id", args.memberId,
        "--output", "json"
      ];
      
      if (args.project) {
        removeArgs.push("--project", args.project);
      }
      
      return await runAzCli(removeArgs, pat!);
    }
  );

  // Tool: List memberships for a group or user
  server.tool(
    "security_group_membership_list",
    "List the memberships for a group or user",
    {
      id: z.string().describe("Group or user ID"),
      relationship: z.enum(["members", "memberof"]).optional().describe("Type of relationship to list"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = [
        "devops", "security", "group", "membership", "list",
        "--id", args.id,
        "--output", "json"
      ];
      
      if (args.relationship) {
        listArgs.push("--relationship", args.relationship);
      }
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: List security namespaces
  server.tool(
    "security_permission_namespace_list",
    "List all available namespaces for an organization",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["devops", "security", "permission", "namespace", "list", "--output", "json"];
      
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Show namespace details
  server.tool(
    "security_permission_namespace_show",
    "Show details of permissions available in each namespace",
    {
      namespaceId: z.string().describe("Security namespace ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "devops", "security", "permission", "namespace", "show",
        "--namespace-id", args.namespaceId,
        "--output", "json"
      ];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: List tokens for specified user or group and namespace
  server.tool(
    "security_permission_list",
    "List tokens for specified user or group and namespace",
    {
      id: z.string().describe("User or group ID"),
      namespaceId: z.string().describe("Security namespace ID"),
      token: z.string().optional().describe("Security token"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = [
        "devops", "security", "permission", "list",
        "--id", args.id,
        "--namespace-id", args.namespaceId,
        "--output", "json"
      ];
      
      if (args.token) {
        listArgs.push("--token", args.token);
      }
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Show permissions for specified token, namespace, and user or group
  server.tool(
    "security_permission_show",
    "Show permissions for specified token, namespace, and user or group",
    {
      id: z.string().describe("User or group ID"),
      namespaceId: z.string().describe("Security namespace ID"),
      token: z.string().describe("Security token"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "devops", "security", "permission", "show",
        "--id", args.id,
        "--namespace-id", args.namespaceId,
        "--token", args.token,
        "--output", "json"
      ];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: Update permissions
  server.tool(
    "security_permission_update",
    "Assign allow or deny permission to specified user or group",
    {
      id: z.string().describe("User or group ID"),
      namespaceId: z.string().describe("Security namespace ID"),
      token: z.string().describe("Security token"),
      allowBit: z.number().optional().describe("Allow bit"),
      denyBit: z.number().optional().describe("Deny bit"),
      merge: z.boolean().optional().describe("Merge permissions"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "devops", "security", "permission", "update",
        "--id", args.id,
        "--namespace-id", args.namespaceId,
        "--token", args.token,
        "--output", "json"
      ];
      
      if (args.allowBit !== undefined) {
        updateArgs.push("--allow-bit", args.allowBit.toString());
      }
      if (args.denyBit !== undefined) {
        updateArgs.push("--deny-bit", args.denyBit.toString());
      }
      if (args.merge) {
        updateArgs.push("--merge", "true");
      }
      if (args.project) {
        updateArgs.push("--project", args.project);
      }
      
      return await runAzCli(updateArgs, pat!);
    }
  );

  // Tool: Reset all permissions
  server.tool(
    "security_permission_reset",
    "Clear all permissions of this token for a user or group",
    {
      id: z.string().describe("User or group ID"),
      namespaceId: z.string().describe("Security namespace ID"),
      token: z.string().describe("Security token"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const resetArgs = [
        "devops", "security", "permission", "reset-all",
        "--id", args.id,
        "--namespace-id", args.namespaceId,
        "--token", args.token,
        "--output", "json"
      ];
      
      if (args.project) {
        resetArgs.push("--project", args.project);
      }
      
      return await runAzCli(resetArgs, pat!);
    }
  );

  // Tool: Reset permission for specified permission bit(s)
  server.tool(
    "security_permission_reset_bit",
    "Reset permission for specified permission bit(s)",
    {
      id: z.string().describe("User or group ID"),
      namespaceId: z.string().describe("Security namespace ID"),
      token: z.string().describe("Security token"),
      permissionBit: z.number().describe("Permission bit to reset"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const resetArgs = [
        "devops", "security", "permission", "reset",
        "--id", args.id,
        "--namespace-id", args.namespaceId,
        "--token", args.token,
        "--permission-bit", args.permissionBit.toString(),
        "--output", "json"
      ];
      
      if (args.project) {
        resetArgs.push("--project", args.project);
      }
      
      return await runAzCli(resetArgs, pat!);
    }
  );
}
