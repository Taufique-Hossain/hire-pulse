import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Plus, RotateCcw } from 'lucide-react';
import { ALL_AVAILABLE_SKILLS, DEFAULT_CANDIDATE_SKILLS } from '../data/jobsData';

export default function SkillModal({
  isOpen,
  onClose,
  candidateSkills,
  onUpdateSkills
}) {
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSelected = (skill) => {
    return candidateSkills.some(s => s.toLowerCase() === skill.toLowerCase());
  };

  const handleToggleSkill = (skill) => {
    if (isSelected(skill)) {
      onUpdateSkills(candidateSkills.filter(s => s.toLowerCase() !== skill.toLowerCase()));
    } else {
      onUpdateSkills([...candidateSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !isSelected(clean)) {
      onUpdateSkills([...candidateSkills, clean]);
      setCustomSkillInput('');
    }
  };

  const handleResetDefaults = () => {
    onUpdateSkills(DEFAULT_CANDIDATE_SKILLS);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-pop-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Configure Your Tech Stack
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live match scores across all job postings recalculate in real time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Available Skills Pills */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Select Your Active Skills ({candidateSkills.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_AVAILABLE_SKILLS.map((skill) => {
              const active = isSelected(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleToggleSkill(skill)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm font-bold scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Custom Skill Field */}
        <form onSubmit={handleAddCustomSkill} className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Add Another Specific Skill or Tool
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="e.g. Next.js, Jest, GraphQL..."
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md cursor-pointer"
          >
            Apply & View Matches
          </button>
        </div>
      </div>
    </div>
  );
}
