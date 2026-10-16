import React from 'react';
import { 
  Bookmark, CheckCircle2, Calendar, Trophy, ArrowRight, ArrowLeft, 
  Trash2 
} from 'lucide-react';

export default function KanbanBoard({
  jobs,
  pipeline,
  onMoveStage,
  onRemoveFromPipeline,
  onViewDetails
}) {
  const columns = [
    {
      id: 'saved',
      title: 'Saved For Review',
      icon: Bookmark,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
      badgeColor: 'bg-indigo-500/20 text-indigo-400',
      emptyText: 'No jobs saved yet. Browse the Radar feed and bookmark openings you like.'
    },
    {
      id: 'applied',
      title: 'Applied (Active)',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      badgeColor: 'bg-emerald-500/20 text-emerald-400',
      emptyText: 'No active applications. Hit "1-Click Apply" on fresh openings to see them here!'
    },
    {
      id: 'interviewing',
      title: 'Interviewing',
      icon: Calendar,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-400',
      emptyText: 'When a recruiter schedules a technical round, move your card here.'
    },
    {
      id: 'offered',
      title: 'Offer Received 🎉',
      icon: Trophy,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      badgeColor: 'bg-purple-500/20 text-purple-400',
      emptyText: 'Your target offers will land here!'
    }
  ];

  // Group jobs by their stage
  const getJobsInStage = (stageId) => {
    return jobs.filter(j => pipeline[j.id] === stageId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {columns.map((col) => {
        const stageJobs = getJobsInStage(col.id);
        const Icon = col.icon;

        return (
          <div 
            key={col.id} 
            className="flex flex-col rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 min-h-[480px] transition-colors"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${col.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
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
                <div className="h-48 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-400">
                  <Icon className="w-6 h-6 mb-2 opacity-40" />
                  <p>{col.emptyText}</p>
                </div>
              ) : (
                stageJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-2.5 animate-pop-in"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 
                            onClick={() => onViewDetails(job)}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-500 cursor-pointer transition-colors"
                          >
                            {job.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {job.company} • {job.location}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveFromPipeline(job.id)}
                          className="text-slate-400 hover:text-rose-500 transition cursor-pointer p-1"
                          title="Remove from pipeline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {job.salaryDisplay}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {job.experience}
                        </span>
                      </div>
                    </div>

                    {/* Stage Transition Buttons */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs">
                      {col.id !== 'saved' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (col.id === 'applied') onMoveStage(job.id, 'saved');
                            if (col.id === 'interviewing') onMoveStage(job.id, 'applied');
                            if (col.id === 'offered') onMoveStage(job.id, 'interviewing');
                          }}
                          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition font-medium"
                          title="Move to previous stage"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Back</span>
                        </button>
                      ) : <div />}

                      {col.id !== 'offered' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (col.id === 'saved') onMoveStage(job.id, 'applied');
                            if (col.id === 'applied') onMoveStage(job.id, 'interviewing');
                            if (col.id === 'interviewing') onMoveStage(job.id, 'offered');
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer transition ml-auto"
                          title="Advance stage"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                          Final Stage
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
  );
}
