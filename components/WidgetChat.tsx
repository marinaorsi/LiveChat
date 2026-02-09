
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

const CUSTOM_EMOJIS = ['🙂', '😁', '😂', '😊', '😍', '😐', '🙁', '😔', '😢', '😭', '🎉', '❤️', '👌', '👍', '🙏'];

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      text: inputValue, 
      sender: 'user', 
      timestamp: Date.now() 
    };
    
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

  const onEmojiClick = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0c0c0c] z-20 overflow-hidden">
      {/* Header Chat - Centrato e senza pulsante opzioni */}
      <div className="px-5 py-4 flex items-center bg-[#0c0c0c] flex-shrink-0 z-10 relative h-[72px]">
        {/* Sinistra: Solo pulsante Indietro */}
        <div className="flex-shrink-0 z-20">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#262626] flex items-center justify-center text-white transition-all">
            <Icons.ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        {/* Centro: Pillola Profilo Centrata Assolutamente */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[#1a1a1a] rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-2.5 border border-white/5 shadow-lg pointer-events-auto">
             <div className="relative">
               <img src={AGENT_AVATAR} alt="Agent" className="w-7 h-7 rounded-full object-cover" />
               {/* Bollino verde leggermente aumentato a w-3 h-3 (12px) */}
               <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#59cc95] border-[2px] border-[#1a1a1a] rounded-full shadow-sm"></span>
             </div>
             {/* Font weight portato a 700 con classe specifica per pulizia estetica */}
             <span className="text-white text-[13.5px] font-[700] tracking-tight whitespace-nowrap antialiased">{AGENT_NAME}</span>
          </div>
        </div>

        {/* Destra: Pulsante Chiudi */}
        <div className="flex-shrink-0 ml-auto z-20">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#262626] flex items-center justify-center text-white transition-all">
            <Icons.Minus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Area Messaggi - Font 14px */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-hide bg-[#0c0c0c]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'agent' && (
              <div className="relative flex-shrink-0 mt-1">
                <img src={AGENT_AVATAR} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
              </div>
            )}
            <div className={`max-w-[85%] px-4 py-3 rounded-[24px] text-[14px] leading-[1.5] shadow-md ${
              msg.sender === 'user' 
                ? 'bg-[#facc15] text-black rounded-br-none font-medium' 
                : 'bg-[#1a1a1a] text-white rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3 justify-start">
            <div className="relative flex-shrink-0">
                <img src={AGENT_AVATAR} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
            </div>
            <div className="bg-[#1a1a1a] border border-white/5 px-5 py-3.5 rounded-[24px] rounded-tl-none flex gap-1.5 items-center">
               <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area con Emoji Picker */}
      <div className="p-6 pb-10 bg-[#0c0c0c] flex-shrink-0 relative">
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-[80px] left-6 z-50 bg-[#1a1a1a] p-3 rounded-2xl shadow-2xl border border-white/10 w-[260px] animate-widget-in">
            <div className="grid grid-cols-5 gap-2">
              {CUSTOM_EMOJIS.map((emoji) => (
                <button 
                  key={emoji} 
                  onClick={() => onEmojiClick(emoji)} 
                  className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/5 rounded-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-full flex items-center p-1.5 border border-white/5 shadow-2xl">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-transparent px-4 focus:outline-none text-white text-[14px] placeholder:text-gray-500"
          />
          
          <div className="flex items-center gap-1.5 pr-1">
            <button 
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'text-[#facc15] bg-white/5' : 'text-gray-500 hover:text-white'}`}
            >
              <Icons.Smile className="w-6 h-6" />
            </button>
            <button 
              onClick={handleSend} 
              disabled={!inputValue.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                inputValue.trim() ? 'bg-[#facc15] text-black hover:bg-[#eab308] scale-105 shadow-lg' : 'bg-[#222222] text-gray-600'
              }`}
            >
              <Icons.ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
