// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { SessionData, ScheduleSettings } from '../../types';

interface ThisWeekSectionProps {
  session: SessionData | null;
  schedule: ScheduleSettings;
}

export const ThisWeekSection: React.FC<ThisWeekSectionProps> = ({ session, schedule }) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const handlePrint = () => {
    window.print();
  };

  const scrollToGetReady = () => {
    const el = document.getElementById('get-ready');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setOpenAccordion(0);
    }
  };

  if (schedule.noSessionThisWeek) {
    return (
      <section id="this-week" className="bg-[#F2EBDD] text-[#252623] py-24 px-6 border-b border-[#252623]/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-3">This Week</p>
          <h2 className="font-serif font-bold text-4xl mb-6">No session this week</h2>
          {schedule.noSessionNote && (
            <p className="text-lg text-[#252623]/80">{schedule.noSessionNote}</p>
          )}
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section id="this-week" className="bg-[#F2EBDD] text-[#252623] py-24 px-6 border-b border-[#252623]/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-3">This Week</p>
          <h2 className="font-serif font-bold text-4xl mb-6">No session this week</h2>
        </div>
      </section>
    );
  }

  return (
    <section id="this-week" className="bg-[#F2EBDD] text-[#252623] py-24 px-6 border-b border-[#252623]/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-[#252623]/20 pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">This Week</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl">Ideas Worth Talking About.</h2>
          </div>
          <button
            onClick={handlePrint}
            className="no-print border border-[#252623] px-4 py-2 text-sm font-medium hover:bg-[#252623] hover:text-[#F2EBDD] transition-colors"
          >
            Print
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center space-x-3 text-sm text-[#B96549] font-medium mb-2">
                <span>{session.number}</span>
                <span>·</span>
                <span>{session.tanggal}</span>
                {session.pembicara && (
                  <>
                    <span>·</span>
                    <span>{session.pembicara}</span>
                  </>
                )}
              </div>
              <h3 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35] mb-4">
                {session.topik}
              </h3>
              <p className="font-serif italic text-xl text-[#252623]/90 leading-relaxed mb-6">
                "{session.pertanyaanUtama}"
              </p>
              {session.pengantar && (
                <p className="text-base text-[#252623]/80 leading-relaxed">
                  {session.pengantar}
                </p>
              )}
            </div>

            {/* Discussion Questions */}
            <div className="bg-white/60 border border-[#252623]/10 p-8 rounded">
              <h4 className="font-serif font-bold text-xl text-[#183D35] mb-6">Discussion Questions</h4>
              <ol className="space-y-4">
                {session.discussionQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start space-x-4">
                    <span className="font-serif font-bold text-[#B96549]">{idx + 1}.</span>
                    <span className="text-base text-[#252623]">{q}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={scrollToGetReady}
                  className="bg-[#183D35] text-[#F2EBDD] px-6 py-3 text-sm font-medium rounded hover:bg-[#183D35]/90 transition-colors"
                >
                  Get Ready to Speak
                </button>
                {schedule.proposalFormLink && (
                  <a
                    href={schedule.proposalFormLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#183D35] text-[#183D35] px-6 py-3 text-sm font-medium rounded hover:bg-[#183D35]/10 transition-colors inline-block text-center"
                  >
                    Propose a Topic
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Get Ready Sidebar / Accordions */}
          <div id="get-ready" className="space-y-6">
            <h4 className="font-serif font-bold text-2xl text-[#183D35]">Get Ready</h4>

            {/* Accordion 1: Vocabulary */}
            <div className="border border-[#252623]/20 bg-white/40 rounded">
              <button
                onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
                className="w-full flex justify-between items-center p-4 text-left font-serif font-bold text-lg text-[#183D35]"
              >
                <span>Vocabulary ({session.vocabulary.length})</span>
                <span>{openAccordion === 0 ? '−' : '+'}</span>
              </button>
              {openAccordion === 0 && (
                <div className="p-4 border-t border-[#252623]/10 space-y-4 text-sm">
                  {session.vocabulary.map((v, i) => (
                    <div key={i} className="border-b border-[#252623]/10 pb-3 last:border-0 last:pb-0">
                      <p className="font-bold text-[#183D35]">{v.word} <span className="font-normal text-[#B96549]">({v.indonesian})</span></p>
                      <p className="text-[#252623]/80 italic mt-1">"{v.example}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Express Yourself */}
            <div className="border border-[#252623]/20 bg-white/40 rounded">
              <button
                onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                className="w-full flex justify-between items-center p-4 text-left font-serif font-bold text-lg text-[#183D35]"
              >
                <span>Express Yourself</span>
                <span>{openAccordion === 1 ? '−' : '+'}</span>
              </button>
              {openAccordion === 1 && (
                <div className="p-4 border-t border-[#252623]/10 space-y-2 text-sm">
                  <p className="text-xs uppercase tracking-wider text-[#B96549] mb-2">Sentence Starters</p>
                  <ul className="space-y-2">
                    {session.sentenceStarters.map((s, i) => (
                      <li key={i} className="bg-white/60 p-2 rounded border border-[#252623]/10 italic">
                        "{s}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 3: Mini Challenge */}
            <div className="border border-[#252623]/20 bg-white/40 rounded">
              <button
                onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
                className="w-full flex justify-between items-center p-4 text-left font-serif font-bold text-lg text-[#183D35]"
              >
                <span>Mini Challenge</span>
                <span>{openAccordion === 2 ? '−' : '+'}</span>
              </button>
              {openAccordion === 2 && (
                <div className="p-4 border-t border-[#252623]/10 space-y-3 text-sm">
                  <p className="font-medium text-[#183D35]">{session.miniChallenge}</p>
                  {session.preparationChallenge && (
                    <p className="text-[#252623]/80 text-xs mt-2">{session.preparationChallenge}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
