import React from 'react';
import { Sun, Moon, Rocket } from 'lucide-react';

export default function Header({ isDark, toggleTheme }) {
  return (
    <header className="sticky top-0 z-[2000] glass border-none rounded-none border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <Rocket size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">ASTRO<span className="text-primary-600">DASH</span></h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">ISS & Space Explorer</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
