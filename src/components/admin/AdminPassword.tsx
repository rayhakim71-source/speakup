// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { getStoredPasswords, saveStoredPasswords, addHistoryItem } from '../../utils/storage';

interface AdminPasswordProps {
  showToast: (msg: string) => void;
}

export const AdminPassword: React.FC<AdminPasswordProps> = ({ showToast }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const pwds = getStoredPasswords();

    if (oldPassword !== pwds.admin) {
      setError('Kata sandi lama salah');
      return;
    }

    if (newPassword.length < 8) {
      setError('Minimal 8 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Kata sandi baru tidak sama');
      return;
    }

    pwds.admin = newPassword;
    saveStoredPasswords(pwds);
    addHistoryItem('admin', 'Ubah Kata Sandi', 'Kata sandi admin berhasil diperbarui.');
    showToast('Berhasil disimpan');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Keamanan</p>
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Kata Sandi</h2>
      </div>

      <form onSubmit={handlePasswordChange} className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Kata Sandi Lama *</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kata Sandi Baru *</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ulangi Kata Sandi Baru *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
