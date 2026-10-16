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
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-xl dark:shadow-emerald-950/10 mb-6 transition-colors">
      {/* Top Search Input */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by role (e.g. Frontend, React), company (e.g. Swiggy, FirstHire), or city..."
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Grid: WorkMode, Experience, Salary Slider & Freshness */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Work Mode Toggle Pills */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span>Work Arrangement</span>
          </label>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800/80">
            {workModes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onWorkModeChange(mode)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                  workMode === mode
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-emerald-500" />
            <span>Experience Level</span>
          </label>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800/80">
            {experienceLevels.map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => onExperienceChange(exp)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                  experience === exp
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Slider (Min LPA) */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              <span>Min Package</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
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
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>₹6 LPA</span>
              <span>₹12 LPA</span>
              <span>₹20+ LPA</span>
            </div>
          </div>
        </div>

        {/* Ultra-Fresh (<1h) Toggle & Reset */}
        <div className="flex items-center justify-between gap-3 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={onToggleUltraFresh}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              ultraFreshOnly
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${ultraFreshOnly ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>Fresh &lt; 1h Only</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 cursor-pointer transition text-xs flex items-center gap-1 shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Results Summary Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>
          Showing <span className="font-bold text-slate-900 dark:text-white font-mono">{filteredCount}</span> of <span className="font-mono">{totalCount}</span> live opportunities
        </p>

        {ultraFreshOnly && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <Zap className="w-3 h-3 fill-amber-500" />
            Filtered by freshness (&lt; 60 mins)
          </span>
        )}
      </div>
    </div>
  );
}
