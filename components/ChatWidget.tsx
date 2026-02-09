import React, { useState } from 'react';
import { Icons } from './icons';
import { ViewState, Message } from '../types';
import { WidgetHome } from './WidgetHome';
import { WidgetChat } from './WidgetChat';
import { ContactView } from './views/ContactView';
import { INITIAL_GREETING } from '../constants';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl?: string;
  setWebhookUrl: (url: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, webhookUrl }) => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.HOME);
  
  // Stato persistente dei messaggi sollevato al livello del widget
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init-1', text: INITIAL_GREETING, sender: 'agent', timestamp: Date.now() }
  ]);
  
  // ID Sessione persistente per mantenere la stessa conversazione sul server
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[90vw] sm:w-[350px] h-[640px] max-h-[85vh] bg-[#1c1c1c] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/10 z-50 font-sans transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in">
      {/* Background gradient visibile solo in Home o Contact */}
      {activeView !== ViewState.CHAT && (
        <div className="absolute top-0 left-0 w-full h-[380px] bg-gradient-to-b from-[#61521F] to-[#1c1c1c] pointer-events-none z-0" />
      )}

      {/* Header visibile solo in Home o Contact */}
      {activeView !== ViewState.CHAT && (
        <div className="relative z-10 p-6 pb-2">
          <div className="absolute top-6 right-6 flex gap-2 z-20">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
              <Icons.Minus className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-[35px] font-bold text-white tracking-tight leading-tight mt-24">
            Come possiamo <br /> aiutarti? 👋
          </h1>
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col min-h-0 bg-transparent">
        {activeView === ViewState.CHAT ? (
          <WidgetChat 
            webhookUrl={webhookUrl} 
            onBack={() => setActiveView(ViewState.HOME)} 
            onClose={onClose}
            messages={messages}
            setMessages={setMessages}
            sessionId={sessionId}
          />
        ) : activeView === ViewState.CONTACT ? (
          <ContactView />
        ) : (
          <WidgetHome onChangeView={setActiveView} />
        )}
      </div>

      {/* Footer Nav - Nascosto durante la chat per dare spazio ai messaggi */}
      {activeView !== ViewState.CHAT && (
        <div className="relative z-10 px-6 pb-4 pt-0">
          <div className="bg-[#2a2a2a] rounded-[24px] p-1 flex border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveView(ViewState.HOME)} 
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[20px] transition-all duration-200 group cursor-pointer ${activeView === ViewState.HOME ? 'bg-white/5' : ''}`}
            >
              <Icons.Home className={`w-7 h-7 mb-1 ${activeView === ViewState.HOME ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
              <span className={`text-[11px] font-medium ${activeView === ViewState.HOME ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>Home</span>
            </button>
            
            <button 
              // Cambiato da ViewState.CONTACT a ViewState.CHAT come richiesto
              onClick={() => setActiveView(ViewState.CHAT)} 
              // Fix: Changed comparison from ViewState.CHAT to ViewState.CONTACT because this block is only rendered if activeView !== ViewState.CHAT
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[20px] transition-all duration-200 group cursor-pointer ${activeView === ViewState.CONTACT ? 'bg-white/5' : ''}`}
            >
              {/* Fix: Changed comparison from ViewState.CHAT to ViewState.CONTACT */}
              <Icons.MessageCircle className={`w-7 h-7 mb-1 ${activeView === ViewState.CONTACT ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
              {/* Fix: Changed comparison from ViewState.CHAT to ViewState.CONTACT */}
              <span className={`text-[11px] font-medium ${activeView === ViewState.CONTACT ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>Contatto</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
