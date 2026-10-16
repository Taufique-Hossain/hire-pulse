import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Plus, RotateCcw, Cpu, Sparkles, Trash2 } from 'lucide-react';
import { ALL_AVAILABLE_SKILLS, DEFAULT_CANDIDATE_SKILLS } from '../data/jobsData';

export default function SkillModal({
  isOpen,
  onClose,
  candidateSkills = [],
  onUpdateSkills
}) {
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [newlyAddedSkill, setNewlyAddedSkill] = useState(null);

  // Persistent custom skills added by the user
  const [customSkills, setCustomSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('hirepulse_custom_skills');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load custom skills:', e);
    }
    return [];
  });

  // Keep custom skills synced to localStorage
  const saveCustomSkills = (skills) => {
    setCustomSkills(skills);
    try {
      localStorage.setItem('hirepulse_custom_skills', JSON.stringify(skills));
    } catch (e) {
      console.error('Failed to save custom skills:', e);
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Combined master list of skills: ALL_AVAILABLE_SKILLS + customSkills + any skills in candidateSkills
  const allDisplaySkills = useMemo(() => {
    const map = new Map();
    // 1. Preset skills
    ALL_AVAILABLE_SKILLS.forEach(s => map.set(s.toLowerCase(), s));
    // 2. Saved custom skills
    customSkills.forEach(s => map.set(s.toLowerCase(), s));
    // 3. Active candidate skills (to ensure newly added or loaded skills are always present)
    candidateSkills.forEach(s => map.set(s.toLowerCase(), s));

    return Array.from(map.values());
  }, [candidateSkills, customSkills]);

  if (!isOpen) return null;

  const isSelected = (skill) => {
    return candidateSkills.some(s => s.toLowerCase() === skill.toLowerCase());
  };

  const isCustomSkill = (skill) => {
    return !ALL_AVAILABLE_SKILLS.some(s => s.toLowerCase() === skill.toLowerCase());
  };

  const handleToggleSkill = (skill) => {
    if (isSelected(skill)) {
      onUpdateSkills(candidateSkills.filter(s => s.toLowerCase() !== skill.toLowerCase()));
    } else {
      onUpdateSkills([...candidateSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    const clean = customSkillInput.trim();
    if (!clean) return;

    // Check if skill already exists in allDisplaySkills
    const existing = allDisplaySkills.find(s => s.toLowerCase() === clean.toLowerCase());
    const finalSkillName = existing || clean;

    // If it's a new custom skill not in ALL_AVAILABLE_SKILLS, record it in customSkills
    if (!ALL_AVAILABLE_SKILLS.some(s => s.toLowerCase() === clean.toLowerCase())) {
      if (!customSkills.some(s => s.toLowerCase() === clean.toLowerCase())) {
        saveCustomSkills([...customSkills, finalSkillName]);
      }
    }

    // Always ensure it is added to active candidateSkills
    if (!isSelected(finalSkillName)) {
      onUpdateSkills([...candidateSkills, finalSkillName]);
    }

    setNewlyAddedSkill(finalSkillName);
    setFeedbackMsg(`Added "${finalSkillName}" to your skills matrix`);
    setCustomSkillInput('');

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);

    setTimeout(() => {
      setNewlyAddedSkill(null);
    }, 2500);
  };

  const handleDeleteCustomSkill = (e, skill) => {
    e.stopPropagation();
    // Unselect from candidate skills
    if (isSelected(skill)) {
      onUpdateSkills(candidateSkills.filter(s => s.toLowerCase() !== skill.toLowerCase()));
    }
    // Remove from custom skills library
    const updated = customSkills.filter(s => s.toLowerCase() !== skill.toLowerCase());
    saveCustomSkills(updated);

    setFeedbackMsg(`Removed "${skill}" from library`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleResetDefaults = () => {
    onUpdateSkills(DEFAULT_CANDIDATE_SKILLS);
    setFeedbackMsg('Skills reset to default configuration');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/80 backdrop-blur-md animate-pop-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
                Candidate Skill Matrix
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Compatibility matches update instantaneously across all live job drops.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Another Skill / Framework Form */}
        <form onSubmit={handleAddCustomSkill} className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Add Another Skill / Framework</span>
            </label>
            <span className="text-[10px] font-mono text-zinc-400">
              Press Enter or click Add
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="e.g. Next.js, Node.js, GraphQL, Docker, Python..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!customSkillInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer font-mono shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>

          {/* Instant Feedback Pill */}
          {feedbackMsg && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg animate-pop-in">
              <Check className="w-3.5 h-3.5" />
              <span>{feedbackMsg}</span>
            </div>
          )}
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Skills & Frameworks Library ({candidateSkills.length} selected of {allDisplaySkills.length})
            </label>
          </div>

          {/* All Skills Matrix (Preset + Custom) */}
          <div className="max-h-60 overflow-y-auto pr-1 flex flex-wrap gap-2 font-mono scrollbar-thin">
            {allDisplaySkills.map((skill) => {
              const active = isSelected(skill);
              const isNewlyAdded = newlyAddedSkill && newlyAddedSkill.toLowerCase() === skill.toLowerCase();
              const isCustom = isCustomSkill(skill);

              return (
                <div
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none ${
                    isNewlyAdded
                      ? 'ring-2 ring-emerald-500 scale-105 animate-pulse'
                      : ''
                  } ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25 font-bold'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  title={`${skill} - Click to ${active ? 'deselect' : 'select'}`}
                >
                  {active && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                  <span>{skill}</span>

                  {/* If custom added skill, allow deleting from library */}
                  {isCustom && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomSkill(e, skill)}
                      className={`ml-1 p-0.5 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition cursor-pointer ${
                        active ? 'text-white/80 hover:text-white' : 'text-zinc-400 hover:text-rose-500'
                      }`}
                      title={`Remove "${skill}" from library`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3.5 border-t border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer font-mono"
            title="Reset to default skills"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold transition shadow-sm cursor-pointer font-mono"
          >
            Apply Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
