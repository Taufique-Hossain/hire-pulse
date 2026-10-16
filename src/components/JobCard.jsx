import React from 'react';
import { 
  Bookmark, Zap, MapPin, 
  Clock, ArrowUpRight, Check, Sparkles 
} from 'lucide-react';
import { calculateSkillMatch, formatFreshness } from '../utils/skillMatcher';

export default function JobCard({
  job,
  candidateSkills,
  pipelineStatus,
  onApply,
  onSave,
  onViewDetails,
  index = 0,
}) {
  const isApplied = pipelineStatus === 'applied' || pipelineStatus === 'interviewing' || pipelineStatus === 'offered';
  const isSaved = pipelineStatus === 'saved';

  const matchData = calculateSkillMatch(candidateSkills, job.requiredSkills);
  const isUltraFresh = job.postedMinutesAgo <= 60;

  return (
    <article
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 animate-card-cascade"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      {/* Top Meta Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Company Avatar */}
            <div 
              className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${job.badgeColor || 'from-indigo-600 to-violet-600'} text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0 font-mono tracking-wider`}
            >
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="min-w-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate block">
                {job.company}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>

          {/* Freshness & Save Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isUltraFresh ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {formatFreshness(job.postedMinutesAgo)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
                <Clock className="w-3 h-3" />
                {formatFreshness(job.postedMinutesAgo)}
              </span>
            )}

            <button
              type="button"
              onClick={() => onSave(job.id)}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isSaved
                  ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save to Pipeline'}
              aria-label="Save Job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Job Title */}
        <h3 
          onClick={() => onViewDetails(job)}
          className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors leading-snug mb-2 flex items-start justify-between gap-1 group/title"
        >
          <span>{job.title}</span>
          <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover/title:text-indigo-500 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
        </h3>

        {/* Compensation & Urgency Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-semibold border border-zinc-200/80 dark:border-zinc-700/80">
            {job.salaryDisplay}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
            {job.experience}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
            {job.workMode}
          </span>
          {job.urgency && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-medium">
              {job.urgency}
            </span>
          )}
        </div>

        {/* Skill Match Breakdown */}
        <div className="mb-5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Skill Compatibility
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold border ${matchData.badge.bgClass}`}>
              {matchData.percentage}% • {matchData.badge.label}
            </span>
          </div>

          {/* Progress Mini Bar */}
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                matchData.percentage >= 80 
                  ? 'bg-emerald-500' 
                  : matchData.percentage >= 60 
                  ? 'bg-teal-500' 
                  : matchData.percentage >= 40 
                  ? 'bg-amber-500' 
                  : 'bg-zinc-400'
              }`}
              style={{ width: `${Math.max(matchData.percentage, 10)}%` }}
            />
          </div>

          {/* Key tags preview */}
          <div className="flex flex-wrap gap-1">
            {job.requiredSkills.slice(0, 4).map((skill) => {
              const isMatched = matchData.matchedSkills.includes(skill);
              return (
                <span
                  key={skill}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isMatched
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {isMatched ? `✓ ${skill}` : skill}
                </span>
              );
            })}
            {job.requiredSkills.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-zinc-200/40 dark:bg-zinc-800/40 text-zinc-400">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(job)}
          className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition py-1.5 px-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={() => onApply(job.id)}
          disabled={isApplied}
          className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
            isApplied
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
              : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 shadow-zinc-900/10'
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Applied</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>1-Click Apply</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
