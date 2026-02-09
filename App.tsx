import React, { useState } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { DEFAULT_WEBHOOK_URL } from './constants';

const App: React.FC = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>(DEFAULT_WEBHOOK_URL);

  return (
    <div className="w-full h-screen relative bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-4">LiveChat Widget Clone</h1>
        <p className="text-gray-400 mb-8">
          Un clone fedele in React + Tailwind. Include integrazione webhook e design responsive.
        </p>
        <button 
          onClick={() => setIsWidgetOpen(true)}
          className="bg-[#facc15] hover:bg-[#eab308] text-black font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20"
        >
          Apri Chat
        </button>
      </div>

      {!isWidgetOpen && (
        <button
          onClick={() => setIsWidgetOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-[#facc15] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-300 group-hover:rotate-6">
            <rect x="2" y="2" width="20" height="20" rx="7" fill="#111111" />
            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13V13.5" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17H12.01" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <ChatWidget 
        isOpen={isWidgetOpen} 
        onClose={() => setIsWidgetOpen(false)} 
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
      />
    </div>
  );
};

export default App;