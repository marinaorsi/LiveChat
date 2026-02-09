import React from 'react';
import { Icons } from '../icons';

export const ContactView: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-6 text-center space-y-6 pt-10">
      <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-2 border border-white/5">
        <Icons.Mail className="w-8 h-8 text-[#facc15]" />
      </div>
      
      <div>
        <h3 className="text-white font-bold text-lg mb-2">Contattaci</h3>
        <p className="text-gray-400 text-sm">
          Preferisci inviarci una email? Nessun problema. Ti risponeremo il prima possibile.
        </p>
      </div>

      <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5 text-left">
        <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
        <div className="text-white text-sm mt-1 select-all">support@example.com</div>
      </div>
      
      <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5 text-left">
        <label className="text-xs text-gray-500 uppercase font-semibold">Orari</label>
        <div className="text-white text-sm mt-1">Lun - Ven: 9:00 - 18:00</div>
      </div>
    </div>
  );
};