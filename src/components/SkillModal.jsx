import React, { useState, useEffect } from 'react';
import { X, Check, Plus, RotateCcw, Cpu } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/75 backdrop-blur-md animate-pop-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
                Candidate Skill Matrix
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Compatibility percentages recalculate reactively across all radar openings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Available Skills Pills in Monospace */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2.5 font-mono">
            Active Core Skills ({candidateSkills.length} selected)
          </label>
          <div className="flex flex-wrap gap-2 font-mono">
            {ALL_AVAILABLE_SKILLS.map((skill) => {
              const active = isSelected(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleToggleSkill(skill)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25 font-bold scale-102'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
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
        <form onSubmit={handleAddCustomSkill} className="mb-6 font-mono">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
            Add Another Skill / Framework
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="e.g. Next.js, Jest, GraphQL..."
              className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-500/25 cursor-pointer font-mono"
          >
            Apply Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
