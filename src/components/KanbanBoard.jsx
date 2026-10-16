import React, { useState } from 'react';
import { 
  Bookmark, CheckCircle2, Calendar, Trophy, ArrowRight, ArrowLeft, 
  Trash2, Plus, RefreshCw 
} from 'lucide-react';

export default function KanbanBoard({
  jobs = [],
  pipeline = {},
  onMoveStage,
  onRemoveFromPipeline,
  onViewDetails,
  onResetToSample,
  onSwitchToFeed
}) {
  const [activeMobileStage, setActiveMobileStage] = useState('all');

  const columns = [
    {
      id: 'saved',
      title: 'Saved For Review',
      shortTitle: 'Saved',
      icon: Bookmark,
      color: 'text-violet-500 bg-violet-500/10 border-violet-500/30',
      badgeColor: 'bg-violet-500/20 text-violet-400',
      emptyText: 'No jobs saved yet. Bookmark openings from the radar to evaluate them here.'
    },
    {
      id: 'applied',
      title: 'Applied (Active)',
      shortTitle: 'Applied',
      icon: CheckCircle2,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
      badgeColor: 'bg-indigo-500/20 text-indigo-400',
      emptyText: 'No active applications yet. Tap "1-Click Apply" on fresh roles to track them here.'
    },
    {
      id: 'interviewing',
      title: 'Interviewing',
      shortTitle: 'Interviewing',
      icon: Calendar,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-400',
      emptyText: 'When a technical or recruiter screen is scheduled, advance your card here.'
    },
    {
      id: 'offered',
      title: 'Offer Received 🎉',
      shortTitle: 'Offers',
      icon: Trophy,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
      badgeColor: 'bg-cyan-500/20 text-cyan-400',
      emptyText: 'Your target CTC job offers will land here!'
    }
  ];

  // Group jobs by their stage
  const getJobsInStage = (stageId) => {
    return jobs.filter(j => pipeline[j.id] === stageId);
  };

  const totalInPipeline = Object.keys(pipeline).filter(id => jobs.some(j => j.id === id)).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Kanban Pipeline Control Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
              Application Pipeline Kanban
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {totalInPipeline} Tracked Roles
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            0ms optimistic stage progression with instant 5-second reversible undo.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full sm:w-auto">
          {onSwitchToFeed && (
            <button
              type="button"
              onClick={onSwitchToFeed}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Browse Live Radar</span>
            </button>
          )}

          {onResetToSample && (
            <button
              type="button"
              onClick={onResetToSample}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
              title="Populate demo applications across stages"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sample Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Stage Quick Switcher Tabs (Only visible on screens < md) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveMobileStage('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeMobileStage === 'all'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          All Stages ({totalInPipeline})
        </button>
        {columns.map(col => {
          const count = getJobsInStage(col.id).length;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setActiveMobileStage(col.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeMobileStage === col.id
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span>{col.shortTitle}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${col.badgeColor}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4-Stage Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {columns.map((col) => {
          const stageJobs = getJobsInStage(col.id);
          const Icon = col.icon;
          const isHiddenOnMobile = activeMobileStage !== 'all' && activeMobileStage !== col.id;

          return (
            <div 
              key={col.id} 
              className={`flex flex-col rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-3 sm:p-4 min-h-[380px] sm:min-h-[480px] transition-colors ${
                isHiddenOnMobile ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${col.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-sans">
                    {col.title}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${col.badgeColor}`}>
                  {stageJobs.length}
                </span>
              </div>

              {/* Column Body: Cards List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                {stageJobs.length === 0 ? (
                  <div className="h-44 sm:h-52 flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-xs text-zinc-400">
                    <Icon className="w-7 h-7 mb-2 opacity-30 text-indigo-400" />
                    <p className="mb-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">{col.emptyText}</p>
                    {onSwitchToFeed && (col.id === 'saved' || col.id === 'applied') && (
                      <button
                        type="button"
                        onClick={onSwitchToFeed}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold transition cursor-pointer"
                      >
                        + Find on Radar
                      </button>
                    )}
                  </div>
                ) : (
                  stageJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between gap-2.5 sm:gap-3 animate-pop-in group"
                    >
                      <div>
                        {/* Company Avatar & Actions */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div 
                              className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${job.badgeColor || 'from-indigo-600 to-violet-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono`}
                            >
                              {job.company.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                              {job.company}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveFromPipeline(job.id)}
                            className="text-zinc-400 hover:text-rose-500 transition cursor-pointer p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 shrink-0"
                            title="Remove from pipeline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title */}
                        <h4 
                          onClick={() => onViewDetails(job)}
                          className="font-bold text-sm text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors leading-snug mb-1"
                        >
                          {job.title}
                        </h4>
                        
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          {job.location}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap font-mono">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {job.salaryDisplay}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                            {job.workMode}
                          </span>
                        </div>
                      </div>

                      {/* Stage Transition Buttons */}
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs">
                        {col.id !== 'saved' ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (col.id === 'applied') onMoveStage(job.id, 'saved');
                              if (col.id === 'interviewing') onMoveStage(job.id, 'applied');
                              if (col.id === 'offered') onMoveStage(job.id, 'interviewing');
                            }}
                            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition font-medium"
                            title="Move to previous stage"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Back</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onViewDetails(job)}
                            className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition font-medium"
                          >
                            Details
                          </button>
                        )}

                        {col.id !== 'offered' ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (col.id === 'saved') onMoveStage(job.id, 'applied');
                              if (col.id === 'applied') onMoveStage(job.id, 'interviewing');
                              if (col.id === 'interviewing') onMoveStage(job.id, 'offered');
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer transition ml-auto"
                            title="Advance stage"
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider ml-auto">
                            Target Offer ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
