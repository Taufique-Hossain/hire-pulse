import React, { useState } from 'react';
import { 
  Sun, Moon, LayoutGrid, ListFilter, 
  Cpu, Radio, Menu, X, ChevronRight 
} from 'lucide-react';

export default function Navbar({
  darkMode,
  onToggleTheme,
  onOpenSkillModal,
  userSkillsCount,
  viewMode,
  onToggleViewMode,
  appliedCount = 0,
  savedCount = 0,
  totalJobsCount,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalPipelineCount = appliedCount + savedCount;

  const handleNavClick = (mode) => {
    if (mode) onToggleViewMode(mode);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Live Radar Beacon */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a href="#home" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 dark:text-indigo-600 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                Hire<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">
                Tech Radar
              </span>
            </div>
          </a>

          {/* Scanner Status Chip (Desktop & Tablet) */}
          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RADAR ACTIVE</span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <a
            href="#jobs"
            onClick={() => onToggleViewMode('list')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800' 
                : 'hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
            }`}
          >
            Live Radar
          </a>
          <a
            href="#jobs"
            onClick={() => onToggleViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              viewMode === 'kanban' 
                ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800' 
                : 'hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
            }`}
          >
            <span>Pipeline Board</span>
            {totalPipelineCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                {totalPipelineCount}
              </span>
            )}
          </a>
          <button
            type="button"
            onClick={onOpenSkillModal}
            className="px-3 py-1.5 rounded-lg transition-colors hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 cursor-pointer"
          >
            Skills Matrix
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* View Mode Toggle Pill (Feed vs Kanban) */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onToggleViewMode('list')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Feed View"
            >
              <ListFilter className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Feed</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('kanban')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Pipeline Kanban View"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>
          </div>

          {/* Candidate Skills Pill Button (Tablet & Desktop) */}
          <button
            type="button"
            onClick={onOpenSkillModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 transition cursor-pointer"
            title="Configure Your Skills Matrix"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">Skills</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold">
              {userSkillsCount}
            </span>
          </button>

          {/* Dark / Light Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition cursor-pointer shrink-0"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700" />
            )}
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-5 space-y-3 shadow-xl animate-pop-in">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              RADAR ACTIVE
            </span>
            <span>{totalJobsCount} Detected Openings</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => handleNavClick('list')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                viewMode === 'list'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-indigo-500" />
                <span>Live Radar Feed</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('kanban')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                viewMode === 'kanban'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-indigo-500" />
                <span>Pipeline Board</span>
                {totalPipelineCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    {totalPipelineCount}
                  </span>
                )}
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSkillModal();
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-500" />
                <span>Configure Skills Matrix</span>
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono">
                  {userSkillsCount} Active
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
