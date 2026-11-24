// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { getStoredPasswords, saveStoredPasswords, addHistoryItem } from '../../utils/storage';

interface SuperUsersProps {
  showToast: (msg: string) => void;
}

export const SuperUsers: React.FC<SuperUsersProps> = ({ showToast }) => {
  const [pwds, setPwds] = useState(getStoredPasswords());
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwds.admin.length < 8 || pwds.superadmin.length < 8) {
      setError('Kata sandi minimal 8 karakter');
      return;
    }
    saveStoredPasswords(pwds);
    addHistoryItem('superadmin', 'Pengguna', 'Kata sandi peran diperbarui.');
    showToast('Berhasil disimpan');
    setError('');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Manajemen</p>
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Kata Sandi Peran</h2>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Kata Sandi Admin</label>
          <input
            type="text"
            value={pwds.admin}
            onChange={(e) => setPwds({ ...pwds, admin: e.target.value })}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kata Sandi Superadmin</label>
          <input
            type="text"
            value={pwds.superadmin}
            onChange={(e) => setPwds({ ...pwds, superadmin: e.target.value })}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#183D35] text-[#F2EBDD] rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};
