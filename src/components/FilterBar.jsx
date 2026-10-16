import React from 'react';
import { Search, X, Zap, RotateCcw, Building2, MapPin, DollarSign } from 'lucide-react';

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
  totalCount
}) {
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const experienceLevels = ['All', '0-2 Yrs', '1-3 Yrs'];

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-2xl dark:shadow-indigo-950/20 mb-6 transition-colors">
      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by role (e.g. Frontend, React), company (e.g. FirstHire, Swiggy), or city..."
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer transition"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Grid: WorkMode, Experience, Salary Slider & Freshness */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Work Mode Toggle */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1 font-mono">
            <MapPin className="w-3 h-3 text-indigo-500" />
            <span>Work Arrangement</span>
          </label>
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
            {workModes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onWorkModeChange(mode)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                  workMode === mode
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1 font-mono">
            <Building2 className="w-3 h-3 text-indigo-500" />
            <span>Experience Level</span>
          </label>
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
            {experienceLevels.map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => onExperienceChange(exp)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                  experience === exp
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Slider (Min LPA) */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-indigo-500" />
              <span>Min Compensation</span>
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {minSalary > 6 ? `₹${minSalary} LPA+` : 'Any CTC'}
            </span>
          </div>
          <div className="px-1 pt-1.5">
            <input
              type="range"
              min="6"
              max="20"
              step="1"
              value={minSalary}
              onChange={(e) => onMinSalaryChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-0.5">
              <span>₹6 LPA</span>
              <span>₹12 LPA</span>
              <span>₹20+ LPA</span>
            </div>
          </div>
        </div>

        {/* Ultra-Fresh (<1h) Toggle & Reset */}
        <div className="flex items-center justify-between gap-2.5 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={onToggleUltraFresh}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              ultraFreshOnly
                ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${ultraFreshOnly ? 'fill-cyan-400 text-cyan-500' : 'text-zinc-400'}`} />
            <span>&lt; 60m Drops Only</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 cursor-pointer transition text-xs flex items-center gap-1 shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Results Summary Bar */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <p className="font-mono">
          Showing <span className="font-bold text-zinc-900 dark:text-white">{filteredCount}</span> of <span>{totalCount}</span> opportunities
        </p>

        {ultraFreshOnly && (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-cyan-500 dark:text-cyan-400">
            <Zap className="w-3 h-3 fill-cyan-400" />
            Filtered by freshness index (&lt; 60 mins)
          </span>
        )}
      </div>
    </div>
  );
}
