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
  onViewDetails,
  index = 0
}) {
  const matchData = calculateSkillMatch(candidateSkills, job.requiredSkills);
  const isApplied = pipelineStatus === 'applied' || pipelineStatus === 'interviewing' || pipelineStatus === 'offered';
  const isSaved = pipelineStatus === 'saved';

  const isUltraFresh = job.postedMinutesAgo <= 60;

  return (
    <div 
      className="group relative bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-indigo-950/30 transition-all duration-200 flex flex-col justify-between animate-card-cascade"
      style={{ animationDelay: `${Math.min(index * 35, 420)}ms` }}
    >
      {/* Left Vertical Accent Indicator Bar */}
      <div className={`absolute top-4 bottom-4 left-0 w-1 rounded-r-full transition-colors ${
        isUltraFresh 
          ? 'bg-gradient-to-b from-cyan-400 to-indigo-600' 
          : 'bg-zinc-300 dark:bg-zinc-800 group-hover:bg-indigo-500/50'
      }`} />

      {/* Card Header: Company Badge, Title, Relative Freshness */}
      <div className="pl-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${job.badgeColor || 'from-indigo-600 to-violet-700'} text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-500/15 shrink-0 font-mono tracking-wider`}>
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 
                onClick={() => onViewDetails(job)}
                className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors cursor-pointer"
              >
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <span className="text-zinc-900 dark:text-zinc-200">{job.company}</span>
                <span className="text-zinc-400 dark:text-zinc-700">•</span>
                <span className="text-zinc-500">{job.location}</span>
              </p>
            </div>
          </div>

          {/* Freshness Badge with animated cyan radar pulse */}
          <div className="flex flex-col items-end shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
              isUltraFresh
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
            }`}>
              {isUltraFresh && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              )}
              <Clock className="w-3 h-3 text-cyan-500" />
              <span>{formatFreshness(job.postedMinutesAgo)}</span>
            </span>

            <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {job.applicantsCount} in queue
            </span>
          </div>
        </div>

        {/* Salary & Work Mode Tags in JetBrains Mono */}
        <div className="flex items-center gap-2 flex-wrap mb-4 font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-500/25">
            {job.salaryDisplay}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
            {job.experience}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
            {job.workMode}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 text-[10px] font-semibold border border-violet-500/20">
            {job.urgency}
          </span>
        </div>

        {/* Skill Match Section (Dynamic compatibility % and gap badges) */}
        <div className="mb-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Skill Alignment</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
              {matchData.percentage}% • {matchData.badge.label}
            </span>
          </div>

          {/* Match Progress Bar */}
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2.5">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full transition-all duration-400"
              style={{ width: `${matchData.percentage}%` }}
            />
          </div>

          {/* Matched (Cyan) and Missing (Amber) Skill Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
            {matchData.matchedSkills.map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-semibold flex items-center gap-1 border border-cyan-500/20">
                <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                <span>{s}</span>
              </span>
            ))}
            {matchData.missingSkills.map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
                +{s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pl-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSave(job.id)}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
            isSaved
              ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30 font-bold'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title={isSaved ? "Saved to Pipeline" : "Save for review"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-violet-500' : ''}`} />
          <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(job)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer transition font-mono"
          >
            Review JD
          </button>

          <button
            type="button"
            onClick={() => onApply(job.id)}
            disabled={isApplied}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isApplied
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-default'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white active:scale-95 shadow-indigo-500/25'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono">Applied ✓</span>
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
