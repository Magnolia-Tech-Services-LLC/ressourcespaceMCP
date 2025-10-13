import { createPromptTemplates, MCPPrompt } from './templates.js';

export function createAllPrompts(): MCPPrompt[] {
  return createPromptTemplates();
}

export { MCPPrompt, createPromptTemplates };

