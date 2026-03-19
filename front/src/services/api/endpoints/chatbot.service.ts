import { apiClient } from '../client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  conversation_id?: string;
}

export const chatbotService = {
  /**
   * Send a message to the chatbot proxy
   * @param message - The user's message
   * @param history - Previous conversation history
   * @returns The chatbot's response
   */
  sendMessage: (message: string, history: ChatMessage[] = []): Promise<ChatResponse> =>
    apiClient.request<ChatResponse>({
      method: 'POST',
      url: '/chatbot/chat/',
      data: { message, history },
    }),
};
