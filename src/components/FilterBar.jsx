import React from 'react';
import { Search, X, Zap, RotateCcw, MapPin, Briefcase, SlidersHorizontal, Sparkles } from 'lucide-react';

const POPULAR_HUBS = [
  'Bangalore',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Delhi-NCR',
  'Singapore',
  'Dubai',
  'London',
  'Tokyo',
  'San Francisco',
  'Remote'
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  workMode,
  onWorkModeChange,
  experience,
  onExperienceChange,
  minSalary,
  onMinSalaryChange,
  ultraFreshOnly,
  onToggleUltraFresh,
  onResetFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
}) {
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const experienceLevels = ['All', '0-2 Yrs', '1-3 Yrs'];

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-5 shadow-sm mb-6 transition-colors">
      {/* Top Search & Primary Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search roles, tech stack (React, TypeScript), company, or city..."
            className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Buttons Group (Fresh Toggle + Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Freshness Radar Button */}
          <button
            type="button"
            onClick={onToggleUltraFresh}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              ultraFreshOnly
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md shadow-indigo-500/20'
                : 'bg-zinc-50 dark:bg-zinc-950/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
            title="Toggle <60m fresh postings"
          >
            <Zap className={`w-3.5 h-3.5 ${ultraFreshOnly ? 'text-cyan-300 fill-current animate-pulse' : 'text-indigo-500'}`} />
            <span>Fresh &lt; 60m Drop</span>
            {ultraFreshOnly && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
            )}
          </button>

          {/* Reset Filter Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Location Hub Chips (Top Indian & Global Tech Destinations) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3.5 text-xs">
        <span className="text-[11px] font-mono text-zinc-400 shrink-0 flex items-center gap-1 mr-1">
          <MapPin className="w-3 h-3 text-indigo-500" />
          <span>Hubs:</span>
        </span>
        {POPULAR_HUBS.map((hub) => {
          const isActive = searchQuery.toLowerCase().includes(hub.toLowerCase());
          return (
            <button
              key={hub}
              type="button"
              onClick={() => onSearchChange(isActive ? '' : hub)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {hub}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Work Mode, Experience, Salary Slider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        {/* Work Mode */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-500" />
            <span>WORK MODE</span>
          </label>
          <div className="grid grid-cols-4 gap-1 p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            {workModes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onWorkModeChange(mode)}
                className={`py-1.5 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all cursor-pointer truncate text-center ${
                  workMode === mode
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={mode}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-indigo-500" />
            <span>EXPERIENCE LEVEL</span>
          </label>
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            {experienceLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onExperienceChange(lvl)}
                className={`py-1.5 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all cursor-pointer truncate text-center ${
                  experience === lvl
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={lvl}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Min CTC Slider */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-indigo-500" />
              <span>MINIMUM COMPENSATION</span>
            </span>
            <span className="font-bold text-zinc-900 dark:text-white font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded text-[11px]">
              ₹{minSalary} LPA+
            </span>
          </div>
          <div className="px-1 py-1">
            <input
              type="range"
              min="6"
              max="20"
              step="1"
              value={minSalary}
              onChange={e => onMinSalaryChange(Number(e.target.value))}
              className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
              <span>₹6 LPA</span>
              <span>₹12 LPA</span>
              <span>₹20+ LPA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Filter Meta */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>
            Active Radar: <strong className="text-zinc-900 dark:text-white">{filteredCount}</strong> of {totalCount} engineering roles
          </span>
        </div>
        {hasActiveFilters && (
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
            • Active Filters
          </span>
        )}
      </div>
    </div>
  );
}
