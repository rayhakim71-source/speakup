// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CmsSettings, ScheduleSettings } from '../../types';

interface FooterProps {
  cms: CmsSettings;
  schedule: ScheduleSettings;
}

export const Footer: React.FC<FooterProps> = ({ cms, schedule }) => {
  const hasWhatsapp = Boolean(cms.footer.whatsapp);
  const hasInstagram = Boolean(cms.footer.instagram);

  return (
    <footer className="bg-[#183D35] text-[#F2EBDD] border-t border-[#D6A64A]/20 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-serif font-bold text-2xl mb-4">{cms.programName}</h3>
          <p className="text-sm text-[#F2EBDD]/80 leading-relaxed mb-4">
            {cms.pageDescription}
          </p>
          <p className="text-xs text-[#D6A64A]">
            {cms.footer.copyright}
          </p>
        </div>

        <div>
          <h4 className="font-serif font-semibold text-lg mb-4 text-[#D6A64A]">Schedule & Location</h4>
          <p className="text-sm text-[#F2EBDD]/90 mb-2">
            Every {schedule.day} · {schedule.timeLabel} {schedule.timeStr ? `(${schedule.timeStr})` : ''}
          </p>
          <p className="text-sm text-[#F2EBDD]/90 mb-2">
            {schedule.location}
          </p>
          <p className="text-sm text-[#F2EBDD]/90">
            {cms.footer.address}
          </p>
        </div>

        <div>
          <h4 className="font-serif font-semibold text-lg mb-4 text-[#D6A64A]">Contact</h4>
          {(hasWhatsapp || hasInstagram) ? (
            <div className="flex flex-col space-y-2">
              {hasWhatsapp && (
                <a
                  href={`https://wa.me/${cms.footer.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#F2EBDD] hover:text-[#D6A64A] transition-colors inline-block"
                >
                  WhatsApp: {cms.footer.whatsapp}
                </a>
              )}
              {hasInstagram && (
                <a
                  href={`https://instagram.com/${cms.footer.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#F2EBDD] hover:text-[#D6A64A] transition-colors inline-block"
                >
                  Instagram: @{cms.footer.instagram}
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#F2EBDD]/70">SMP Negeri 1 Bengkalis</p>
          )}
        </div>
      </div>
    </footer>
  );
};
