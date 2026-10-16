import React from 'react';
import { 
  Radio, Sun, Moon, LayoutGrid, ListFilter, 
  CheckCircle2, Bookmark, Cpu
} from 'lucide-react';

export default function Navbar({
  darkMode,
  onToggleTheme,
  onOpenSkillModal,
  userSkillsCount,
  viewMode,
  onToggleViewMode,
  appliedCount,
  savedCount,
  totalJobsCount
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Radio className="w-5 h-5 text-white stroke-[2.4] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 dark:text-white font-sans">
                Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400">Pulse</span>
              </span>
              <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                <span>RADAR v2</span>
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono hidden md:block">
              Real-Time High-Velocity Job Radar
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Metrics Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono mr-2">
            <div className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{totalJobsCount} Detected</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{appliedCount} Applied</span>
            </div>
            {savedCount > 0 && (
              <div className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30 flex items-center gap-1.5 font-semibold">
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedCount} Saved</span>
              </div>
            )}
          </div>

          {/* View Mode Toggle: Feed vs Pipeline */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-0.5 text-xs transition-colors">
            <button
              type="button"
              onClick={() => onToggleViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Real-Time Radar Feed"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Feed</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Application Pipeline Kanban"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>
          </div>

          {/* My Skills Matcher Button */}
          <button
            type="button"
            onClick={onOpenSkillModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Configure Your Skills for Live Match %"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline">My Skills</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold">
              {userSkillsCount}
            </span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-300 transition-all active:scale-90 cursor-pointer"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
