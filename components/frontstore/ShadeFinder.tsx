'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FingerPrintIcon, 
  SparklesIcon, 
  BeakerIcon, 
  SunIcon,
  HandRaisedIcon,
  ArrowDownTrayIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

// --- TYPES ---
interface ProtocolOption {
  label: string;
  value: string;
  desc: string;
  color?: string;
  iconColor?: string;
  icon?: any;
}

interface ProtocolStep {
  id: string;
  question: string;
  visual: 'veins' | 'swatch' | 'icon' | 'grid';
  options: ProtocolOption[];
}

// --- DATA ---
const PROTOCOL_STEPS: ProtocolStep[] = [
  {
    id: 'undertone',
    question: 'What is your natural undertone?',
    visual: 'veins',
    options: [
      { label: 'Cool', value: 'Cool', color: '#1E3A8A', iconColor: '#A5B4FC', desc: 'Veins appear blue/purple' },
      { label: 'Neutral', value: 'Neutral', color: '#6B7280', iconColor: '#E5E7EB', desc: 'Veins appear blue/green' },
      { label: 'Warm', value: 'Warm', color: '#166534', iconColor: '#BBF7D0', desc: 'Veins appear olive/green' },
    ]
  },
  {
    id: 'surface',
    question: 'Select your depth profile.',
    visual: 'swatch',
    options: [
      { label: 'Fair/Light', value: 'Fair', color: '#FDF2E9', desc: 'Burns easily in sun' },
      { label: 'Medium', value: 'Medium', color: '#E9C4A6', desc: 'Tans gradually' },
      { label: 'Tan/Deep', value: 'Deep', color: '#A0522D', desc: 'Rarely burns' },
    ]
  },
  {
    id: 'environment',
    question: 'Current skin condition?',
    visual: 'icon',
    options: [
      { label: 'Oily', value: 'Oily', icon: BeakerIcon, desc: 'Visible shine / pores' },
      { label: 'Dry', value: 'Dry', icon: SunIcon, desc: 'Tightness / flaking' },
      { label: 'Combination', value: 'Combination', icon: SparklesIcon, desc: 'Oily T-zone' },
    ]
  },
  {
    id: 'finish',
    question: 'Desired aesthetic finish?',
    visual: 'grid',
    options: [
      { label: 'Matte', value: 'Matte', desc: 'Velvet, zero shine' },
      { label: 'Dewy', value: 'Dewy', desc: 'Glass-skin, radiant' },
      { label: 'Satin', value: 'Satin', desc: 'Natural, skin-like' },
    ]
  },
  {
    id: 'coverage',
    question: 'Preferred opacity level?',
    visual: 'icon', 
    options: [
      { label: 'Sheer', value: 'Sheer', icon: HandRaisedIcon, desc: 'Second-skin feel' },
      { label: 'Medium', value: 'Medium', icon: HandRaisedIcon, desc: 'Buildable daily wear' },
      { label: 'Full', value: 'Full', icon: HandRaisedIcon, desc: 'Total correction' },
    ]
  }
];

