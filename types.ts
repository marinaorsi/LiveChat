export enum ViewState {
  HOME = 'HOME',
  CHAT = 'CHAT',
  CONTACT = 'CONTACT'
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

export interface WebhookPayload {
  message: string;
  sessionId: string;
}

export interface WebhookResponse {
  reply: string;
}
