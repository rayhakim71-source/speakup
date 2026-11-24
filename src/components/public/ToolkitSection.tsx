// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { ToolkitCategory } from '../../types';

interface ToolkitSectionProps {
  toolkit: ToolkitCategory[];
}

export const ToolkitSection: React.FC<ToolkitSectionProps> = ({ toolkit }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(toolkit[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedExpr, setExpandedExpr] = useState<string | null>(null);

  const activeCategory = toolkit.find((c) => c.id === selectedCatId) || toolkit[0];

  // If search query is present, filter across all categories
  const filteredExpressions = searchQuery.trim()
    ? toolkit.flatMap((c) => c.expressions.map((e) => ({ ...e, categoryName: c.name }))).filter(
        (item) =>
          item.expression.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.meaningIndonesian && item.meaningIndonesian.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.example.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory?.expressions || [];

  return (
    <section id="toolkit" className="bg-[#F2EBDD] text-[#252623] py-24 px-6 border-b border-[#252623]/10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Speaking Toolkit</p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4">Words to help you join the conversation.</h2>
        </div>

        {/* Search input */}
        <div className="mb-8 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ekspresi..."
            className="w-full bg-white border border-[#252623]/20 px-4 py-3 rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>

        {/* Categories (hidden if searching) */}
        {!searchQuery && (
          <div className="flex overflow-x-auto space-x-2 pb-4 mb-8 no-scrollbar">
            {toolkit.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-5 py-2.5 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCatId === cat.id
                    ? 'bg-[#183D35] text-[#F2EBDD]'
                    : 'bg-white/60 text-[#252623] border border-[#252623]/10 hover:bg-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Expressions List */}
        <div className="space-y-4">
          {filteredExpressions.length === 0 ? (
            <p className="text-base text-[#252623]/60 italic py-8">Belum ada data</p>
          ) : (
            filteredExpressions.map((item, idx) => {
              const key = item.expression + idx;
              const isExpanded = expandedExpr === key;
              return (
                <div key={key} className="bg-white/60 border border-[#252623]/10 rounded overflow-hidden">
                  <button
                    onClick={() => setExpandedExpr(isExpanded ? null : key)}
                    className="w-full text-left p-5 flex justify-between items-center hover:bg-white/80 transition-colors"
                  >
                    <div>
                      {'categoryName' in item && (
                        <span className="text-xs uppercase tracking-wider text-[#B96549] block mb-1">
                          {(item as any).categoryName}
                        </span>
                      )}
                      <span className="font-serif font-bold text-xl text-[#183D35]">{item.expression}</span>
                      {item.function && <span className="text-sm text-[#252623]/60 ml-3">({item.function})</span>}
                    </div>
                    <span className="text-xl text-[#183D35]">{isExpanded ? '−' : '+'}</span>
                  </button>
                  {isExpanded && (
                    <div className="p-5 border-t border-[#252623]/10 bg-white/40 space-y-3 text-sm">
                      {item.meaningIndonesian && (
                        <p><strong className="text-[#B96549]">Arti:</strong> {item.meaningIndonesian}</p>
                      )}
                      <p className="italic text-[#252623]/90"><strong className="not-italic text-[#183D35]">Contoh:</strong> "{item.example}"</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
