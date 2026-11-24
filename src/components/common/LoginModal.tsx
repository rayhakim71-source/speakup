// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { getStoredPasswords, saveStoredAuth, addHistoryItem } from '../../utils/storage';
import { Role } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: Role) => void;
  showToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, showToast }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const pwds = getStoredPasswords();
    let role: Role = 'public';

    if (password === pwds.superadmin) {
      role = 'superadmin';
    } else if (password === pwds.admin) {
      role = 'admin';
    }

    if (role !== 'public') {
      saveStoredAuth({ isLoggedIn: true, role, lastActive: Date.now() });
      addHistoryItem(role, 'Login', 'Berhasil masuk ke panel sistem.');
      showToast('Berhasil masuk');
      setPassword('');
      setError('');
      onLoginSuccess(role);
      onClose();
    } else {
      setError('Kata sandi salah');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#F2EBDD] text-[#252623] w-full max-w-md p-6 rounded shadow-xl border border-[#D6A64A]/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-bold text-[#183D35]">Login</h3>
          <button onClick={onClose} className="text-xl px-2 py-1 hover:text-[#B96549]">×</button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kata Sandi *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#252623]/20 px-3 py-2 rounded text-[#252623] focus:outline-none focus:border-[#183D35]"
                placeholder=""
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xs text-[#252623]/60 hover:text-[#252623]"
              >
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#252623]/30 rounded text-sm hover:bg-[#252623]/5"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#183D35] text-[#F2EBDD] rounded text-sm hover:bg-[#183D35]/90"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
