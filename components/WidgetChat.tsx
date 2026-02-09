import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './icons';
import { Message } from '../types';
import { sendMessageToWebhook } from '../services/webhookService';
import { AGENT_NAME, INITIAL_GREETING, DEFAULT_WEBHOOK_URL, AGENT_AVATAR } from '../constants';

interface WidgetChatProps {
  webhookUrl?: string;
  onBack: () => void;
  onClose?: () => void;
}

const CUSTOM_EMOJIS = ['🙂', '😁', '😂', '😊', '😍', '😐', '🙁', '😔', '😢', '😭', '🎉', '❤️', '👌', '👍', '🙏'];

export const WidgetChat: React.FC<WidgetChatProps> = ({ webhookUrl, onBack, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init-1', text: INITIAL_GREETING, sender: 'agent', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setShowEmojiPicker(false);

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
    <div className="flex flex-col h-full bg-[#111111]">
      <div className="px-4 py-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-white">
          <Icons.ArrowLeft className="w-5 h-5" />
        </button>
        <div className="bg-[#2a2a2a] rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-2 border border-white/5 shadow-lg">
           <img src={AGENT_AVATAR} alt="Agent" className="w-8 h-8 rounded-full object-cover" />
           <span className="text-white text-[13px] font-bold">{AGENT_NAME}</span>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-white">
          <Icons.Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'agent' && <img src={AGENT_AVATAR} className="w-8 h-8 rounded-full" />}
            <div className={`max-w-[85%] px-4 py-3 rounded-[20px] ${msg.sender === 'user' ? 'bg-[#facc15] text-black rounded-br-sm' : 'bg-[#2a2a2a] text-white rounded-tl-sm border border-white/5'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-gray-500 text-xs ml-11">L'assistente sta scrivendo...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 relative">
        <div className="bg-[#2a2a2a] rounded-full flex items-center p-1.5 border border-white/5">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-transparent px-4 focus:outline-none text-white text-sm"
          />
          <button onClick={handleSend} className="w-9 h-9 rounded-full bg-[#3a3a3a] text-white flex items-center justify-center">
            <Icons.ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};