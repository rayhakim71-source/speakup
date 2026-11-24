// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';

export const SuperFirebase: React.FC = () => {
  return (
    <div className="space-y-8 opacity-75">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Integrasi</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Firebase</h2>
        </div>
        <span className="text-sm font-medium text-[#252623]/70">Belum aktif</span>
      </div>

      <div className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="text"
            disabled
            value=""
            placeholder="Nonaktif"
            className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded text-sm cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project ID</label>
          <input
            type="text"
            disabled
            value=""
            placeholder="Nonaktif"
            className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded text-sm cursor-not-allowed"
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="button"
            disabled
            className="px-6 py-2.5 bg-gray-300 text-gray-500 rounded text-sm font-medium cursor-not-allowed"
          >
            Sinkronkan
          </button>
        </div>
      </div>
    </div>
  );
};
