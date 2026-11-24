// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { SessionData, ScheduleSettings, CmsSettings } from '../../types';

interface HomeSectionProps {
  cms: CmsSettings;
  schedule: ScheduleSettings;
  upcomingSession: SessionData | null;
  onExplore: () => void;
  onViewDoc: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  cms,
  schedule,
  upcomingSession,
  onExplore,
  onViewDoc,
}) => {
  const hasDoc = Boolean(upcomingSession?.tautanDokumentasi || schedule.generalDocLink);
  const docLink = upcomingSession?.tautanDokumentasi || schedule.generalDocLink;

  return (
    <section id="home" className="bg-[#183D35] text-[#F2EBDD] py-20 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest text-[#D6A64A] font-semibold uppercase mb-6">
          {cms.heroTopLabel}
        </p>

        <h2 className="font-serif font-bold text-6xl md:text-8xl tracking-tight mb-8">
          {cms.sections.find(s => s.id === 'home')?.title || 'SPEAK UP!'}
        </h2>

        <div className="space-y-2 font-serif text-2xl md:text-4xl text-[#F2EBDD]/90 mb-8 italic">
          <p>Learn to Speak.</p>
          <p>Dare to Think.</p>
          <p>Share Your Ideas.</p>
        </div>

        <p className="max-w-2xl text-base md:text-lg text-[#F2EBDD]/80 leading-relaxed mb-12">
          {cms.pageDescription}
        </p>

        <div className="inline-block border border-[#D6A64A]/40 px-4 py-1 text-xs tracking-widest uppercase text-[#D6A64A] mb-12">
          Every {schedule.day} · {schedule.timeLabel} · {schedule.location}
        </div>

        {/* Next Session Block */}
        <div className="bg-[#183D35] border border-[#D6A64A]/40 p-8 rounded mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-[#D6A64A] mb-2">Next Session</p>
          {schedule.noSessionThisWeek ? (
            <div>
              <h3 className="font-serif text-2xl font-bold mb-2">No session this week</h3>
              {schedule.noSessionNote && <p className="text-sm text-[#F2EBDD]/80">{schedule.noSessionNote}</p>}
            </div>
          ) : upcomingSession ? (
            <div>
              <p className="text-sm text-[#D6A64A] mb-1">{upcomingSession.tanggal}</p>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                {upcomingSession.number}: {upcomingSession.topik}
              </h3>
              <p className="text-base text-[#F2EBDD]/90 italic mb-6">
                "{upcomingSession.pertanyaanUtama}"
              </p>
            </div>
          ) : (
            <p className="text-base">Belum ada sesi mendatang</p>
          )}

          <div className="flex flex-wrap gap-4 pt-4 border-t border-[#D6A64A]/20">
            <button
              onClick={onExplore}
              className="bg-[#D6A64A] text-[#183D35] px-6 py-3 font-medium text-sm rounded hover:bg-[#D6A64A]/90 transition-colors"
            >
              Explore This Week's Topic
            </button>
            {hasDoc && (
              <a
                href={docLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onViewDoc}
                className="border border-[#F2EBDD]/40 text-[#F2EBDD] px-6 py-3 font-medium text-sm rounded hover:bg-[#F2EBDD]/10 transition-colors"
              >
                View Documentation
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-[#D6A64A]/20 pt-6 text-xs text-[#F2EBDD]/60 space-y-1 font-serif italic">
          <p>"Speak to share ideas, not just to practice English."</p>
          <p>"We don't speak English because we are good at it. We become better at English because we keep speaking it."</p>
        </div>
      </div>
    </section>
  );
};
