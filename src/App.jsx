import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import RadarBanner from './components/RadarBanner';
import FilterBar from './components/FilterBar';
import JobCard from './components/JobCard';
import KanbanBoard from './components/KanbanBoard';
import JobDetailModal from './components/JobDetailModal';
import SkillModal from './components/SkillModal';
import UndoToast from './components/UndoToast';

import { 
  INITIAL_JOBS, 
  DEFAULT_CANDIDATE_SKILLS, 
  INCOMING_STREAM_POOL 
} from './data/jobsData';

import { 
  Radio, Zap, ShieldCheck, Activity, Cpu 
} from 'lucide-react';

export default function App() {
  // 1. Landing & Refresh Radar Calibration Splash Animation
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [splashFade, setSplashFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFade(true);
    }, 650);
    const removeTimer = setTimeout(() => {
      setIsCalibrating(false);
    }, 950);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // 2. Dark / Light Theme (persisted, defaults to dark)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('hirepulse_theme');
      if (saved) return saved === 'dark';
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('hirepulse_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('hirepulse_theme', 'light');
      }
    } catch (e) {
      console.error("Theme storage error:", e);
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  // 3. Candidate Skills Matrix (persisted in localStorage)
  const [candidateSkills, setCandidateSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('hirepulse_skills');
      return saved ? JSON.parse(saved) : DEFAULT_CANDIDATE_SKILLS;
    } catch {
      return DEFAULT_CANDIDATE_SKILLS;
    }
  });

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const handleUpdateSkills = (newSkills) => {
    setCandidateSkills(newSkills);
    try {
      localStorage.setItem('hirepulse_skills', JSON.stringify(newSkills));
    } catch (e) {
      console.error("Failed to save skills:", e);
    }
  };

  // 4. Application Pipeline State (persisted: { [jobId]: 'saved' | 'applied' | 'interviewing' | 'offered' })
  const [pipeline, setPipeline] = useState(() => {
    try {
      const saved = localStorage.getItem('hirepulse_pipeline');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hirepulse_pipeline', JSON.stringify(pipeline));
    } catch (e) {
      console.error("Failed to save pipeline:", e);
    }
  }, [pipeline]);

  // 5. Jobs Collection State
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  // 6. Optimistic UI Updates & Undo Toast
  const [undoToast, setUndoToast] = useState(null);
  const undoTimeoutRef = useRef(null);

  const triggerOptimisticAction = (jobId, previousStage, newStage, message) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    // Apply update instantly (0ms interface latency)
    setPipeline(prev => ({ ...prev, [jobId]: newStage }));

    // Show undo toast
    setUndoToast({
      jobId,
      previousStage,
      newStage,
      message
    });

    // Auto-dismiss after 5 seconds
    undoTimeoutRef.current = setTimeout(() => {
      setUndoToast(null);
    }, 5000);
  };

  const handleApply = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    const previousStage = pipeline[jobId] || null;
    triggerOptimisticAction(
      jobId, 
      previousStage, 
      'applied', 
      `Application submitted to ${job?.company || 'Company'} ✓`
    );
  };

  const handleSave = (jobId) => {
    const isCurrentlySaved = pipeline[jobId] === 'saved';
    const newStage = isCurrentlySaved ? null : 'saved';
    const job = jobs.find(j => j.id === jobId);

    if (newStage) {
      triggerOptimisticAction(jobId, pipeline[jobId], 'saved', `Saved ${job?.company || 'job'} to Pipeline`);
    } else {
      setPipeline(prev => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
    }
  };

  const handleMoveStage = (jobId, newStage) => {
    const previousStage = pipeline[jobId];
    const job = jobs.find(j => j.id === jobId);
    triggerOptimisticAction(
      jobId, 
      previousStage, 
      newStage, 
      `Moved ${job?.company || 'job'} to ${newStage.toUpperCase()}`
    );
  };

  const handleRemoveFromPipeline = (jobId) => {
    setPipeline(prev => {
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
  };

  const handleUndo = () => {
    if (!undoToast) return;
    const { jobId, previousStage } = undoToast;
    if (previousStage) {
      setPipeline(prev => ({ ...prev, [jobId]: previousStage }));
    } else {
      setPipeline(prev => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
    }
    setUndoToast(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };

  // 7. View Mode: 'list' (Radar Feed) vs 'kanban' (Pipeline Board)
  const [viewMode, setViewMode] = useState('list');

  // 8. Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [experience, setExperience] = useState('All');
  const [minSalary, setMinSalary] = useState(6);
  const [ultraFreshOnly, setUltraFreshOnly] = useState(false);

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' || 
    workMode !== 'All' || 
    experience !== 'All' || 
    minSalary > 6 || 
    ultraFreshOnly
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setWorkMode('All');
    setExperience('All');
    setMinSalary(6);
    setUltraFreshOnly(false);
  };

  // 9. Filtered Jobs Computation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      if (workMode !== 'All' && job.workMode !== workMode) {
        return false;
      }

      if (experience !== 'All' && job.experience !== experience) {
        return false;
      }

      if (job.salaryLPA < minSalary) {
        return false;
      }

      if (ultraFreshOnly && job.postedMinutesAgo > 60) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, workMode, experience, minSalary, ultraFreshOnly]);

  // 10. Active Modal for Detailed Job View
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  // 11. Real-Time Radar Stream Simulation
  const [nextScanSeconds, setNextScanSeconds] = useState(30);
  const [newJobAlert, setNewJobAlert] = useState(null);
  const streamPoolIndexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNextScanSeconds((prev) => {
        if (prev <= 1) {
          if (streamPoolIndexRef.current < INCOMING_STREAM_POOL.length) {
            const rawIncoming = INCOMING_STREAM_POOL[streamPoolIndexRef.current];
            const newJob = {
              ...rawIncoming,
              id: `hp-live-${Date.now()}`,
              postedMinutesAgo: 1,
              applicantsCount: 2,
              urgency: 'Fresh Drop',
              salaryLPA: rawIncoming.salaryLPA || 14
            };

            setJobs(current => [newJob, ...current]);
            setNewJobAlert(newJob);
            streamPoolIndexRef.current += 1;
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const appliedCount = Object.values(pipeline).filter(s => s === 'applied' || s === 'interviewing' || s === 'offered').length;
  const savedCount = Object.values(pipeline).filter(s => s === 'saved').length;
  const ultraFreshCount = jobs.filter(j => j.postedMinutesAgo <= 60).length;

  return (
    <div className={`min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-radar-grid-dark' : 'bg-radar-grid-light'
    }`}>
      {/* 0. Landing / Refresh Radar Calibration Splash Animation */}
      {isCalibrating && (
        <div 
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/98 backdrop-blur-2xl transition-all duration-300 ease-out ${
            splashFade ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
          }`}
          aria-hidden="true"
        >
          {/* Animated Sonar Rings */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-28 h-28 rounded-full border border-indigo-500/30 animate-sonar-pulse pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-violet-500/20 animate-sonar-pulse pointer-events-none" style={{ animationDelay: '0.6s' }} />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/40 animate-pop-in">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Radio className="w-7 h-7 text-cyan-400 animate-pulse stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Title & Status */}
          <div className="flex items-center gap-2 mb-1.5 animate-slide-down">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">Pulse</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              RADAR ONLINE
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-mono mb-5 tracking-wide text-center max-w-xs">
            Calibrating Tech Frequencies... Scanning Mumbai & Bangalore Nodes
          </p>

          {/* Progress Bar Line */}
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden p-0">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full animate-progress-sweep" />
          </div>
        </div>
      )}

      {/* 1. Header & Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onOpenSkillModal={() => setIsSkillModalOpen(true)}
        userSkillsCount={candidateSkills.length}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        appliedCount={appliedCount}
        savedCount={savedCount}
        totalJobsCount={jobs.length}
      />

      {/* 2. Live Radar Broadcast Banner */}
      <RadarBanner
        newJobAlert={newJobAlert}
        onDismissAlert={() => setNewJobAlert(null)}
        totalJobsCount={jobs.length}
        ultraFreshCount={ultraFreshCount}
        nextScanSeconds={nextScanSeconds}
      />

      {/* 3. Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Filter Controls Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          workMode={workMode}
          onWorkModeChange={setWorkMode}
          experience={experience}
          onExperienceChange={setExperience}
          minSalary={minSalary}
          onMinSalaryChange={setMinSalary}
          ultraFreshOnly={ultraFreshOnly}
          onToggleUltraFresh={() => setUltraFreshOnly(prev => !prev)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          filteredCount={filteredJobs.length}
          totalCount={jobs.length}
        />

        {/* View Switch: Radar Feed vs Pipeline Kanban */}
        {viewMode === 'list' ? (
          <div>
            {filteredJobs.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6">
                <Radio className="w-10 h-10 text-indigo-400 mx-auto mb-3 animate-pulse" />
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">
                  No matching jobs found on current radar
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-sm mx-auto font-mono">
                  Try adjusting your minimum CTC, clearing filters, or turning off the "Fresh &lt; 1h" toggle.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-indigo-500/25 font-mono"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredJobs.map((job, idx) => (
                  <JobCard
                    key={job.id}
                    index={idx}
                    job={job}
                    candidateSkills={candidateSkills}
                    pipelineStatus={pipeline[job.id]}
                    onApply={handleApply}
                    onSave={handleSave}
                    onViewDetails={setSelectedJobForModal}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <KanbanBoard
            jobs={jobs}
            pipeline={pipeline}
            onMoveStage={handleMoveStage}
            onRemoveFromPipeline={handleRemoveFromPipeline}
            onViewDetails={setSelectedJobForModal}
          />
        )}

        {/* Technical Architecture Highlights Banner */}
        <section className="mt-14 sm:mt-20 p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-zinc-50 to-indigo-50/40 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1 font-mono">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Production Frontend Architecture • FirstHire Spec</span>
            </span>
            <h3 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Engineered for High-Frequency Job Discovery & Zero-Lag State
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              HirePulse combines real-time streaming telemetry with optimistic client-side updates (0ms interface latency), 
              reactive skill gap scoring, responsive Kanban drag/progression states, and Web Storage persistence for 100% offline tolerance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <p className="font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5 font-sans">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Optimistic Updates</span>
                </p>
                <p className="text-zinc-500 text-[11px]">Instant 0ms pipeline stage shifts with full 5-second Undo rollback capabilities.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <p className="font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5 font-sans">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Dynamic Match %</span>
                </p>
                <p className="text-zinc-500 text-[11px]">Reactive skill compatibility scoring comparing candidate matrix against job criteria.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <p className="font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5 font-sans">
                  <Activity className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Freshness Radar</span>
                </p>
                <p className="text-zinc-500 text-[11px]">Time-decay relative telemetry highlighting postings made within the golden 60-minute window.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/90 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Radio className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-zinc-900 dark:text-white font-sans">HirePulse</span>
            <span className="font-mono text-[11px]">— Real-Time Tech Job Radar & Application Pipeline</span>
          </div>

          <p className="text-[11px] font-mono">
            React 19 & Tailwind CSS v4 • High-Velocity Frontend Architecture
          </p>
        </div>
      </footer>

      {/* 5. Modals & Notifications */}
      <JobDetailModal
        job={selectedJobForModal}
        isOpen={Boolean(selectedJobForModal)}
        onClose={() => setSelectedJobForModal(null)}
        candidateSkills={candidateSkills}
        pipelineStatus={selectedJobForModal ? pipeline[selectedJobForModal.id] : null}
        onApply={handleApply}
        onSave={handleSave}
      />

      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        candidateSkills={candidateSkills}
        onUpdateSkills={handleUpdateSkills}
      />

      <UndoToast
        toast={undoToast}
        onUndo={handleUndo}
        onDismiss={() => setUndoToast(null)}
      />
    </div>
  );
}
