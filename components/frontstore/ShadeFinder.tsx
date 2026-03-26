// lashaz-ecommerce/components/frontstore/ShadeFinder.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 'tone',
    label: 'Identify your skin tone',
    description: 'Select the category that most closely represents your complexion.',
    options: [
      { label: 'Fair', tag: 'Fair', color: '#F9E4D4', desc: 'Porcelain to light skin' },
      { label: 'Medium', tag: 'Medium', color: '#DDBB99', desc: 'Tan to olive skin' },
      { label: 'Deep', tag: 'Deep', color: '#8D5524', desc: 'Rich to dark skin' }
    ]
  },
  {
    id: 'undertone',
    label: 'Your Undertone',
    description: 'Check your veins: Blue/Purple = Cool, Green = Warm, Both = Neutral.',
    options: [
      { label: 'Cool', tag: 'Cool', color: '#f8d7da', desc: 'Pink or bluish hues' },
      { label: 'Warm', tag: 'Warm', color: '#fff3cd', desc: 'Yellow or golden hues' },
      { label: 'Neutral', tag: 'Neutral', color: '#e2e3e5', desc: 'A balance of both' }
    ]
  },
  {
    id: 'type',
    label: 'Your Skin Type',
    description: 'This helps us recommend the perfect product finish for you.',
    options: [
      { label: 'Oily', tag: 'Oily', color: '#f0f0f0', desc: 'Focus on Matte finishes' },
      { label: 'Dry', tag: 'Dry', color: '#f0f0f0', desc: 'Focus on Dewy/Hydrating' },
      { label: 'Combination', tag: 'Combination', color: '#f0f0f0', desc: 'Balanced formulas' }
    ]
  }
];

export default function ShadeFinder() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);

  const handleSelect = (tag: string) => {
    const newSelections = [...selections, tag];
    if (step < questions.length - 1) {
      setSelections(newSelections);
      setStep(step + 1);
    } else {
      // Redirect to shop with Tone, Undertone, and Skin Type tags
      window.location.href = `/shop?tags=${newSelections.join(',')}`;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 md:p-16 bg-white rounded-[3rem] border border-zinc-100 shadow-xl shadow-zinc-200/40">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-10 text-center"
        >
          <header className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300">
              Personalizing Your Routine
            </span>
            <h2 className="text-4xl font-josefin font-bold uppercase tracking-tight text-black">
              {questions[step].label}
            </h2>
            <p className="text-zinc-400 text-xs italic">
              {questions[step].description}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {questions[step].options.map((opt) => (
              <button
                key={opt.tag}
                onClick={() => handleSelect(opt.tag)}
                className="group p-8 rounded-[2rem] border border-zinc-100 hover:border-black transition-all bg-zinc-50/50 hover:bg-white active:scale-95 flex flex-col items-center gap-6"
              >
                {/* Visual Swatch or Icon */}
                <div 
                  className="w-16 h-16 rounded-full shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: opt.color }}
                />
                
                <div className="text-center">
                  <p className="font-bold uppercase text-[10px] tracking-widest text-black mb-1">
                    {opt.label}
                  </p>
                  <p className="text-[9px] text-zinc-400 leading-tight">
                    {opt.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}