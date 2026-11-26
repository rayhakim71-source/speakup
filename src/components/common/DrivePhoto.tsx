// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect, useRef } from 'react';
import {
  getDriveThumbUrl,
  getCachedGalleryImage,
  fetchGalleryImageFallback,
  getStoredSync,
} from '../../utils/storage';

interface DrivePhotoProps {
  fileId: string;
  size: 600 | 1600;
  alt: string;
  webAppUrl?: string;
  lazy?: boolean;
  className?: string;
}

export const DrivePhoto: React.FC<DrivePhotoProps> = ({
  fileId,
  size,
  alt,
  webAppUrl,
  lazy = true,
  className = 'w-full h-full object-cover',
}) => {
  const [src, setSrc] = useState<string>(() => getCachedGalleryImage(fileId) || getDriveThumbUrl(fileId, size));
  const [loaded, setLoaded] = useState<boolean>(() => Boolean(getCachedGalleryImage(fileId)));
  const [failed, setFailed] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const cached = getCachedGalleryImage(fileId);
    setSrc(cached || getDriveThumbUrl(fileId, size));
    setLoaded(Boolean(cached));
    setFailed(false);
    setTriedFallback(false);
  }, [fileId, size]);

  useEffect(() => {
    if (src.startsWith('data:')) {
      setLoaded(true);
      return;
    }
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  const handleError = async () => {
    const resolvedUrl = webAppUrl || getStoredSync().webAppUrl;
    if (!triedFallback && resolvedUrl) {
      setTriedFallback(true);
      const dataUrl = await fetchGalleryImageFallback(resolvedUrl, fileId);
      if (dataUrl) {
        setSrc(dataUrl);
        setLoaded(true);
        return;
      }
    }
    setFailed(true);
  };

  return (
    <div className="relative block w-full h-full bg-[#252623]/10 overflow-hidden">
      {!failed && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={lazy ? 'lazy' : undefined}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`block ${className} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};
