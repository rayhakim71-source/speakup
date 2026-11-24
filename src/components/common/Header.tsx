// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { Role, CmsSettings } from '../../types';

interface HeaderProps {
  cms: CmsSettings;
  authRole: Role;
  onNavigate: (href: string) => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  hasDocumentation: boolean;
  docLink: string;
  proposalFormLink: string;
}

export const Header: React.FC<HeaderProps> = ({
  cms,
  authRole,
  onNavigate,
  onOpenLogin,
  onOpenDashboard,
  hasDocumentation,
  docLink,
  proposalFormLink,
}) => {
  return (
    <header className="bg-[#183D35] text-[#F2EBDD] border-b border-[#D6A64A]/20 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Title */}
        <div className="cursor-pointer" onClick={() => onNavigate('#home')}>
          <h1 className="font-serif font-bold text-2xl tracking-wide">{cms.programName}</h1>
          <p className="text-xs text-[#D6A64A] tracking-wider uppercase">{cms.slogan.substring(0, 30)}</p>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {cms.menuItems
            .filter((item) => item.visible)
            .map((item) => {
              if (item.label === 'Propose a Topic') {
                if (!proposalFormLink) return null;
                return (
                  <a
                    key={item.label}
                    href={proposalFormLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-[#D6A64A] transition-colors"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <button
                  key={item.href}
                  onClick={() => onNavigate(item.href)}
                  className="text-sm font-medium hover:text-[#D6A64A] transition-colors"
                >
                  {item.label}
                </button>
              );
            })}

          {hasDocumentation && (
            <a
              href={docLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-[#D6A64A] transition-colors"
            >
              Documentation
            </a>
          )}

          {authRole !== 'public' ? (
            <button
              onClick={onOpenDashboard}
              className="px-4 py-2 bg-[#D6A64A] text-[#183D35] font-medium text-sm rounded hover:bg-[#D6A64A]/90 transition-colors"
            >
              Dasbor
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="text-sm font-medium hover:text-[#D6A64A] transition-colors"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
