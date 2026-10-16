/**
 * Skill Matcher & Compatibility Scoring Utility
 * Evaluates a candidate's skill matrix against job requirements with token-level accuracy
 */

export function isSingleSkillMatch(candidateSkill, requiredSkill) {
  if (!candidateSkill || !requiredSkill) return false;

  const cand = candidateSkill.toLowerCase().trim();
  const req = requiredSkill.toLowerCase().trim();

  if (cand === req) return true;

  // Normalize .js extensions (e.g., "react.js" <-> "react", "node.js" <-> "node")
  const candClean = cand.replace(/\.js$/i, '');
  const reqClean = req.replace(/\.js$/i, '');
  if (candClean === reqClean) return true;

  // Split tokens by slashes, ampersands, or commas (e.g., "HTML5/CSS" -> ["html5", "css"])
  const candTokens = cand.split(/[/,&+]+/).map(t => t.trim()).filter(Boolean);
  const reqTokens = req.split(/[/,&+]+/).map(t => t.trim()).filter(Boolean);

  if (reqTokens.includes(candClean) || candTokens.includes(reqClean)) return true;
  if (reqTokens.some(t => candTokens.includes(t))) return true;

  // Multi-word phrase matching (e.g. "Tailwind" matching "Tailwind CSS")
  const candWords = cand.split(/\s+/).filter(w => w.length > 2);
  const reqWords = req.split(/\s+/).filter(w => w.length > 2);

  if (candWords.length === 1 && reqWords.includes(candWords[0])) return true;
  if (reqWords.length === 1 && candWords.includes(reqWords[0])) return true;

  return false;
}

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

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of requiredSkills) {
    const hasMatch = candidateSkills.some(cand => isSingleSkillMatch(cand, skill));
    
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
  if (typeof minutesAgo !== 'number' || minutesAgo <= 1) return 'Just now';
  if (minutesAgo < 60) return `${Math.floor(minutesAgo)}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours === 1) return '1h ago';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