export default function ShadeFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const router = useRouter();

  // --- ANALYSIS LOGIC ---
  const generateAnalysis = (data: string[]) => {
    const [undertone, surface, skinType, finish, coverage] = data;
    
    let shade = "Custom Protocol";
    let detail = "Your profile suggests a specialized blend of pigment and hydration.";

    if (surface === 'Fair') {
      if (undertone === 'Cool') {
        shade = "Foundation - KPOP";
        detail = "Optimized for fair skin with pinkish undertones to prevent ashy oxidation.";
      } else {
        shade = "Foundation - IVORY";
        detail = "The ideal match for Kuning Langsat tones, providing a radiant yellow-base glow.";
      }
    } else if (surface === 'Medium') {
      shade = "Foundation - ALMOND";
      detail = "A versatile neutral formula designed for a seamless 'my skin but better' finish.";
    } else if (surface === 'Deep') {
      shade = "Foundation - AMBER";
      detail = "A rich, warm formulation crafted specifically for Sawo Matang skin profiles.";
    }

    return { shade, detail, skinType, finish, coverage, accuracy: (Math.random() * (99.8 - 97.2) + 97.2).toFixed(1) };
  };

  useEffect(() => {
    if (isCalculating) {
      const messages = ["Analyzing Biological Signature...", "Calibrating Pigment Harmony...", "Scanning Non-Comedogenic Filters...", "Finalizing Identity Match..."];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(messages[i % messages.length]);
        i++;
      }, 900);
      return () => clearInterval(interval);
    }
  }, [isCalculating]);

  const handleSelect = (val: string) => {
    const updated = [...selections, val];
    setSelections(updated);
    
    if (currentStep < PROTOCOL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setAnalysis(generateAnalysis(updated));
        setIsCalculating(false);
        setShowResult(true);
      }, 3800);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[600px] flex items-center justify-center relative">
      {/* INTERNAL PRINT STYLES */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: #FAF9F6 !important;
            -webkit-print-color-adjust: exact;
            padding: 60px !important;
            margin: 0 !important;
            border: none !important;
          }
          .no-print { display: none !important; }
          @page { margin: 0; size: auto; }
        }
      `}</style>

      <div style={{ backgroundColor: '#FAF9F6' }} className="w-full border border-zinc-100 rounded-[2.5rem] shadow-[0_48px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-500">
        <AnimatePresence mode="wait">
          {isCalculating ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-10 py-24 text-center">
              <div className="relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-28 w-28 border-2 border-zinc-100 border-t-black rounded-full" />
                <FingerPrintIcon className="h-10 w-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black" />
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-black animate-pulse">{loadingText}</p>
                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Algorithm v2.0</p>
              </div>
            </motion.div>
          ) : showResult ? (
            /* --- ANALYSIS RESULT VIEW --- */
            <motion.div 
              key="result" 
              id="printable-area"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full px-10 py-16 md:px-20 text-center space-y-12 bg-[#FAF9F6]"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full">
                  <SparklesIcon className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Protocol Match: {analysis.accuracy}%</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-josefin font-bold uppercase tracking-tighter text-black leading-tight">
                  Your Identity <br /> <span className="text-zinc-300 italic font-light">Signature</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left border-y border-zinc-100 py-12">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Recommended Shade</p>
                    <p className="text-3xl font-josefin font-bold text-black uppercase">{analysis.shade}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Diagnostic Summary</p>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">{analysis.detail}</p>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl space-y-5 border border-white/50 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black">Technical Specifications</p>
                  {[
                    { label: 'Environment', value: analysis.skinType },
                    { label: 'Visual Finish', value: analysis.finish },
                    { label: 'Coverage Opacity', value: analysis.coverage }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-zinc-100 pb-2">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase">{item.label}</span>
                      <span className="text-[10px] text-black font-bold uppercase tracking-tighter">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
                <button 
                  onClick={() => router.push(`/shop?tags=${encodeURIComponent(selections.join(','))}`)}
                  className="group bg-black text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                  <ShoppingBagIcon className="h-4 w-4" />
                  Shop My Match
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black border border-zinc-200 hover:border-black transition-all flex items-center justify-center gap-3"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download Protocol
                </button>
              </div>
            </motion.div>
          ) : (
            /* --- QUIZ STEPS VIEW --- */
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full px-10 py-12 md:px-16">
              <div className="flex flex-col items-center text-center mb-16">
                <div className="flex items-center gap-3 mb-10">
                  <span className="text-[10px] font-bold text-black bg-black/5 px-3 py-1 rounded-full uppercase tracking-[0.3em]">PHASE {currentStep + 1}</span>
                  <div className="h-[1px] w-12 bg-zinc-100" />
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Protocol: {PROTOCOL_STEPS[currentStep].id}</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-josefin font-bold uppercase tracking-tighter text-black leading-[0.9] max-w-lg mb-6">{PROTOCOL_STEPS[currentStep].question}</h2>
              </div>

              <div className={`${PROTOCOL_STEPS[currentStep].visual === 'grid' ? 'grid grid-cols-1 md:grid-cols-3' : 'flex flex-col'} gap-4`}>
                {PROTOCOL_STEPS[currentStep].options.map((opt) => {
                  const OptionIcon = opt.icon;
                  return (
                    <button key={opt.value} onClick={() => handleSelect(opt.value)} className={`group flex items-center gap-6 p-6 border border-zinc-100 rounded-3xl hover:border-black hover:bg-white hover:shadow-xl transition-all duration-500 text-left ${PROTOCOL_STEPS[currentStep].visual === 'grid' ? 'flex-col text-center justify-center p-10' : ''}`}>
                      {PROTOCOL_STEPS[currentStep].visual === 'veins' && opt.color && (
                        <div className="relative flex items-center justify-center h-12 w-12 flex-shrink-0">
                          <div style={{ backgroundColor: opt.color }} className="absolute inset-0 rounded-full blur-sm opacity-20" />
                          <BeakerIcon style={{ color: opt.color }} className="h-6 w-6" />
                        </div>
                      )}
                      {PROTOCOL_STEPS[currentStep].visual === 'swatch' && opt.color && (
                        <div style={{ backgroundColor: opt.color }} className="h-12 w-12 rounded-full flex-shrink-0 border border-zinc-100 shadow-inner group-hover:scale-110 transition-transform" />
                      )}
                      {PROTOCOL_STEPS[currentStep].visual === 'icon' && OptionIcon && (
                        <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                          <OptionIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div className={PROTOCOL_STEPS[currentStep].visual === 'grid' ? 'mt-4' : ''}>
                        <p className="text-sm font-bold uppercase tracking-wider text-black">{opt.label}</p>
                        <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-tight">{opt.desc}</p>
                      </div>
                      {PROTOCOL_STEPS[currentStep].visual !== 'grid' && (
                        <div className="ml-auto h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all">
                          <SparklesIcon className="h-4 w-4 text-zinc-300 group-hover:text-amber-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-20 w-full h-[3px] bg-zinc-100 relative rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / 5) * 100}%` }} className="absolute top-0 left-0 h-full bg-black" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}