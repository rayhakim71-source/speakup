// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect, useRef } from 'react';
import { SessionData, ScheduleSettings, GalleryPhoto } from '../../types';
import { DrivePhoto } from '../common/DrivePhoto';
import { postToAppsScript } from '../../utils/storage';

interface SessionDetailProps {
  session: SessionData;
  schedule: ScheduleSettings;
  photos: GalleryPhoto[];
  webAppUrl?: string;
  onBack: () => void;
}

export const SessionDetail: React.FC<SessionDetailProps> = ({
  session,
  schedule,
  photos,
  webAppUrl,
  onBack,
}) => {
  const docLink = session.tautanDokumentasi || schedule.generalDocLink;
  const [sessionPhotos, setSessionPhotos] = useState<GalleryPhoto[]>(() =>
    session.status === 'Arsip'
      ? [...photos].filter((p) => p.idSesi === session.id).sort((a, b) => a.urutan - b.urutan)
      : []
  );
  const [visibleCount, setVisibleCount] = useState(6);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (session.status !== 'Arsip') {
      setSessionPhotos([]);
      return;
    }
    setSessionPhotos(
      [...photos].filter((p) => p.idSesi === session.id).sort((a, b) => a.urutan - b.urutan)
    );
  }, [photos, session.id, session.status]);

  useEffect(() => {
    setVisibleCount(6);
    setLightboxIndex(null);
  }, [session.id]);

  useEffect(() => {
    if (session.status !== 'Arsip' || !webAppUrl) return;
    let cancelled = false;
    postToAppsScript(webAppUrl, { action: 'galeriDaftar', idSesi: session.id })
      .then((res) => {
        if (!cancelled && res && res.success && Array.isArray(res.photos)) {
          const sorted = [...res.photos].sort((a: GalleryPhoto, b: GalleryPhoto) => a.urutan - b.urutan);
          setSessionPhotos(sorted);
        }
      })
      .catch(() => {
        // keep prop photos if offline
      });
    return () => {
      cancelled = true;
    };
  }, [session.id, session.status, webAppUrl]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + sessionPhotos.length) % sessionPhotos.length
        );
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % sessionPhotos.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, sessionPhotos.length]);

  const handlePrint = () => {
    window.print();
  };

  const displayedPhotos = sessionPhotos.slice(0, visibleCount);
  const activePhoto = lightboxIndex !== null ? sessionPhotos[lightboxIndex] : null;

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

        {/* Photos */}
        {session.status === 'Arsip' && sessionPhotos.length > 0 && (
          <div className="no-print space-y-6">
            <h3 className="font-serif font-bold text-2xl text-[#183D35]">Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayedPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={photo.keterangan || session.topik}
                  className="block aspect-[4/3] w-full rounded overflow-hidden bg-[#252623]/10 focus:outline-none focus:ring-2 focus:ring-[#183D35]"
                >
                  <DrivePhoto
                    fileId={photo.fileId}
                    size={600}
                    alt={photo.keterangan || session.topik}
                    webAppUrl={webAppUrl}
                    lazy={true}
                  />
                </button>
              ))}
            </div>

            {visibleCount < sessionPhotos.length && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="border border-[#183D35] text-[#183D35] px-6 py-2.5 min-h-[44px] rounded text-sm font-medium hover:bg-[#183D35] hover:text-[#F2EBDD] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {activePhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null || sessionPhotos.length <= 1) return;
            const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
            const diff = endX - touchStartX.current;
            if (diff > 40) {
              setLightboxIndex((lightboxIndex - 1 + sessionPhotos.length) % sessionPhotos.length);
            } else if (diff < -40) {
              setLightboxIndex((lightboxIndex + 1) % sessionPhotos.length);
            }
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            aria-label="Tutup"
            className="fixed top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded bg-black/50 text-white hover:bg-black/75 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {sessionPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + sessionPhotos.length) % sessionPhotos.length);
              }}
              aria-label="Sebelumnya"
              className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded bg-black/50 text-white hover:bg-black/75 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            className="max-w-5xl w-full flex flex-col items-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-h-[80vh] aspect-[4/3] md:aspect-[16/10] rounded overflow-hidden bg-transparent">
              <DrivePhoto
                fileId={activePhoto.fileId}
                size={1600}
                alt={activePhoto.keterangan || session.topik}
                webAppUrl={webAppUrl}
                lazy={false}
                className="w-full h-full object-contain bg-black"
              />
            </div>
            {activePhoto.keterangan && (
              <p className="text-sm text-[#F2EBDD] text-center max-w-2xl">
                {activePhoto.keterangan}
              </p>
            )}
          </div>

          {sessionPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % sessionPhotos.length);
              }}
              aria-label="Berikutnya"
              className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded bg-black/50 text-white hover:bg-black/75 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
