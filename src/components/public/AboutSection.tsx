// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CmsSettings } from '../../types';

interface AboutSectionProps {
  cms: CmsSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ cms }) => {
  const principles = [
    { title: 'Speak to share ideas, not just to practice English.', desc: 'Focus on your message and genuine curiosity.' },
    { title: 'Mistakes are part of learning.', desc: 'Every error shows growth and courage.' },
    { title: 'Listening is as important as speaking.', desc: 'Respect different perspectives and build on each other\'s thoughts.' },
    { title: 'Everyone has an idea worth sharing.', desc: 'Your voice matters in our community.' },
  ];

  return (
    <section id="about" className="bg-[#F2EBDD] text-[#252623] py-24 px-6 border-b border-[#252623]/10">
      <div className="max-w-4xl mx-auto space-y-16">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">About</p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl mb-8">ABOUT SPEAK UP!</h2>
          
          <div className="space-y-6 text-lg text-[#252623]/90 leading-relaxed font-serif">
            <p>
              SPEAK UP! is an English-speaking habituation program created to help students build confidence, communicate ideas, and develop the habit of using English in meaningful situations.
            </p>
            <p>
              Inspired by TED-style talks and thoughtful conversations, students explore relevant topics, listen to different perspectives, express opinions, ask questions, and learn from one another.
            </p>
            <p>
              We believe language is not learned only by memorizing words or studying grammar. Language grows through use. Students don't need perfect English to begin. They need ideas, courage, curiosity, and the willingness to keep trying.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-serif font-bold text-3xl text-[#183D35] mb-8">Our Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((p, idx) => (
              <div key={idx} className="bg-white/60 border border-[#252623]/10 p-6 rounded">
                <span className="font-serif font-bold text-2xl text-[#B96549] block mb-2">0{idx + 1}</span>
                <h4 className="font-serif font-bold text-lg text-[#183D35] mb-2">{p.title}</h4>
                <p className="text-sm text-[#252623]/80">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
