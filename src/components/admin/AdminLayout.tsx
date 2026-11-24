// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { Role } from '../../types';

interface AdminLayoutProps {
  role: Role;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  onLogout: () => void;
  onGoHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  role,
  activeMenu,
  onSelectMenu,
  onLogout,
  onGoHome,
  children,
}) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dasbor' },
    { id: 'sessions', label: 'Sesi' },
    { id: 'proposals', label: 'Usulan' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'schedule', label: 'Jadwal' },
    { id: 'history', label: 'Riwayat' },
    { id: 'password', label: 'Kata Sandi' },
  ];

  const superadminMenuItems = [
    ...adminMenuItems,
    { id: 'cms', label: 'CMS' },
    { id: 'sync', label: 'Sinkronisasi' },
    { id: 'firebase', label: 'Firebase' },
    { id: 'users', label: 'Pengguna' },
  ];

  const menuItems = role === 'superadmin' ? superadminMenuItems : adminMenuItems;

  return (
    <div className="min-h-screen bg-[#F2EBDD] text-[#252623] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#183D35] text-[#F2EBDD] flex flex-col justify-between p-6 border-r border-[#D6A64A]/20">
        <div>
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-[#D6A64A] block mb-1">Panel {role}</span>
            <h2 className="font-serif font-bold text-xl">SPEAK UP!</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectMenu(item.id)}
                className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors ${
                  activeMenu === item.id
                    ? 'bg-[#D6A64A] text-[#183D35]'
                    : 'hover:bg-white/10 text-[#F2EBDD]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#D6A64A]/20 space-y-3">
          <button
            onClick={onGoHome}
            className="w-full text-left px-4 py-2 text-sm text-[#F2EBDD]/80 hover:text-[#F2EBDD]"
          >
            ← Kembali ke Website
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-[#B96549] hover:text-[#B96549]/80 font-medium"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
