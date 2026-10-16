import React from 'react';
import { 
  Clock, CheckCircle2, Bookmark, Sparkles, Zap 
} from 'lucide-react';
import { calculateSkillMatch, formatFreshness } from '../utils/skillMatcher';

export default function JobCard({
  job,
  candidateSkills,
  pipelineStatus,
  onApply,
  onSave,
  onViewDetails
}) {
  const matchData = calculateSkillMatch(candidateSkills, job.requiredSkills);
  const isApplied = pipelineStatus === 'applied' || pipelineStatus === 'interviewing' || pipelineStatus === 'offered';
  const isSaved = pipelineStatus === 'saved';

  const isUltraFresh = job.postedMinutesAgo <= 60;

  return (
    <div className="group relative bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-emerald-950/20 transition-all duration-250 flex flex-col justify-between animate-pop-in">
      {/* Top Card Row: Company Avatar, Title & Relative Freshness */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${job.badgeColor || 'from-emerald-500 to-teal-600'} text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-emerald-500/10 shrink-0`}>
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-500 transition-colors">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <span>{job.company}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500">{job.location}</span>
              </p>
            </div>
          </div>

          {/* Freshness Badge with animated beacon if ultra fresh */}
          <div className="flex flex-col items-end shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isUltraFresh
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}>
              {isUltraFresh && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
              <Clock className="w-3 h-3" />
              <span>{formatFreshness(job.postedMinutesAgo)}</span>
            </span>

            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              {job.applicantsCount} applied
            </span>
          </div>
        </div>

        {/* Salary & Work Mode Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs font-mono border border-emerald-500/20">
            {job.salaryDisplay}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
            {job.experience}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
            {job.workMode}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 text-[11px] font-medium border border-indigo-500/20">
            {job.urgency}
          </span>
        </div>

        {/* Skill Match Section (Dynamic scoring based on user profile) */}
        <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Your Compatibility</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${matchData.badge.bgClass}`}>
              {matchData.percentage}% • {matchData.badge.label}
            </span>
          </div>

          {/* Match Progress Bar */}
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                matchData.percentage >= 80 
                  ? 'bg-emerald-500' 
                  : matchData.percentage >= 60 
                  ? 'bg-teal-500' 
                  : 'bg-amber-500'
              }`}
              style={{ width: `${matchData.percentage}%` }}
            />
          </div>

          {/* Matched (Green) and Missing (Amber) Skill Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            {matchData.matchedSkills.map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{s}</span>
              </span>
            ))}
            {matchData.missingSkills.map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                +{s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSave(job.id)}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
            isSaved
              ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={isSaved ? "Saved to Pipeline" : "Save for later"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-500' : ''}`} />
          <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(job)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition"
          >
            Details
          </button>

          <button
            type="button"
            onClick={() => onApply(job.id)}
            disabled={isApplied}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isApplied
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 shadow-emerald-500/20'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Applied ✓</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Apply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
