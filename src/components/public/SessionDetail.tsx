// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { SessionData, ScheduleSettings } from '../../types';

interface SessionDetailProps {
  session: SessionData;
  schedule: ScheduleSettings;
  onBack: () => void;
}

export const SessionDetail: React.FC<SessionDetailProps> = ({ session, schedule, onBack }) => {
  const docLink = session.tautanDokumentasi || schedule.generalDocLink;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F2EBDD] text-[#252623] min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center no-print border-b border-[#252623]/20 pb-6">
          <button
            onClick={onBack}
            className="text-sm font-medium text-[#183D35] hover:text-[#B96549] transition-colors"
          >
            ← Kembali ke Beranda
          </button>
          <div className="flex space-x-3">
            {docLink && (
              <a
                href={docLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#183D35] text-[#F2EBDD] px-4 py-2 text-sm font-medium rounded hover:bg-[#183D35]/90 transition-colors"
              >
                View Documentation
              </a>
            )}
            <button
              onClick={handlePrint}
              className="border border-[#252623] px-4 py-2 text-sm font-medium hover:bg-[#252623] hover:text-[#F2EBDD] transition-colors"
            >
              Print
            </button>
          </div>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 text-sm text-[#B96549] font-medium mb-3">
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
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-[#183D35] mb-6 leading-tight">
            {session.topik}
          </h1>
          <p className="font-serif italic text-2xl text-[#252623]/90 mb-8">
            "{session.pertanyaanUtama}"
          </p>
          {session.ringkasan && (
            <div className="bg-white/60 border border-[#252623]/10 p-6 rounded">
              <h3 className="font-serif font-bold text-lg text-[#183D35] mb-2">Discussion Summary</h3>
              <p className="text-base text-[#252623]/80 leading-relaxed">{session.ringkasan}</p>
            </div>
          )}
        </div>

        {/* Key Expressions */}
        {session.expressions.length > 0 && (
          <div>
            <h3 className="font-serif font-bold text-2xl text-[#183D35] mb-6">Key Expressions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {session.expressions.map((expr, idx) => (
                <div key={idx} className="bg-white/60 border border-[#252623]/10 p-5 rounded space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-serif font-bold text-lg text-[#183D35]">{expr.expression}</span>
                    {expr.function && <span className="text-xs uppercase text-[#B96549]">{expr.function}</span>}
                  </div>
                  {expr.meaningIndonesian && <p className="text-sm text-[#252623]/70">Arti: {expr.meaningIndonesian}</p>}
                  <p className="text-sm italic text-[#252623]/90">"{expr.example}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulary */}
        {session.vocabulary.length > 0 && (
          <div>
            <h3 className="font-serif font-bold text-2xl text-[#183D35] mb-6">Vocabulary</h3>
            <div className="space-y-4">
              {session.vocabulary.map((vocab, idx) => (
                <div key={idx} className="bg-white/60 border border-[#252623]/10 p-5 rounded">
                  <p className="font-serif font-bold text-lg text-[#183D35]">
                    {vocab.word} <span className="text-base font-normal text-[#B96549]">({vocab.indonesian})</span>
                  </p>
                  <p className="text-sm text-[#252623]/80 mt-1">{vocab.definition}</p>
                  <p className="text-sm italic text-[#252623]/70 mt-2">"{vocab.example}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speaking Challenge */}
        {session.tantanganPertanyaan && (
          <div className="bg-[#183D35] text-[#F2EBDD] p-8 rounded space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[#D6A64A]">Speaking Challenge</h3>
            <p className="text-lg font-serif italic">"{session.tantanganPertanyaan}"</p>
            {session.tantanganRespons && (
              <div className="bg-white/10 p-4 rounded text-sm">
                <p className="text-[#D6A64A] font-medium mb-1">Contoh Respons:</p>
                <p className="italic">"{session.tantanganRespons}"</p>
              </div>
            )}
            <div className="pt-4 border-t border-[#D6A64A]/30 text-xs text-[#F2EBDD]/70 space-y-1">
              <p>Use at least two expressions from this session. Give one reason or example. Speak for 30–60 seconds.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
