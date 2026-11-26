// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useRef, useEffect } from 'react';
import { GalleryPhoto, SyncSettings } from '../../types';
import {
  compressImageFile,
  postToAppsScript,
  getStoredSync,
  addHistoryItem,
} from '../../utils/storage';
import { DrivePhoto } from '../common/DrivePhoto';

interface AdminSessionPhotosProps {
  sessionId: string;
  sessionTopik: string;
  photos: GalleryPhoto[];
  sync: SyncSettings;
  role: string;
  onPhotoAdded: (photo: GalleryPhoto) => void;
  onPhotoUpdated: (photo: GalleryPhoto) => void;
  onPhotosReordered: (updatedSessionPhotos: GalleryPhoto[]) => void;
  onPhotoDeleted: (photoId: string) => void;
  showToast: (msg: string) => void;
}

interface PendingUploadItem {
  localId: string;
  file: File;
  previewUrl: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;

export const AdminSessionPhotos: React.FC<AdminSessionPhotosProps> = ({
  sessionId,
  sessionTopik,
  photos,
  sync,
  role,
  onPhotoAdded,
  onPhotoUpdated,
  onPhotosReordered,
  onPhotoDeleted,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingUploadItem[]>([]);
  const [caption, setCaption] = useState('');
  const [hasConsent, setHasConsent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [editingCaptions, setEditingCaptions] = useState<Record<string, string>>({});
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryPhoto | null>(null);

  const sortedPhotos = [...photos]
    .filter((p) => p.idSesi === sessionId)
    .sort((a, b) => a.urutan - b.urutan);

  useEffect(() => {
    const map: Record<string, string> = {};
    sortedPhotos.forEach((p) => {
      map[p.id] = p.keterangan;
    });
    setEditingCaptions(map);
  }, [photos, sessionId]);

  useEffect(() => {
    return () => {
      pendingItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const activeSync = sync.webAppUrl ? sync : getStoredSync();

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []);
    e.target.value = '';
    if (fileList.length === 0) return;

    const remainingSlots = MAX_FILES_PER_UPLOAD - pendingItems.length;
    if (remainingSlots <= 0) {
      showToast('Maksimal 10 foto');
      return;
    }

    const accepted: PendingUploadItem[] = [];
    let rejected = false;

    for (const file of fileList) {
      if (accepted.length >= remainingSlots) {
        rejected = true;
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_BYTES) {
        rejected = true;
        continue;
      }
      accepted.push({
        localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (accepted.length > 0) {
      setPendingItems((prev) => [...prev, ...accepted]);
    }
    if (rejected) {
      showToast('Gagal memilih sebagian foto');
    }
  };

  const handleRemovePending = (localId: string) => {
    setPendingItems((prev) => {
      const target = prev.find((i) => i.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.localId !== localId);
    });
  };

  const handleUpload = async () => {
    if (pendingItems.length === 0 || !hasConsent || uploading) return;
    if (!activeSync.webAppUrl) {
      showToast('Gagal mengunggah');
      return;
    }

    setUploading(true);
    const queue = [...pendingItems];
    setProgress({ current: 0, total: queue.length });

    const maxUrutan = sortedPhotos.reduce((max, p) => Math.max(max, Number(p.urutan || 0)), 0);
    let nextUrutan = maxUrutan + 1;
    const failedIds = new Set<string>();

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      setProgress({ current: i + 1, total: queue.length });
      try {
        const compressed = await compressImageFile(item.file);
        const res = await postToAppsScript(activeSync.webAppUrl, {
          action: 'galeriUnggah',
          token: activeSync.token,
          idSesi: sessionId,
          fileName: compressed.fileName,
          mimeType: compressed.mimeType,
          base64: compressed.base64,
          keterangan: caption.trim(),
          urutan: nextUrutan,
        });

        if (res && res.success && res.photo) {
          onPhotoAdded(res.photo as GalleryPhoto);
          addHistoryItem(role, 'Foto', `Mengunggah foto: ${sessionTopik}`);
          nextUrutan++;
        } else {
          failedIds.add(item.localId);
          showToast('Gagal mengunggah');
        }
      } catch {
        failedIds.add(item.localId);
        showToast('Gagal mengunggah');
      }
    }

    setPendingItems((prev) => {
      prev.forEach((item) => {
        if (!failedIds.has(item.localId)) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      return prev.filter((item) => failedIds.has(item.localId));
    });

    if (failedIds.size === 0) {
      setCaption('');
      setHasConsent(false);
      showToast('Berhasil diunggah');
    }

    setUploading(false);
    setProgress({ current: 0, total: 0 });
  };

  const handleSaveCaption = async (photo: GalleryPhoto) => {
    const newKet = editingCaptions[photo.id] ?? '';
    setBusyPhotoId(photo.id);
    try {
      if (activeSync.webAppUrl) {
        const res = await postToAppsScript(activeSync.webAppUrl, {
          action: 'galeriUbah',
          token: activeSync.token,
          id: photo.id,
          keterangan: newKet,
        });
        if (!res || !res.success) {
          showToast('Gagal');
          return;
        }
      }
      onPhotoUpdated({ ...photo, keterangan: newKet });
      addHistoryItem(role, 'Foto', `Mengubah keterangan foto: ${sessionTopik}`);
      showToast('Berhasil disimpan');
    } catch {
      showToast('Gagal');
    } finally {
      setBusyPhotoId(null);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sortedPhotos.length) return;

    const reordered = [...sortedPhotos];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    const normalized = reordered.map((p, idx) => ({ ...p, urutan: idx + 1 }));
    onPhotosReordered(normalized);

    if (activeSync.webAppUrl) {
      try {
        await postToAppsScript(activeSync.webAppUrl, {
          action: 'galeriUbah',
          token: activeSync.token,
          updates: normalized.map((p) => ({ id: p.id, urutan: p.urutan })),
        });
        addHistoryItem(role, 'Foto', `Mengubah urutan foto: ${sessionTopik}`);
        showToast('Berhasil disimpan');
      } catch {
        showToast('Gagal');
      }
    }
  };

  const confirmDeletePhoto = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setBusyPhotoId(target.id);
    try {
      if (activeSync.webAppUrl) {
        const res = await postToAppsScript(activeSync.webAppUrl, {
          action: 'galeriHapus',
          token: activeSync.token,
          id: target.id,
        });
        if (!res || !res.success) {
          showToast('Gagal');
          return;
        }
      }
      onPhotoDeleted(target.id);
      addHistoryItem(role, 'Foto', `Menghapus foto: ${sessionTopik}`);
      showToast('Berhasil dihapus');
    } catch {
      showToast('Gagal');
    } finally {
      setBusyPhotoId(null);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-[#252623]/10">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h4 className="font-serif font-bold text-lg text-[#183D35]">Foto</h4>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 min-h-[44px] border border-[#183D35] text-[#183D35] rounded text-xs font-medium hover:bg-[#183D35]/10 disabled:opacity-50"
        >
          Pilih Foto
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleSelectFiles}
          className="hidden"
        />
      </div>

      {pendingItems.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {pendingItems.map((item) => (
            <div key={item.localId} className="relative aspect-[4/3] rounded overflow-hidden bg-[#252623]/10 border border-[#252623]/15">
              <img
                src={item.previewUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => handleRemovePending(item.localId)}
                aria-label="Hapus"
                className="absolute top-1 right-1 w-8 h-8 flex items-center justify-center rounded bg-black/60 text-white hover:bg-red-700 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Keterangan</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={uploading}
            placeholder=""
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 min-h-[44px] rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center space-x-2 text-sm cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
              disabled={uploading}
              className="w-4 h-4 text-[#183D35] focus:ring-[#183D35] border-gray-300 rounded"
            />
            <span>Izin publikasi tersedia</span>
          </label>

          <button
            type="button"
            onClick={handleUpload}
            disabled={pendingItems.length === 0 || !hasConsent || uploading}
            className="px-5 py-2 min-h-[44px] bg-[#183D35] text-[#F2EBDD] rounded text-sm font-medium hover:bg-[#183D35]/90 disabled:opacity-40 flex items-center space-x-2"
          >
            {uploading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <span>{uploading ? `${progress.current}/${progress.total}` : 'Unggah'}</span>
          </button>
        </div>
      </div>

      {sortedPhotos.length > 0 && (
        <div className="space-y-3 pt-2">
          {sortedPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#F2EBDD]/30 p-3 rounded border border-[#252623]/10"
            >
              <div className="w-24 aspect-[4/3] rounded overflow-hidden bg-[#252623]/10 shrink-0">
                <DrivePhoto
                  fileId={photo.fileId}
                  size={600}
                  alt={photo.keterangan || sessionTopik}
                  webAppUrl={activeSync.webAppUrl}
                  lazy={true}
                />
              </div>

              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editingCaptions[photo.id] ?? ''}
                  onChange={(e) =>
                    setEditingCaptions((prev) => ({ ...prev, [photo.id]: e.target.value }))
                  }
                  placeholder=""
                  className="flex-1 bg-white border border-[#252623]/20 px-3 py-2 min-h-[44px] rounded text-sm focus:outline-none focus:border-[#183D35]"
                />
                <button
                  type="button"
                  disabled={busyPhotoId === photo.id}
                  onClick={() => handleSaveCaption(photo)}
                  className="px-3 py-2 min-h-[44px] bg-[#183D35] text-[#F2EBDD] text-xs rounded hover:bg-[#183D35]/90 disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>

              <div className="flex items-center space-x-2 justify-end">
                <button
                  type="button"
                  disabled={idx === 0 || busyPhotoId === photo.id}
                  onClick={() => handleMove(idx, -1)}
                  aria-label="Naik"
                  className="w-11 h-11 flex items-center justify-center border border-[#252623]/20 bg-white rounded hover:bg-[#252623]/5 disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={idx === sortedPhotos.length - 1 || busyPhotoId === photo.id}
                  onClick={() => handleMove(idx, 1)}
                  aria-label="Turun"
                  className="w-11 h-11 flex items-center justify-center border border-[#252623]/20 bg-white rounded hover:bg-[#252623]/5 disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={busyPhotoId === photo.id}
                  onClick={() => setDeleteTarget(photo)}
                  className="px-3 py-2 min-h-[44px] bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#F2EBDD] text-[#252623] w-full max-w-sm p-6 rounded shadow-xl border border-[#D6A64A]/30 space-y-5">
            <h3 className="font-serif font-bold text-xl text-[#183D35]">Hapus foto?</h3>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 min-h-[44px] border border-[#252623]/30 rounded text-sm hover:bg-[#252623]/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeletePhoto}
                className="px-5 py-2 min-h-[44px] bg-red-700 text-white rounded text-sm font-medium hover:bg-red-800"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
