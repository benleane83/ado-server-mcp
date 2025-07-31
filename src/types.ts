/**
 * Shared types for Azure DevOps MCP Server
 */

export type MCPToolResponse = { 
  content: { type: "text"; text: string }[]; 
  isError?: boolean 
};

export interface ToolContext {
  pat: string;
}
