import React, { useState, useEffect } from 'react';
import { 
  X, Clock, Sparkles, CheckCircle2, 
  Bookmark, Zap, Share2, Check 
} from 'lucide-react';
import { calculateSkillMatch, formatFreshness } from '../utils/skillMatcher';

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  candidateSkills,
  pipelineStatus,
  onApply,
  onSave
}) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const matchData = calculateSkillMatch(candidateSkills, job.requiredSkills);
  const isApplied = pipelineStatus === 'applied' || pipelineStatus === 'interviewing' || pipelineStatus === 'offered';
  const isSaved = pipelineStatus === 'saved';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/75 backdrop-blur-md animate-pop-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4 bg-zinc-50 dark:bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${job.badgeColor || 'from-indigo-600 to-violet-700'} text-white font-extrabold text-base flex items-center justify-center shadow-lg shrink-0 font-mono`}>
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                  {job.company}
                </span>
                <span className="text-zinc-400 dark:text-zinc-700">•</span>
                <span className="text-xs text-zinc-500">{job.location}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-0.5">
                {job.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto font-sans">
          {/* Key Metric Highlights in JetBrains Mono */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-0.5">Target CTC</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{job.salaryDisplay}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-0.5">Experience</span>
              <p className="font-bold text-zinc-900 dark:text-white text-sm">{job.experience}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-0.5">Work Mode</span>
              <p className="font-bold text-zinc-900 dark:text-white text-sm">{job.workMode}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-0.5">Freshness</span>
              <p className="font-bold text-cyan-500 text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatFreshness(job.postedMinutesAgo)}</span>
              </p>
            </div>
          </div>

          {/* Compatibility Breakdown */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  Skill Alignment: {matchData.percentage}% ({matchData.badge.label})
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {matchData.matchedCount} of {matchData.totalRequired} skills matched
              </span>
            </div>

            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" 
                style={{ width: `${matchData.percentage}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {matchData.matchedSkills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-medium flex items-center gap-1 border border-cyan-500/20">
                  <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                  <span>{s}</span>
                </span>
              ))}
              {matchData.missingSkills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                  Missing: {s}
                </span>
              ))}
            </div>
          </div>

          {/* Job Overview / Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">
              Role Overview & Mandates
            </h4>
            <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              {job.description}
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">
              Tech Stack Matrix
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {job.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSave(job.id)}
              className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-violet-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Bookmarked' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs cursor-pointer transition flex items-center gap-1.5 font-mono"
              title="Share Opportunity"
            >
              {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onApply(job.id);
              onClose();
            }}
            disabled={isApplied}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
              isApplied
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-default'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white active:scale-95 shadow-indigo-500/25'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span className="font-mono">Application In Progress ✓</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Submit 1-Click Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
