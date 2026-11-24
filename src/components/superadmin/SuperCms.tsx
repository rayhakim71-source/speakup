// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { CmsSettings } from '../../types';

interface SuperCmsProps {
  cms: CmsSettings;
  onSaveCms: (cms: CmsSettings) => void;
  showToast: (msg: string) => void;
}

export const SuperCms: React.FC<SuperCmsProps> = ({ cms, onSaveCms, showToast }) => {
  const [form, setForm] = useState<CmsSettings>(cms);
  const [activeTab, setActiveTab] = useState<'identity' | 'nav' | 'buttons' | 'footer'>('identity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCms(form);
    showToast('Berhasil disimpan');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">CMS Superadmin</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Pengaturan Tampilan</h2>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#183D35] text-[#F2EBDD] px-6 py-2.5 rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
        >
          Simpan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#252623]/10 pb-4">
        {(['identity', 'nav', 'buttons', 'footer'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-[#183D35] text-[#F2EBDD]'
                : 'bg-white text-[#252623] border border-[#252623]/10 hover:bg-[#F2EBDD]/50'
            }`}
          >
            {tab === 'identity' ? 'Identitas' : tab === 'nav' ? 'Navigasi' : tab === 'buttons' ? 'Tombol' : 'Footer'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-6">
        {activeTab === 'identity' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Program</label>
              <input
                type="text"
                value={form.programName}
                onChange={(e) => setForm({ ...form, programName: e.target.value })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slogan</label>
              <input
                type="text"
                value={form.slogan}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Label Atas Hero</label>
              <input
                type="text"
                value={form.heroTopLabel}
                onChange={(e) => setForm({ ...form, heroTopLabel: e.target.value })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Judul Halaman (SEO)</label>
              <input
                type="text"
                value={form.pageTitle}
                onChange={(e) => setForm({ ...form, pageTitle: e.target.value })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi Halaman (SEO)</label>
              <textarea
                value={form.pageDescription}
                onChange={(e) => setForm({ ...form, pageDescription: e.target.value })}
                rows={3}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
          </div>
        )}

        {activeTab === 'nav' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#183D35]">Menu Navigasi</h3>
            {form.menuItems.map((item, idx) => (
              <div key={item.href} className="flex items-center space-x-4 bg-[#F2EBDD]/30 p-4 rounded border border-[#252623]/10">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const updated = [...form.menuItems];
                    updated[idx].label = e.target.value;
                    setForm({ ...form, menuItems: updated });
                  }}
                  className="flex-1 bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const updated = [...form.menuItems];
                    updated[idx].href = e.target.value;
                    setForm({ ...form, menuItems: updated });
                  }}
                  className="w-40 bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm"
                />
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) => {
                      const updated = [...form.menuItems];
                      updated[idx].visible = e.target.checked;
                      setForm({ ...form, menuItems: updated });
                    }}
                    className="w-4 h-4"
                  />
                  <span>Tampil</span>
                </label>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#183D35]">Tombol Aksi</h3>
            {form.buttons.map((btn, idx) => (
              <div key={btn.name} className="flex items-center space-x-4 bg-[#F2EBDD]/30 p-4 rounded border border-[#252623]/10">
                <span className="w-32 font-medium text-sm">{btn.name}</span>
                <input
                  type="text"
                  value={btn.label}
                  onChange={(e) => {
                    const updated = [...form.buttons];
                    updated[idx].label = e.target.value;
                    setForm({ ...form, buttons: updated });
                  }}
                  className="flex-1 bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm"
                />
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={btn.visible}
                    onChange={(e) => {
                      const updated = [...form.buttons];
                      updated[idx].visible = e.target.checked;
                      setForm({ ...form, buttons: updated });
                    }}
                    className="w-4 h-4"
                  />
                  <span>Tampil</span>
                </label>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <input
                type="text"
                value={form.footer.address}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, address: e.target.value } })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp (Nomor)</label>
              <input
                type="text"
                value={form.footer.whatsapp}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, whatsapp: e.target.value } })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram (Username)</label>
              <input
                type="text"
                value={form.footer.instagram}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, instagram: e.target.value } })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[#252623]/10">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#183D35] text-[#F2EBDD] rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};
