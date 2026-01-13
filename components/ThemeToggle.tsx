'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid';

type Mode = 'system' | 'light' | 'dark';

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system');

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Mode) || 'system';
    setMode(saved);
  }, []);

  function apply(m: Mode) {
    setMode(m);
    localStorage.setItem('theme', m);
    const root = document.documentElement;
    if (m === 'system') {
      root.setAttribute('data-theme', 'system'); // media queries decide
    } else {
      root.setAttribute('data-theme', m);
    }
  }

    return (
    <div
        className="inline-flex items-center gap-1 rounded-md border px-1 py-1"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
        <button
        onClick={() => apply('light')}
        className={`flex items-center gap-1 rounded px-2 py-1 text-sm ${
            mode === 'light' ? 'pill-active' : ''
        }`}
        // title="Light"
        >
        <SunIcon className="h-4 w-4" />
        {/* <span className="hidden sm:inline">Light</span> */}
        </button>

        <button
        onClick={() => apply('dark')}
        className={`flex items-center gap-1 rounded px-2 py-1 text-sm ${
            mode === 'dark' ? 'pill-active' : ''
        }`}
        title="Dark"
        >
        <MoonIcon className="h-4 w-4" />
        {/* <span className="hidden sm:inline">Dark</span> */}
        </button>
    </div>
    );
}