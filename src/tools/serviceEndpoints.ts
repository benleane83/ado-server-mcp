import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runAzCli, validatePAT } from "../utils.js";
import { MCPToolResponse } from "../types.js";

/**
 * Register Azure DevOps Service Endpoint tools
 */
export function registerServiceEndpointTools(server: McpServer) {
  
  // Tool: List service endpoints
  server.tool(
    "service_endpoint_list",
    "List service endpoints",
    {
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const listArgs = ["devops", "service-endpoint", "list", "--output", "json"];
      
      if (args.project) {
        listArgs.push("--project", args.project);
      }
      
      return await runAzCli(listArgs, pat!);
    }
  );

  // Tool: Show service endpoint details
  server.tool(
    "service_endpoint_show",
    "Show details of a service endpoint",
    {
      id: z.string().describe("Service endpoint ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const showArgs = [
        "devops", "service-endpoint", "show",
        "--id", args.id,
        "--output", "json"
      ];
      
      if (args.project) {
        showArgs.push("--project", args.project);
      }
      
      return await runAzCli(showArgs, pat!);
    }
  );

  // Tool: Create Azure RM service endpoint
  server.tool(
    "service_endpoint_azurerm_create",
    "Create an Azure Resource Manager service endpoint",
    {
      name: z.string().describe("Service endpoint name"),
      azureRmSubscriptionId: z.string().describe("Azure subscription ID"),
      azureRmSubscriptionName: z.string().describe("Azure subscription name"),
      azureRmTenantId: z.string().describe("Azure tenant ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "devops", "service-endpoint", "azurerm", "create",
        "--name", args.name,
        "--azure-rm-subscription-id", args.azureRmSubscriptionId,
        "--azure-rm-subscription-name", args.azureRmSubscriptionName,
        "--azure-rm-tenant-id", args.azureRmTenantId,
        "--output", "json"
      ];
      
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Create GitHub service endpoint
  server.tool(
    "service_endpoint_github_create",
    "Create a GitHub service endpoint",
    {
      name: z.string().describe("Service endpoint name"),
      githubUrl: z.string().describe("GitHub URL"),
      githubAccessToken: z.string().describe("GitHub access token"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const createArgs = [
        "devops", "service-endpoint", "github", "create",
        "--name", args.name,
        "--github-url", args.githubUrl,
        "--github-access-token", args.githubAccessToken,
        "--output", "json"
      ];
      
      if (args.project) {
        createArgs.push("--project", args.project);
      }
      
      return await runAzCli(createArgs, pat!);
    }
  );

  // Tool: Update service endpoint
  server.tool(
    "service_endpoint_update",
    "Update a service endpoint",
    {
      id: z.string().describe("Service endpoint ID"),
      name: z.string().optional().describe("New service endpoint name"),
      description: z.string().optional().describe("New service endpoint description"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const updateArgs = [
        "devops", "service-endpoint", "update",
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

  // Tool: Delete service endpoint
  server.tool(
    "service_endpoint_delete",
    "Delete a service endpoint",
    {
      id: z.string().describe("Service endpoint ID"),
      project: z.string().optional().describe("Project name or ID (uses default project if not specified)")
    },
    async (args, extra): Promise<MCPToolResponse> => {
      const pat = process.env.AZURE_DEVOPS_PAT;
      const patError = validatePAT(pat);
      if (patError) return patError;
      
      const deleteArgs = [
        "devops", "service-endpoint", "delete",
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
}
