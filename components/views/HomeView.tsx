import React from 'react';
import { Icons } from '../icons';
import { ViewState } from '../../types';
import { AGENT_AVATAR } from '../../constants';

interface HomeViewProps {
  onChangeView: (view: ViewState) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onChangeView }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide px-4 pb-2 pt-0 space-y-4">
      <div className="bg-[#2a2a2a] rounded-2xl p-5 shadow-lg border border-white/5 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img 
              src={AGENT_AVATAR} 
              alt="Assistenza" 
              className="w-10 h-10 rounded-full object-cover shadow-inner"
            />
            <span className="absolute top-0 left-0 w-3 h-3 bg-green-500 border-2 border-[#2a2a2a] rounded-full"></span>
          </div>
          <div>
            <h3 className="text-[#b3b3b3] text-[12px] font-normal font-[system-ui]">Assistenza 24/7</h3>
            <p className="text-[#ffffff] text-[14px] font-normal font-[system-ui] leading-[17px]">Ciao! Come posso aiutarti?</p>
          </div>
        </div>
        <button 
          onClick={() => onChangeView(ViewState.CHAT)}
          className="w-full bg-[#EFCF45] hover:bg-[#d6b83c] text-[rgb(17,17,17)] font-bold text-[14px] leading-[17px] py-3 rounded-xl transition-colors"
        >
          Chatta ora
        </button>
      </div>

      <div className="bg-[#2a2a2a] rounded-2xl shadow-lg border border-white/5 p-1">
        <a 
          href="https://markour.co/#section-mmQWgCRnn3"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-4 rounded-xl transition-colors group"
        >
          <span className="text-[rgb(255,255,255)] font-normal text-[14px] leading-normal">
            Pacchetti e prezzi
          </span>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#EFCF45] transition-colors">
             <Icons.ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-black" />
          </div>
        </a>
      </div>
    </div>
  );
};