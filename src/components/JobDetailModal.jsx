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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-pop-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${job.badgeColor || 'from-emerald-500 to-teal-600'} text-white font-extrabold text-lg flex items-center justify-center shadow-lg shrink-0`}>
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {job.company}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500">{job.location}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                {job.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Offered CTC</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{job.salaryDisplay}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Experience</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{job.experience}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Work Mode</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{job.workMode}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Freshness</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>{formatFreshness(job.postedMinutesAgo)}</span>
              </p>
            </div>
          </div>

          {/* Compatibility Breakdown */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Match Compatibility: {matchData.percentage}% ({matchData.badge.label})
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {matchData.matchedCount} of {matchData.totalRequired} skills matched
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${matchData.percentage}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {matchData.matchedSkills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{s}</span>
                </span>
              ))}
              {matchData.missingSkills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-medium">
                  Missing: {s}
                </span>
              ))}
            </div>
          </div>

          {/* Job Overview / Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Role Overview & Responsibilities
            </h4>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-sans">
              {job.description}
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Associated Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSave(job.id)}
              className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Bookmarked' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer transition flex items-center gap-1.5"
              title="Share Opportunity"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
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
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 shadow-emerald-500/20'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Application Submitted ✓</span>
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
