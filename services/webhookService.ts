import { Message, WebhookPayload } from '../types';
import { DEFAULT_WEBHOOK_URL } from '../constants';

export const sendMessageToWebhook = async (
  text: string, 
  sessionId: string,
  webhookUrl: string = DEFAULT_WEBHOOK_URL
): Promise<Message> => {
  
  try {
    const payload: WebhookPayload = {
      message: text,
      sessionId: sessionId
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    const data = await response.json();
    const replyText = data.output || data.reply || data.text || data.message || "Risposta ricevuta.";

    return {
      id: Date.now().toString(),
      text: typeof replyText === 'string' ? replyText : JSON.stringify(replyText),
      sender: 'agent',
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error("Failed to send message to webhook:", error);
    return {
      id: Date.now().toString(),
      text: "Spiacenti, si è verificato un errore di connessione. Controlla la console per i dettagli o verifica il CORS su n8n.",
      sender: 'agent',
      timestamp: Date.now(),
    };
  }
};