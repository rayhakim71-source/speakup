// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect } from 'react';
import { ToolkitCategory, ExpressionItem } from '../../types';

interface AdminToolkitProps {
  toolkit: ToolkitCategory[];
  onSaveToolkit: (toolkit: ToolkitCategory[]) => void;
  showToast: (msg: string) => void;
}

export const AdminToolkit: React.FC<AdminToolkitProps> = ({ toolkit, onSaveToolkit, showToast }) => {
  const [categories, setCategories] = useState<ToolkitCategory[]>(toolkit);
  const [selectedCatId, setSelectedCatId] = useState<string>(toolkit[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCategories(toolkit);
  }, [toolkit]);

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleAddExpression = () => {
    if (!activeCategory) return;
    const updated = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        return {
          ...cat,
          expressions: [...cat.expressions, { expression: '', function: '', meaningIndonesian: '', example: '' }],
        };
      }
      return cat;
    });
    setCategories(updated);
  };

  const handleUpdateExpr = (index: number, field: keyof ExpressionItem, value: string) => {
    const updated = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        const exprs = [...cat.expressions];
        exprs[index] = { ...exprs[index], [field]: value };
        return { ...cat, expressions: exprs };
      }
      return cat;
    });
    setCategories(updated);
  };

  const handleDeleteExpr = (index: number) => {
    const updated = categories.map((cat) => {
      if (cat.id === activeCategory.id) {
        return {
          ...cat,
          expressions: cat.expressions.filter((_, i) => i !== index),
        };
      }
      return cat;
    });
    setCategories(updated);
  };

  const handleSave = () => {
    onSaveToolkit(categories);
    showToast('Berhasil disimpan');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Manajemen</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Speaking Toolkit</h2>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#183D35] text-[#F2EBDD] px-6 py-2.5 rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
        >
          Simpan
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCatId === cat.id
                ? 'bg-[#183D35] text-[#F2EBDD]'
                : 'bg-white text-[#252623] border border-[#252623]/10 hover:bg-[#F2EBDD]/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Category Editor */}
      {activeCategory && (
        <div className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[#252623]/10 pb-4">
            <h3 className="font-serif font-bold text-2xl text-[#183D35]">{activeCategory.name}</h3>
            <button
              type="button"
              onClick={handleAddExpression}
              className="px-4 py-2 bg-[#183D35] text-[#F2EBDD] text-xs rounded hover:bg-[#183D35]/90"
            >
              Tambah Ekspresi
            </button>
          </div>

          <div className="space-y-6">
            {activeCategory.expressions.map((expr, idx) => (
              <div key={idx} className="bg-[#F2EBDD]/30 border border-[#252623]/10 p-6 rounded space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Ekspresi</label>
                    <input
                      type="text"
                      value={expr.expression}
                      onChange={(e) => handleUpdateExpr(idx, 'expression', e.target.value)}
                      className="w-full bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Fungsi</label>
                    <input
                      type="text"
                      value={expr.function || ''}
                      onChange={(e) => handleUpdateExpr(idx, 'function', e.target.value)}
                      className="w-full bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Arti Indonesia</label>
                    <input
                      type="text"
                      value={expr.meaningIndonesian || ''}
                      onChange={(e) => handleUpdateExpr(idx, 'meaningIndonesian', e.target.value)}
                      className="w-full bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Contoh Kalimat</label>
                    <input
                      type="text"
                      value={expr.example}
                      onChange={(e) => handleUpdateExpr(idx, 'example', e.target.value)}
                      className="w-full bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteExpr(idx)}
                    className="px-4 py-1.5 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
