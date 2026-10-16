import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export default function RadarBanner({
  newJobAlert,
  onDismissAlert,
  totalJobsCount,
  ultraFreshCount,
  nextScanSeconds = 30
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-b border-emerald-500/20 py-2.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {/* Left: Radar Live Beacon & Frequency */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1">
              <span>ACTIVE RADAR</span>
            </span>
          </div>

          <span className="text-slate-600 dark:text-slate-500 hidden sm:inline">•</span>

          <p className="text-slate-300 font-medium text-[11px] sm:text-xs">
            Scanning in <span className="text-white font-semibold">Mumbai</span>, <span className="text-white font-semibold">Bangalore</span> & <span className="text-white font-semibold">Remote</span>
          </p>

          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-emerald-300 text-[10px] font-mono">
            {ultraFreshCount} fresh &lt; 1h ({totalJobsCount} tracked)
          </span>

          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold">
            Scan in {nextScanSeconds}s
          </span>
        </div>

        {/* Right: Key Benefit Callout */}
        <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
            <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Apply within 60 mins for 4x recruiter callback rate</span>
          </div>
        </div>
      </div>

      {/* Floating Incoming Drop Notification Pill (when a new job arrives in the stream) */}
      {newJobAlert && (
        <div className="max-w-7xl mx-auto mt-2">
          <div className="flex items-center justify-between gap-2 p-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 text-xs animate-pop-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin-slow" />
              <span>
                <strong className="text-white">{newJobAlert.company}</strong> just posted: <span className="underline">{newJobAlert.title}</span> ({newJobAlert.salaryDisplay})
              </span>
            </div>
            <button
              type="button"
              onClick={onDismissAlert}
              className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/30 hover:bg-emerald-500/50 text-white font-semibold cursor-pointer transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
