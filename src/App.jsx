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

import { Radar, Sparkles, Zap, ShieldCheck, Clock } from 'lucide-react';

export default function App() {
  // 1. Dark / Light Theme (persisted, defaults to dark)
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

  // 2. Candidate Skills Matrix (persisted in localStorage)
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

  // 3. Application Pipeline State (persisted: { [jobId]: 'saved' | 'applied' | 'interviewing' | 'offered' })
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

  // 4. Jobs Collection State (starts with curated Indian tech dataset)
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  // 5. Optimistic UI Updates & Undo Toast
  const [undoToast, setUndoToast] = useState(null);
  const undoTimeoutRef = useRef(null);

  const triggerOptimisticAction = (jobId, previousStage, newStage, message) => {
    // Clear any active undo timer
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    // Apply update instantly (0ms latency)
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

  // 6. View Mode: 'list' (Radar Feed) vs 'kanban' (Pipeline Board)
  const [viewMode, setViewMode] = useState('list');

  // 7. Filter State
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

  // 8. Filtered Jobs Computation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query (title, company, location)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Work Mode
      if (workMode !== 'All' && job.workMode !== workMode) {
        return false;
      }

      // Experience Level
      if (experience !== 'All' && job.experience !== experience) {
        return false;
      }

      // Minimum Salary (LPA)
      if (job.salaryLPA < minSalary) {
        return false;
      }

      // Ultra-fresh (<60m)
      if (ultraFreshOnly && job.postedMinutesAgo > 60) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, workMode, experience, minSalary, ultraFreshOnly]);

  // 9. Active Modal for Detailed Job View
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  // 10. Real-Time Radar Stream Simulation (Scans and drops new jobs)
  const [nextScanSeconds, setNextScanSeconds] = useState(30);
  const [newJobAlert, setNewJobAlert] = useState(null);
  const streamPoolIndexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNextScanSeconds((prev) => {
        if (prev <= 1) {
          // Trigger scan drop from incoming pool if available
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
          return 30; // reset to 30s countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Counts
  const appliedCount = Object.values(pipeline).filter(s => s === 'applied' || s === 'interviewing' || s === 'offered').length;
  const savedCount = Object.values(pipeline).filter(s => s === 'saved').length;
  const ultraFreshCount = jobs.filter(j => j.postedMinutesAgo <= 60).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-250">
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

        {/* View Switch: Radar Feed (List Grid) vs Application Pipeline (Kanban) */}
        {viewMode === 'list' ? (
          <div>
            {filteredJobs.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
                <Radar className="w-10 h-10 text-slate-400 mx-auto mb-3 animate-spin-slow" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                  No matching jobs found on current radar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                  Try adjusting your salary threshold, removing filters, or turning off the "Fresh &lt; 1h" toggle.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
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

        {/* Architecture & Engineering Highlights Banner */}
        <section className="mt-14 sm:mt-20 p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border border-slate-200 dark:border-slate-800 transition-all shadow-sm">
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Production Architecture • Built for FirstHire</span>
            </span>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Engineered for High-Frequency Job Discovery & Zero-Lag State
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              HirePulse combines real-time simulated WebSocket streaming with optimistic client-side updates (0ms interface latency), 
              instant skill gap scoring, responsive Kanban drag/progression states, and Web Storage persistence for 100% offline tolerance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Optimistic Updates</span>
                </p>
                <p className="text-slate-500 text-[11px]">Instant 0ms pipeline stage shifts with full 5-second Undo rollback capabilities.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dynamic Match %</span>
                </p>
                <p className="text-slate-500 text-[11px]">Reactive skill compatibility scoring comparing candidate matrix against job criteria.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Freshness Radar</span>
                </p>
                <p className="text-slate-500 text-[11px]">Time-decay relative telemetry highlighting postings made within the golden 60-minute window.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Radar className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-900 dark:text-white font-mono">HirePulse</span>
            <span>— Real-Time Tech Job Radar & Application Pipeline</span>
          </div>

          <p className="text-[11px]">
            Built with React 19 & Tailwind CSS v4 • High-Performance Frontend Engineering
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
