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
  DEFAULT_PIPELINE,
  INCOMING_STREAM_POOL 
} from './data/jobsData';

import { 
  Radio, Zap, Cpu 
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

  // 4. Jobs Collection State (persisted so dynamic stream drops are never lost)
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('hirepulse_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(j => j.id));
          const missingInitial = INITIAL_JOBS.filter(j => !existingIds.has(j.id));
          return [...parsed, ...missingInitial];
        }
      }
      return INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hirepulse_jobs', JSON.stringify(jobs));
    } catch (e) {
      console.error("Failed to save jobs:", e);
    }
  }, [jobs]);

  // 5. Application Pipeline State (persisted: { [jobId]: 'saved' | 'applied' | 'interviewing' | 'offered' })
  const [pipeline, setPipeline] = useState(() => {
    try {
      const saved = localStorage.getItem('hirepulse_pipeline');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only accept if at least one key matches an existing job in INITIAL_JOBS
        const hasValid = Object.keys(parsed).some(id => INITIAL_JOBS.some(j => j.id === id));
        if (hasValid && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
      return DEFAULT_PIPELINE;
    } catch {
      return DEFAULT_PIPELINE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hirepulse_pipeline', JSON.stringify(pipeline));
    } catch (e) {
      console.error("Failed to save pipeline:", e);
    }
  }, [pipeline]);

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

  // 10. Active Modal for Detailed Job View & URL Deep-Linking
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  const handleOpenJobModal = (job) => {
    setSelectedJobForModal(job);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('job', job.id);
      url.hash = 'jobs';
      window.history.pushState({ jobId: job.id }, '', url.toString());
    } catch (e) {
      console.error('URL pushState error:', e);
    }
  };

  const handleCloseJobModal = () => {
    setSelectedJobForModal(null);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('job')) {
        url.searchParams.delete('job');
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {
      console.error('URL pushState error:', e);
    }
  };

  // Deep-link resolution: Auto-open modal when shared ?job= or #job= link is opened
  useEffect(() => {
    const syncJobFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        let targetJobId = params.get('job');

        if (!targetJobId && window.location.hash) {
          const hash = window.location.hash;
          if (hash.includes('job=')) {
            const match = hash.match(/job=([^&]+)/);
            if (match) targetJobId = match[1];
          } else if (hash.startsWith('#hp-')) {
            targetJobId = hash.substring(1);
          }
        }

        if (targetJobId) {
          // 1. Look in currently loaded jobs
          let found = jobs.find(j => j.id === targetJobId);
          // 2. Fallback to INITIAL_JOBS
          if (!found) {
            found = INITIAL_JOBS.find(j => j.id === targetJobId);
          }
          // 3. Fallback to INCOMING_STREAM_POOL
          if (!found) {
            const poolMatch = INCOMING_STREAM_POOL.find(j => j.id === targetJobId);
            if (poolMatch) {
              found = {
                ...poolMatch,
                id: targetJobId,
                postedMinutesAgo: 3,
                applicantsCount: 4,
                urgency: 'Shared Drop'
              };
              setJobs(prev => [found, ...prev]);
            }
          }

          if (found) {
            setSelectedJobForModal(found);
            // Smoothly scroll to jobs section
            setTimeout(() => {
              const el = document.getElementById('jobs');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        } else {
          // If the URL has no job param, close modal if open via browser navigation
          setSelectedJobForModal(null);
        }
      } catch (err) {
        console.error('Error syncing job from URL:', err);
      }
    };

    syncJobFromUrl();
    window.addEventListener('popstate', syncJobFromUrl);
    return () => window.removeEventListener('popstate', syncJobFromUrl);
  }, [jobs]);

  // 11. Real-Time Radar Stream Simulation
  const [nextScanSeconds, setNextScanSeconds] = useState(30);
  const [newJobAlert, setNewJobAlert] = useState(null);
  const streamPoolIndexRef = useRef(0);

  // 1-second cadence countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNextScanSeconds((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 30-second cadence job drop from incoming stream
  useEffect(() => {
    const dropTimer = setInterval(() => {
      if (streamPoolIndexRef.current < INCOMING_STREAM_POOL.length) {
        const rawIncoming = INCOMING_STREAM_POOL[streamPoolIndexRef.current];
        streamPoolIndexRef.current += 1;
        const uniqueId = `hp-live-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newJob = {
          ...rawIncoming,
          id: uniqueId,
          postedMinutesAgo: 1,
          applicantsCount: 2,
          urgency: 'Fresh Drop',
          salaryLPA: rawIncoming.salaryLPA || 14
        };

        setJobs((current) => {
          if (current.some((j) => j.company === newJob.company && j.title === newJob.title)) {
            return current;
          }
          return [newJob, ...current];
        });
        setNewJobAlert(newJob);
      }
    }, 30000);

    return () => clearInterval(dropTimer);
  }, []);

  const validJobIds = useMemo(() => new Set(jobs.map(j => j.id)), [jobs]);

  const appliedCount = useMemo(() => {
    return Object.entries(pipeline).filter(
      ([id, s]) => validJobIds.has(id) && (s === 'applied' || s === 'interviewing' || s === 'offered')
    ).length;
  }, [pipeline, validJobIds]);

  const savedCount = useMemo(() => {
    return Object.entries(pipeline).filter(
      ([id, s]) => validJobIds.has(id) && s === 'saved'
    ).length;
  }, [pipeline, validJobIds]);

  const ultraFreshCount = jobs.filter(j => j.postedMinutesAgo <= 60).length;

  return (
    <div className={`min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-radar-grid-dark' : 'bg-radar-grid-light'
    }`}>
      {/* 0. Cinematic Shutter & ECG Waveform Entrance Animation */}
      {isCalibrating && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          {/* Top Shutter Panel */}
          <div 
            className={`absolute top-0 inset-x-0 h-1/2 bg-zinc-950 border-b border-indigo-500/30 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              splashFade ? '-translate-y-full' : 'translate-y-0'
            }`}
          >
            {/* Subtle grid pattern */}
            <div className="w-full h-full opacity-30 bg-radar-grid-dark" />
          </div>
          
          {/* Bottom Shutter Panel */}
          <div 
            className={`absolute bottom-0 inset-x-0 h-1/2 bg-zinc-950 border-t border-indigo-500/30 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              splashFade ? 'translate-y-full' : 'translate-y-0'
            }`}
          >
            {/* Subtle grid pattern */}
            <div className="w-full h-full opacity-30 bg-radar-grid-dark" />
          </div>

          {/* Center Precision Reticle & ECG Pulse HUD */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-250 ease-out z-10 ${
              splashFade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Precision HUD Reticle Box */}
            <div className="relative max-w-[calc(100vw-2rem)] px-5 py-6 sm:px-10 sm:py-8 flex flex-col items-center bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-2xl">
              {/* Four Precision Corner Brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 sm:w-3.5 sm:h-3.5 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute top-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-3.5 sm:h-3.5 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 border-b-2 border-r-2 border-indigo-400" />

              {/* Status Header */}
              <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-zinc-400 mb-2.5 sm:mb-3">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>BLR-MUM-01</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-indigo-300">142.8 MHz</span>
              </div>

              {/* Animated ECG Heartbeat / Radar Pulse Line */}
              <div className="relative my-1 sm:my-2">
                <svg className="w-48 sm:w-60 h-10 sm:h-12 overflow-visible" viewBox="0 0 260 50" fill="none">
                  {/* Faint reference grid line */}
                  <line x1="0" y1="25" x2="260" y2="25" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Active Animated ECG Path */}
                  <path
                    d="M0 25 H70 L80 8 L90 42 L100 15 L110 32 L120 25 H260"
                    stroke="url(#pulse-gradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-ecg-draw"
                  />
                  <defs>
                    <linearGradient id="pulse-gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Monogram Brand Title */}
              <div className="flex items-center gap-2 mt-1 sm:mt-2">
                <h1 className="text-lg sm:text-2xl font-black font-mono tracking-[0.15em] sm:tracking-[0.2em] text-white">
                  HIREPULSE
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LOCKED
                </span>
              </div>

              {/* Telemetry subline */}
              <p className="text-[10px] sm:text-[11px] font-mono text-zinc-400 mt-1.5 sm:mt-2 tracking-wide text-center">
                Synthesizing Live Engineering Radar...
              </p>
            </div>
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
        onReviewAlert={(alertJob) => {
          handleOpenJobModal(alertJob);
          setNewJobAlert(null);
        }}
        totalJobsCount={jobs.length}
        ultraFreshCount={ultraFreshCount}
        nextScanSeconds={nextScanSeconds}
      />

      {/* 3. Main Workspace */}
      {/* 3. High-Fidelity Hero Section */}
      <section id="home" className="relative pt-8 pb-10 sm:pt-16 sm:pb-20 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Live Radar chip */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] sm:text-xs font-mono font-semibold mb-4 sm:mb-6 max-w-full">
              <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 animate-pulse shrink-0" />
              <span className="truncate">LIVE RADAR • INDIA & GLOBAL TECH HUBS</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.15] sm:leading-[1.1] mb-3 sm:mb-5 break-words">
              High-Velocity Tech Job Radar & Application Pipeline.
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 sm:mb-8">
              Filter sub-60-minute postings, calculate instantaneous skill compatibility against modern engineering stacks, and manage your pipeline with 0ms optimistic updates.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <a
                href="#jobs"
                onClick={() => setViewMode('list')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-bold shadow-lg shadow-zinc-900/10 transition cursor-pointer text-center"
              >
                <Zap className="w-4 h-4 fill-current text-indigo-400 dark:text-indigo-600 shrink-0" />
                <span>Scan Fresh Openings</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setViewMode('kanban');
                  setTimeout(() => {
                    const el = document.getElementById('pipeline');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs sm:text-sm font-bold border border-zinc-200 dark:border-zinc-700 transition cursor-pointer text-center"
              >
                <span>Open Kanban Pipeline</span>
                {appliedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    {appliedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsSkillModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs sm:text-sm font-semibold transition cursor-pointer text-center"
              >
                <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Skills Matrix ({candidateSkills.length})</span>
              </button>
            </div>

            {/* High-trust Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <div>
                <span className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono block">
                  &lt;60m
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Golden Window Drops
                </span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono block">
                  0ms
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Optimistic Shifts
                </span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                  100%
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Offline Storage
                </span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono block">
                  Reactive
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Skill Match
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Workspace */}
      <main id="jobs" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
        {/* View Switch: Radar Feed vs Pipeline Kanban */}
        {viewMode === 'list' ? (
          <div>
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

            {filteredJobs.length === 0 ? (
              <div className="py-12 sm:py-16 text-center rounded-2xl sm:rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 sm:p-6">
                <Radio className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400 mx-auto mb-3 animate-pulse" />
                <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white mb-1">
                  No matching jobs found on current radar
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-sm mx-auto font-mono">
                  Try adjusting your minimum CTC, clearing filters, or turning off the "Fresh &lt; 60m" toggle.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {filteredJobs.map((job, idx) => (
                  <JobCard
                    key={job.id}
                    index={idx}
                    job={job}
                    candidateSkills={candidateSkills}
                    pipelineStatus={pipeline[job.id]}
                    onApply={handleApply}
                    onSave={handleSave}
                    onViewDetails={handleOpenJobModal}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div id="pipeline" className="scroll-mt-24">
            <KanbanBoard
              jobs={jobs}
              pipeline={pipeline}
              onMoveStage={handleMoveStage}
              onRemoveFromPipeline={handleRemoveFromPipeline}
              onViewDetails={handleOpenJobModal}
              onResetToSample={() => setPipeline(DEFAULT_PIPELINE)}
              onSwitchToFeed={() => setViewMode('list')}
            />
          </div>
        )}
      </main>

      {/* 5. Minimalist Developer Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md py-6 sm:py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shrink-0">
              <Radio className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white font-sans text-sm">HirePulse</span>
            <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500">• Real-Time Tech Job Discovery Engine</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-[11px] font-mono text-zinc-500">
            <a href="#home" className="hover:text-zinc-900 dark:hover:text-white transition">Back to Top</a>
            <span>•</span>
            <a href="#jobs" onClick={() => setViewMode('list')} className="hover:text-zinc-900 dark:hover:text-white transition">Radar</a>
            <span>•</span>
            <a href="#jobs" onClick={() => setViewMode('kanban')} className="hover:text-zinc-900 dark:hover:text-white transition">Pipeline</a>
          </div>

          <p className="text-[10px] sm:text-[11px] font-mono text-zinc-400">
            React 19 & Tailwind CSS v4
          </p>
        </div>
      </footer>

      {/* 5. Modals & Notifications */}
      <JobDetailModal
        job={selectedJobForModal}
        isOpen={Boolean(selectedJobForModal)}
        onClose={handleCloseJobModal}
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
