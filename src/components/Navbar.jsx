import React from 'react';
import { 
  Radar, Sun, Moon, LayoutGrid, ListFilter, 
  Sparkles, CheckCircle2, Bookmark
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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Radar className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.2] animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-mono">
                Hire<span className="text-emerald-500 dark:text-emerald-400">Pulse</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>RADAR LIVE</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
              Fresh Tech Job Radar & Application Pipeline
            </p>
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Metrics Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold mr-2">
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{totalJobsCount} Fresh Openings</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{appliedCount} Applied</span>
            </div>
            {savedCount > 0 && (
              <div className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedCount} Saved</span>
              </div>
            )}
          </div>

          {/* View Mode Switcher: Radar Feed vs Pipeline Kanban */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs transition-colors">
            <button
              type="button"
              onClick={() => onToggleViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Radar Job Feed"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Feed</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Application Pipeline Kanban"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>
          </div>

          {/* My Skills Matcher Modal Trigger */}
          <button
            type="button"
            onClick={onOpenSkillModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-200 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Configure Your Skills for Live Match %"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden sm:inline">My Skills</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px]">
              {userSkillsCount}
            </span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-300 transition-all active:scale-90 cursor-pointer"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
