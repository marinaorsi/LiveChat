
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './icons';
import { Message } from '../types';
import { sendMessageToWebhook } from '../services/webhookService';
import { AGENT_NAME, DEFAULT_WEBHOOK_URL, AGENT_AVATAR } from '../constants';

interface WidgetChatProps {
  webhookUrl?: string;
  onBack: () => void;
  onClose?: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sessionId: string;
}

export const WidgetChat: React.FC<WidgetChatProps> = ({ 
  webhookUrl, 
  onBack, 
  onClose, 
  messages, 
  setMessages,
  sessionId 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatico all'ultimo messaggio
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      text: inputValue, 
      sender: 'user', 
      timestamp: Date.now() 
    };
    
    // Aggiorna lo stato globale dei messaggi
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await sendMessageToWebhook(userMsg.text, sessionId, webhookUrl || DEFAULT_WEBHOOK_URL);
      setMessages(prev => [...prev, response]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c]">
      {/* Header della Chat */}
      <div className="px-4 py-4 flex items-center justify-between z-10 border-b border-white/5">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-all">
          <Icons.ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="bg-[#1a1a1a] rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-2 border border-white/5 shadow-lg">
           <img src={AGENT_AVATAR} alt="Agent" className="w-7 h-7 rounded-full object-cover" />
           <span className="text-white text-[13px] font-semibold">{AGENT_NAME}</span>
        </div>

        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-all">
          <Icons.Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Area Messaggi - Persistente */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-hide bg-[#0c0c0c]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'agent' && (
              <img src={AGENT_AVATAR} className="w-8 h-8 rounded-full mt-1 flex-shrink-0" alt="Avatar" />
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-[22px] text-[15px] leading-[20px] shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-[#facc15] text-black rounded-br-none font-medium' 
                : 'bg-[#262626] text-white rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-2.5 justify-start">
            <img src={AGENT_AVATAR} className="w-8 h-8 rounded-full flex-shrink-0" alt="Avatar" />
            <div className="bg-[#262626] border border-white/5 px-4 py-3 rounded-[22px] rounded-tl-none flex gap-1 items-center">
               <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Area Input */}
      <div className="p-4 pb-6 bg-[#0c0c0c]">
        <div className="bg-[#1a1a1a] rounded-full flex items-center p-1.5 border border-white/5 shadow-xl">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-transparent px-4 focus:outline-none text-white text-[14px] placeholder:text-gray-500"
          />
          <button 
            onClick={handleSend} 
            disabled={!inputValue.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              inputValue.trim() ? 'bg-[#facc15] text-black hover:bg-[#eab308]' : 'bg-[#222222] text-gray-600'
            }`}
          >
            <Icons.ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
