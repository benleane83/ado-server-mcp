import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBoardsTools } from "./boards.js";
import { registerOrganizationTools } from "./organization.js";
import { registerPipelinesTools } from "./pipelines.js";
import { registerReposTools } from "./repos.js";
import { registerArtifactsTools } from "./artifacts.js";
import { registerSecurityTools } from "./security.js";
import { registerServiceEndpointTools } from "./serviceEndpoints.js";
import { registerWikiTools } from "./wiki.js";
import { registerBannerTools } from "./banners.js";

/**
 * Register all Azure DevOps CLI tools
 */
export function registerAllTools(server: McpServer) {
  // Register tools by category
  registerOrganizationTools(server);
  registerBoardsTools(server);
  registerPipelinesTools(server);
  registerReposTools(server);
  //registerArtifactsTools(server);
  //registerSecurityTools(server);
  //registerServiceEndpointTools(server);
  registerWikiTools(server);
  //registerBannerTools(server);
}