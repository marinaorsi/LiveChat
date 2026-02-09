import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../icons';
import { Message } from '../../types';
import { sendMessageToWebhook } from '../../services/webhookService';
import { AGENT_NAME, INITIAL_GREETING, DEFAULT_WEBHOOK_URL, AGENT_AVATAR } from '../../constants';

interface ChatInterfaceProps {
  webhookUrl?: string;
  onBack: () => void;
  onClose?: () => void;
}

const CUSTOM_EMOJIS = ['🙂', '😁', '😂', '😊', '😍', '😐', '🙁', '😔', '😢', '😭', '🎉', '❤️', '👌', '👍', '🙏'];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ webhookUrl, onBack, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      text: INITIAL_GREETING,
      sender: 'agent',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  return (
    <div className="flex flex-col h-full bg-[#111111]">
      <div className="px-4 py-4 flex items-center justify-between z-10">
        <div className="flex gap-2">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-white transition-colors">
            <Icons.ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#2a2a2a] rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-2 border border-white/5 shadow-lg">
           <div className="relative">
             <img src={AGENT_AVATAR} alt="Agent" className="w-8 h-8 rounded-full object-cover" />
             <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#2a2a2a] rounded-full"></span>
           </div>
           <span className="text-white text-[13px] font-bold">{AGENT_NAME}</span>
        </div>

        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-white transition-colors">
          <Icons.Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'agent' && (
              <div className="relative mt-1">
                <img src={AGENT_AVATAR} alt="Agent" className="w-8 h-8 rounded-full object-cover shadow-md" />
              </div>
            )}
            <div className={`max-w-[90%] px-4 py-3 shadow-sm rounded-[20px] ${msg.sender === 'user' ? 'bg-[#facc15] text-black rounded-br-sm text-[15px] leading-relaxed' : 'bg-[#2a2a2a] text-white text-[14px] font-normal leading-[18px] rounded-tl-sm border border-white/5'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex items-start gap-3 justify-start">
             <div className="relative mt-1">
                <img src={AGENT_AVATAR} alt="Agent" className="w-8 h-8 rounded-full object-cover" />
             </div>
             <div className="bg-[#2a2a2a] border border-white/5 px-4 py-4 rounded-[20px] rounded-tl-sm flex gap-1.5 items-center h-[46px]">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 pb-4 bg-[#111111] relative">
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-[72px] left-8 z-50 bg-[#2a2a2a] p-3 rounded-xl shadow-2xl border border-white/10 w-[240px]">
            <div className="grid grid-cols-5 gap-2">
              {CUSTOM_EMOJIS.map((emoji) => (
                <button key={emoji} onClick={() => onEmojiClick(emoji)} className="w-9 h-9 flex items-center justify-center text-xl hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="relative bg-[#2a2a2a] rounded-full flex items-center p-1.5 border border-white/5 shadow-lg">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-transparent px-4 focus:outline-none text-white text-[14px] font-normal leading-[21px] placeholder:text-white placeholder:opacity-50"
          />
          <div className="flex items-center gap-1 pr-1">
            <button ref={emojiButtonRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 transition-colors ${showEmojiPicker ? 'text-[#facc15]' : 'text-gray-400 hover:text-white'}`}>
              <Icons.Smile className="w-6 h-6" />
            </button>
            <button onClick={handleSend} disabled={!inputValue.trim()} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${inputValue.trim() ? 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]' : 'bg-[#333333] text-gray-600 cursor-not-allowed'}`}>
              <Icons.ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};