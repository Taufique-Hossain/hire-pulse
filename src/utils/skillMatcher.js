/**
 * Skill Matcher & Compatibility Scoring Utility
 * Evaluates a candidate's skill matrix against job requirements
 */

export function calculateSkillMatch(candidateSkills = [], requiredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      percentage: 100,
      matchedCount: candidateSkills.length,
      totalRequired: 0,
      matchedSkills: candidateSkills,
      missingSkills: [],
      badge: {
        label: 'Full Match',
        bgClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      }
    };
  }

  const normCandidate = new Set(candidateSkills.map(s => s.toLowerCase().trim()));
  
  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of requiredSkills) {
    const norm = skill.toLowerCase().trim();
    // Direct match or partial match (e.g. 'html5/css' matching 'css')
    const hasMatch = normCandidate.has(norm) || 
      Array.from(normCandidate).some(cand => cand.includes(norm) || norm.includes(cand));
    
    if (hasMatch) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const percentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  let badge;
  if (percentage >= 80) {
    badge = {
      label: 'Exceptional Match',
      bgClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    };
  } else if (percentage >= 60) {
    badge = {
      label: 'Strong Fit',
      bgClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
    };
  } else if (percentage >= 40) {
    badge = {
      label: 'Moderate Fit',
      bgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
    };
  } else {
    badge = {
      label: 'Upskill Potential',
      bgClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    };
  }

  return {
    percentage,
    matchedCount: matchedSkills.length,
    totalRequired: requiredSkills.length,
    matchedSkills,
    missingSkills,
    badge
  };
}

/**
 * Format relative minutes into human-readable time strings
 */
export function formatFreshness(minutesAgo) {
  if (minutesAgo <= 1) return 'Just now';
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours === 1) return '1h ago';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
