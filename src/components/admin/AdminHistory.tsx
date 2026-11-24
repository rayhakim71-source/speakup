// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { HistoryItem } from '../../types';

interface AdminHistoryProps {
  history: HistoryItem[];
}

export const AdminHistory: React.FC<AdminHistoryProps> = ({ history }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = history.filter(
    (h) =>
      h.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Aktivitas</p>
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Riwayat Perubahan</h2>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari riwayat..."
          className="w-full bg-white border border-[#252623]/20 px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#183D35]"
        />
      </div>

      <div className="bg-white border border-[#252623]/10 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F2EBDD]/60 border-b border-[#252623]/10 text-xs uppercase tracking-wider text-[#183D35]">
                <th className="p-4">Waktu</th>
                <th className="p-4">Peran</th>
                <th className="p-4">Aksi</th>
                <th className="p-4">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252623]/10 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#252623]/60 italic">
                    Belum ada data
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F2EBDD]/30 transition-colors">
                    <td className="p-4 text-[#252623]/70">{item.timestamp}</td>
                    <td className="p-4 font-semibold text-[#183D35]">{item.role}</td>
                    <td className="p-4 text-[#B96549] font-medium">{item.action}</td>
                    <td className="p-4 text-[#252623]/90">{item.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
