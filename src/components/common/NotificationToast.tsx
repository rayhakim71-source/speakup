// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';

interface NotificationToastProps {
  message: string | null;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#183D35] text-[#F2EBDD] px-5 py-3 rounded shadow-lg text-sm tracking-wide animate-fade-in">
      {message}
    </div>
  );
};
