// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect } from 'react';
import { Role, CmsSettings } from '../../types';

interface MobileSidebarProps {
  cms: CmsSettings;
  authRole: Role;
  onNavigate: (href: string) => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  hasDocumentation: boolean;
  docLink: string;
  proposalFormLink: string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  cms,
  authRole,
  onNavigate,
  onOpenLogin,
  onOpenDashboard,
  hasDocumentation,
  docLink,
  proposalFormLink,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    onNavigate(href);
  };

  return (
    <>
      {/* 120x25 button on left middle edge */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Buka Menu"
        className="fixed left-0 top-1/2 -translate-y-1/2 w-[25px] h-[120px] bg-[#183D35]/90 text-[#F2EBDD] rounded-r flex items-center justify-center z-40 shadow-md hover:bg-[#183D35] md:hidden"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar drawer */}
          <div className="relative w-80 max-w-[80vw] bg-[#F2EBDD] text-[#252623] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-5 border-b border-[#252623]/10 flex justify-between items-center">
              <span className="font-serif font-bold text-lg text-[#183D35]">{cms.programName}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-xl hover:text-[#B96549]"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 py-4">
              <ul className="space-y-1">
                {cms.menuItems
                  .filter((item) => item.visible)
                  .map((item) => {
                    if (item.label === 'Propose a Topic') {
                      if (!proposalFormLink) return null;
                      return (
                        <li key={item.label}>
                          <a
                            href={proposalFormLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-left px-6 py-3 min-h-[48px] text-base hover:bg-[#183D35]/10 font-medium transition-colors"
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={item.href}>
                        <button
                          onClick={() => handleItemClick(item.href)}
                          className="w-full text-left px-6 py-3 min-h-[48px] text-base hover:bg-[#183D35]/10 font-medium transition-colors"
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}

                {hasDocumentation && (
                  <li>
                    <a
                      href={docLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-6 py-3 min-h-[48px] text-base hover:bg-[#183D35]/10 font-medium transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                )}

                {/* Login or Dashboard */}
                <li>
                  {authRole !== 'public' ? (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenDashboard();
                      }}
                      className="w-full text-left px-6 py-3 min-h-[48px] text-base bg-[#183D35] text-[#F2EBDD] font-medium transition-colors"
                    >
                      Dasbor
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full text-left px-6 py-3 min-h-[48px] text-base hover:bg-[#183D35]/10 font-medium transition-colors"
                    >
                      Login
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
