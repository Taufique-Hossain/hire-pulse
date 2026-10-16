import React from 'react';
import { Zap, Sparkles, Activity } from 'lucide-react';

export default function RadarBanner({
  newJobAlert,
  onDismissAlert,
  totalJobsCount,
  ultraFreshCount,
  nextScanSeconds = 30
}) {
  return (
    <div className="relative overflow-hidden bg-zinc-950 border-b border-zinc-800 py-2.5 px-3 sm:px-6">
      {/* Subtle top accent beam */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {/* Left: Radar Live Beacon & Scan Frequency */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-extrabold text-cyan-400 uppercase tracking-widest text-[10px] font-mono flex items-center gap-1">
              <span>SCANNER ONLINE</span>
            </span>
          </div>

          <span className="text-zinc-700 hidden sm:inline">•</span>

          <p className="text-zinc-300 font-medium text-[11px] sm:text-xs">
            Tracking tech nodes in <span className="text-white font-semibold">Mumbai</span>, <span className="text-white font-semibold">Bangalore</span> & <span className="text-white font-semibold">Remote</span>
          </p>

          <span className="px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold">
            {ultraFreshCount} Fresh &lt; 1h ({totalJobsCount} Total)
          </span>

          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center gap-1">
            <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span>Scan in {nextScanSeconds}s</span>
          </span>
        </div>

        {/* Right: Telemetry Advantage Callout */}
        <div className="flex items-center gap-3 text-zinc-400 text-[11px] shrink-0 font-mono">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Sub-60min applicants yield 4x interview conversion</span>
          </div>
        </div>
      </div>

      {/* Floating Incoming Drop Notification Pill (when a new job arrives in the stream) */}
      {newJobAlert && (
        <div className="max-w-7xl mx-auto mt-2">
          <div className="flex items-center justify-between gap-2 p-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-950/90 via-violet-950/90 to-zinc-900 border border-indigo-500/40 text-indigo-200 text-xs shadow-xl animate-pop-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin-slow" />
              <span>
                <strong className="text-white font-bold">{newJobAlert.company}</strong> just posted: <span className="underline text-cyan-300">{newJobAlert.title}</span> ({newJobAlert.salaryDisplay})
              </span>
            </div>
            <button
              type="button"
              onClick={onDismissAlert}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 text-white font-bold cursor-pointer transition border border-indigo-500/30"
            >
              Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
