import { Task } from "@/interface/task";

export interface AssistantRequest {
  prompt: string;
  tasks: Task[];
}

export interface AssistantResponse {
  text: string;
  error?: string;
}

class AssistantAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AssistantAPIError';
  }
}

/**
 * Generate AI response for task management and deadline suggestions
 * @param request - The request containing prompt and tasks
 * @returns Promise with AI response
 */
export const generateAssistantResponse = async (
  request: AssistantRequest
): Promise<AssistantResponse> => {
  try {
    const { prompt, tasks } = request;

    if (!prompt.trim()) {
      throw new AssistantAPIError('Prompt cannot be empty');
    }

    // Create formatted task context for AI
    const taskContext = tasks
      .map(
        (task) =>
          `- ${task.title} | deadline: ${task.deadline} | priority: ${task.priority} | completed: ${task.completed}`
      )
      .join('\n');

    const formattedPrompt = `${prompt}\n
Dưới đây là danh sách task hiện tại của bạn:\n
${taskContext}\n
Hãy đưa ra gợi ý quản lý deadline hiệu quả.`;

    const response = await fetch("http://localhost:4000/generate", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        prompt: formattedPrompt,
      }),
    });

    if (!response.ok) {
      throw new AssistantAPIError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.text) {
      throw new AssistantAPIError('Invalid response format from AI service');
    }

    return {
      text: data.text,
    };
  } catch (error) {
    if (error instanceof AssistantAPIError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new AssistantAPIError('Network error: Unable to connect to AI service');
    }

    // Handle other unexpected errors
    throw new AssistantAPIError(`Unexpected error: ${(error as Error).message}`);
  }
};

/**
 * Check if the AI service is available
 * @returns Promise<boolean> indicating service availability
 */
export const checkAssistantServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:4000/health", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch {
    return false;
  }
};