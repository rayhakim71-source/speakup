// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { SessionData, GalleryPhoto } from '../../types';
import { DrivePhoto } from '../common/DrivePhoto';

interface ArchiveSectionProps {
  sessions: SessionData[];
  gallery: GalleryPhoto[];
  webAppUrl?: string;
  onSelectSession: (id: string) => void;
}

export const ArchiveSection: React.FC<ArchiveSectionProps> = ({
  sessions,
  gallery,
  webAppUrl,
  onSelectSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const archivedSessions = sessions
    .filter((s) => s.status === 'Arsip')
    .filter((s) =>
      s.topik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pertanyaanUtama.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.number.localeCompare(a.number));

  const getCoverPhoto = (sessionId: string): GalleryPhoto | null => {
    const photos = gallery
      .filter((p) => p.idSesi === sessionId)
      .sort((a, b) => a.urutan - b.urutan);
    return photos[0] || null;
  };

  return (
    <section id="archive" className="bg-[#F2EBDD] text-[#252623] py-24 px-6 border-b border-[#252623]/10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Session Archive</p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4">Every Talk Leaves Something Behind.</h2>
        </div>

        {/* Search */}
        <div className="mb-10 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari sesi atau topik..."
            className="w-full bg-white border border-[#252623]/20 px-4 py-3 rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archivedSessions.length === 0 ? (
            <p className="text-base text-[#252623]/60 italic py-8">Belum ada data</p>
          ) : (
            archivedSessions.map((session) => {
              const coverPhoto = getCoverPhoto(session.id);
              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className="bg-white/60 border border-[#252623]/10 p-8 rounded cursor-pointer hover:bg-white hover:border-[#183D35] transition-all flex flex-col justify-between"
                >
                  <div>
                    {coverPhoto && (
                      <div className="aspect-[4/3] w-full rounded overflow-hidden bg-[#252623]/10 mb-5">
                        <DrivePhoto
                          fileId={coverPhoto.fileId}
                          size={600}
                          alt={coverPhoto.keterangan || session.topik}
                          webAppUrl={webAppUrl}
                          lazy={true}
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-serif font-bold text-2xl text-[#B96549]">{session.number}</span>
                      <span className="text-xs text-[#252623]/60">{session.tanggal}</span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#183D35] mb-3 leading-snug">
                      {session.topik}
                    </h3>
                    <p className="text-sm text-[#252623]/80 italic line-clamp-3 mb-6">
                      "{session.pertanyaanUtama}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#252623]/10 text-xs font-semibold uppercase tracking-wider text-[#183D35]">
                    Lihat Detail →
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
