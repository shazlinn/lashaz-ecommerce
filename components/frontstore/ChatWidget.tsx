// lashaz-ecommerce/components/frontstore/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import ReactMarkdown for parsing bolding and lists
import ReactMarkdown from 'react-markdown';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon, 
  SparklesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Manual state for maximum stability in Next 16/React 19
  const [messages, setMessages] = useState<any[]>([
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: 'Welcome to the **La Shaz Identity Protocol**. I am your Virtual Beauty Consultant. How may I refine your routine today?' 
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAction = async (e?: React.FormEvent, manualText?: string) => {
    e?.preventDefault();
    
    const textToSend = manualText || localInput;
    if (!textToSend?.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setLocalInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Protocol Error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        // Cleaning Vercel AI SDK prefixes
        const cleanChunk = chunk.replace(/^\d+:"/g, '').replace(/"$/g, '').replace(/\\n/g, '\n');
        assistantContent += cleanChunk;

        setMessages(prev => prev.map(msg => 
          msg.id === assistantId ? { ...msg, content: assistantContent } : msg
        ));
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans selection:bg-zinc-200 text-black">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            className="mb-6 w-[350px] md:w-[420px] h-[600px] bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden flex flex-col ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-black p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <SparklesIcon className="h-6 w-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-josefin font-bold uppercase tracking-[0.25em] text-[10px]">La Shaz</h3>
                    <p className="text-[8px] opacity-40 uppercase tracking-[0.15em] mt-1 font-semibold">Virtual Identity Protocol</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/10 rounded-full transition-all">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-6 bg-gradient-to-b from-transparent to-white/50 scrollbar-hide">
              {messages.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] px-5 py-4 text-[12px] leading-[1.6]
                    ${m.role === 'user' 
                        ? 'bg-black text-white rounded-[1.6rem] rounded-tr-none shadow-xl' 
                        : 'bg-white text-zinc-700 rounded-[1.6rem] rounded-tl-none border border-zinc-100 shadow-sm'}`}
                    >
                    {/* Wrap in a div to handle styling, solving the className TS error */}
                    <div className="prose prose-zinc prose-sm max-w-none prose-strong:font-bold prose-strong:text-current">
                        <ReactMarkdown>
                        {m.content}
                        </ReactMarkdown>
                    </div>
                </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/50 px-5 py-4 rounded-[1.5rem] flex gap-1.5 border border-zinc-100">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-duration:0.8s]" />
                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.15s]" />
                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <AnimatePresence>
              {messages.length <= 1 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-8 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-zinc-50 overflow-hidden"
                >
                  <button 
                    type="button"
                    onClick={() => handleAction(undefined, 'Help me find my perfect shade')}
                    className="whitespace-nowrap px-4 py-2.5 bg-white hover:bg-black hover:text-white transition-all duration-300 rounded-full text-[9px] font-bold uppercase tracking-widest border border-zinc-200/60 shadow-sm"
                  >
                    Shade Quiz
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleAction(undefined, 'Tell me about shipping')}
                    className="whitespace-nowrap px-4 py-2.5 bg-white hover:bg-black hover:text-white transition-all duration-300 rounded-full text-[9px] font-bold uppercase tracking-widest border border-zinc-200/60 shadow-sm"
                  >
                    Shipping
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-8 bg-white/50 border-t border-zinc-50">
              <form onSubmit={handleAction} className="relative group">
                <input 
                  type="text"
                  value={localInput} 
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Inquire about beauty..." 
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-6 pr-14 py-4 text-[12px] focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all text-black"
                />
                <button 
                  type="submit" 
                  disabled={!localInput.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2.5 rounded-xl shadow-xl disabled:opacity-10"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-5 flex items-center justify-center gap-2 opacity-25 uppercase tracking-[0.3em] text-[8px] font-bold">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                <span>Identity Protocol Active</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white w-16 h-16 rounded-[1.6rem] shadow-2xl flex items-center justify-center border border-white/10 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.6rem]" />
        {isOpen ? <XMarkIcon className="h-6 w-6 relative z-10" /> : <ChatBubbleLeftRightIcon className="h-6 w-6 relative z-10" />}
      </motion.button>
    </div>
  );
}