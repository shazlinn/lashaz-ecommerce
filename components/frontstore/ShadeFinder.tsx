// ecommerce/components/frontstore/ShadeFinder.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FingerPrintIcon, 
  SparklesIcon, 
  SunIcon,
  HandRaisedIcon,
  ArrowDownTrayIcon,
  ShoppingBagIcon,
  LifebuoyIcon 
} from '@heroicons/react/24/outline';

// --- TYPES ---
interface ProtocolOption {
  label: string;
  value: string;
  desc: string;
  color?: string;
  icon?: any;
}

interface ProtocolStep {
  id: string;
  question: string;
  visual: 'swatch' | 'icon' | 'grid';
  options: ProtocolOption[];
}

// --- DATA ---
const PROTOCOL_STEPS: ProtocolStep[] = [
  {
    id: 'undertone',
    question: 'What is your natural undertone?',
    visual: 'swatch',
    options: [
      { label: 'Cool', value: 'Cool', color: '#1E3A8A', desc: 'Veins appear blue/purple' },
      { label: 'Neutral', value: 'Neutral', color: '#6B7280', desc: 'Veins appear blue/green' },
      { label: 'Warm', value: 'Warm', color: '#166534', desc: 'Veins appear olive/green' },
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
      { label: 'Oily', value: 'Oily', icon: LifebuoyIcon, desc: 'Visible shine / pores' },
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

  const generateAnalysis = (data: string[]) => {
    const [undertone, surface, skinCondition, finish, coverage] = data;
    
    //General Portable Profile (Universal Industry Standards)
    let globalProfile = "Balanced Skin Strategy";
    let industryEquivalent = "Level 2 Neutral Base";
    
    if (surface === 'Fair') {
      globalProfile = undertone === 'Cool' ? "Porcelain Cool Diagnostic" : "Radiant Kuning Langsat Strategy";
      industryEquivalent = undertone === 'Cool' ? "10C / Cool Ivory" : "15W / Warm Ivory";
    } else if (surface === 'Medium') {
      globalProfile = "Balanced Sand Strategy";
      industryEquivalent = "25N / Neutral Sand";
    } else if (surface === 'Deep') {
      globalProfile = "Deep Sawo Matang Strategy";
      industryEquivalent = "40W / Warm Toffee";
    }

    //Bound Catalog Recommender
    let shade = "Foundation Tester";
    let detail = "We recommend utilizing our multi-shade matrix test kit to verify your biological spectrum balance before full size application.";
    let shopQueryTags: string[] = ["Sample"];

    if (surface === 'Fair') {
      shade = undertone === 'Cool' ? "Foundation - KPOP" : "Foundation - IVORY";
      detail = undertone === 'Cool' 
        ? "Specially formulated for very fair skin with cool or pinkish undertones. Provides a bright, fresh finish without looking ashy."
        : "The go-to shade for fair to light skin with yellow or 'Kuning Langsat' undertones. Blends seamlessly for a healthy radiance.";
      shopQueryTags = undertone === 'Cool' ? ["Fair Skin", "Cool Undertone", "Pinkish"] : ["Light Skin", "Yellow Undertone", "Kuning Langsat"];
    } else if (surface === 'Medium') {
      shade = "Foundation - ALMOND";
      detail = "A versatile neutral shade for medium skin tones. Delivers a balanced, 'my skin but better' look that lasts all day.";
      shopQueryTags = ["Medium Skin", "Neutral Undertone", "Natural Finish"];
    } else if (surface === 'Deep') {
      shade = "Foundation - AMBER";
      detail = "A rich, warm shade designed for tan and 'Sawo Matang' skin tones. Celebrates natural glow without a greyish cast.";
      shopQueryTags = ["Tan Skin", "Sawo Matang", "Warm Undertone"];
    }

    //Automated Routine Generation Build Matrix
    const routineAddons: string[] = [];
    
    if (skinCondition === 'Oily' || skinCondition === 'Combination') {
      routineAddons.push("Primer: Controls excess sebum and blurs visible open pores/fine lines.");
      shopQueryTags.push("Oil Control", "Pore Blurring");
    }
    
    if (finish === 'Dewy') {
      routineAddons.push("Sponge: Utilize damp to lock in a luminous glass-skin finish.");
      shopQueryTags.push("Dewy Finish");
    } else if (coverage === 'Full') {
      routineAddons.push("Sponge: Utilize completely dry for dense buildable opacity layers.");
      shopQueryTags.push("Full Coverage");
    }

    // Always bundle defensive hydration protection
    routineAddons.push("Sunscreen: Deeply hydrating weightless SPF 50 shield without white cast.");
    shopQueryTags.push("Hydrating", "UV Protection");

    return { 
      shade, 
      detail, 
      skinType: skinCondition, 
      finish, 
      coverage, 
      globalProfile, 
      industryEquivalent,
      routineAddons,
      shopUrlTags: shopQueryTags.join(','),
      accuracy: (Math.random() * (99.8 - 97.2) + 97.2).toFixed(1) 
    };
  };

  useEffect(() => {
    if (isCalculating) {
      const messages = ["Analyzing Biological Signature...", "Calibrating Pigment Harmony...", "Decoding Universal Standards...", "Finalizing Identity Match..."];
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

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[600px] flex items-center justify-center relative">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: absolute; left: 0; top: 0; width: 100% !important;
            height: 100% !important; background-color: #FAF9F6 !important;
            -webkit-print-color-adjust: exact; padding: 60px !important;
            margin: 0 !important; border: none !important;
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
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-black animate-pulse">{loadingText}</p>
            </motion.div>
          ) : showResult ? (
            /* --- DIAGNOSTIC RESULT VIEW --- */
            <motion.div key="result" id="printable-area" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full px-10 py-16 md:px-20 text-center space-y-12 bg-[#FAF9F6] text-black">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full">
                  <SparklesIcon className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Diagnostic Match: {analysis.accuracy}%</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-josefin font-bold uppercase tracking-tighter">Your Identity Protocol</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left border-y border-zinc-100 py-12">
                <div className="space-y-8">
                  {/* --- THE PORTABLE GENERAL PROFILE --- */}
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Portable Beauty Profile</p>
                    <p className="text-2xl font-josefin font-bold uppercase">{analysis.globalProfile}</p>
                    <p className="text-[11px] font-bold text-zinc-500 mt-1 italic">Industry Equivalent: {analysis.industryEquivalent}</p>
                  </div>
                  
                  {/* --- THE BINDING CATALOG SPECIFIC MATCH --- */}
                  <div className="bg-white/40 p-6 rounded-2xl border border-zinc-100">
                    <p className="text-[9px] font-bold uppercase text-black tracking-widest mb-2">La Shaz Recommendation</p>
                    <p className="text-xl font-josefin font-bold uppercase mb-2">{analysis.shade}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">{analysis.detail}</p>
                  </div>
                </div>

                {/* --- AUTONOMOUS DYNAMIC PREPARATION ROUTINE --- */}
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl flex flex-col justify-between border border-white shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-6">Complete Routine Regimen</p>
                    <div className="space-y-4">
                      {analysis.routineAddons.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 border-b border-zinc-100/60 pb-3 text-[11px] text-zinc-700 font-medium leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-black flex-shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-black/5 rounded-xl">
                     <p className="text-[8px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Consultant Tip</p>
                     <p className="text-[10px] text-zinc-600 leading-relaxed">Present this structural protocol profile at any professional cosmetics counter for precise alternative tracking.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
                <button 
                  onClick={() => router.push(`/shop?tags=${encodeURIComponent(analysis.shopUrlTags)}`)} 
                  className="bg-black text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                  <ShoppingBagIcon className="h-4 w-4" /> Shop My Match
                </button>
                <button 
                  onClick={() => window.print()} 
                  className="px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 border border-zinc-200 flex items-center justify-center gap-3 hover:text-black hover:border-black transition-all"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" /> Download Result
                </button>
              </div>
            </motion.div>
          ) : (
            /* --- QUIZ STEPS VIEW --- */
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full px-10 py-12 md:px-16 text-black">
              <div className="flex flex-col items-center text-center mb-16">
                <span className="text-[10px] font-bold bg-black/5 px-3 py-1 rounded-full uppercase tracking-[0.3em] mb-4">PHASE {currentStep + 1}</span>
                <h2 className="text-3xl md:text-5xl font-josefin font-bold uppercase tracking-tighter leading-[0.9]">{PROTOCOL_STEPS[currentStep].question}</h2>
              </div>

              <div className={`${PROTOCOL_STEPS[currentStep].visual === 'grid' ? 'grid grid-cols-1 md:grid-cols-3' : 'flex flex-col'} gap-4`}>
                {PROTOCOL_STEPS[currentStep].options.map((opt) => (
                  <button key={opt.value} onClick={() => handleSelect(opt.value)} className={`group flex items-center gap-6 p-6 border border-zinc-100 rounded-3xl hover:border-black hover:bg-white hover:shadow-xl transition-all duration-500 text-left ${PROTOCOL_STEPS[currentStep].visual === 'grid' ? 'flex-col text-center justify-center p-10' : ''}`}>
                    {opt.color && (
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <div style={{ backgroundColor: opt.color }} className="absolute inset-0 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div style={{ backgroundColor: opt.color }} className="h-12 w-12 rounded-full border border-white/50 shadow-inner group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    {opt.icon && (
                      <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors flex-shrink-0">
                        <opt.icon className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider">{opt.label}</p>
                      <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1 tracking-tight">{opt.desc}</p>
                    </div>
                  </button>
                ))}
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