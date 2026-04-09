// Returns a 0-100 completeness score and a list of missing items
export function useCVScore(cv) {
  const checks = [
    { label: 'First & last name', done: !!(cv.personal.firstName && cv.personal.lastName) },
    { label: 'Email address', done: !!cv.personal.email },
    { label: 'Phone number', done: !!cv.personal.phone },
    { label: 'About / Summary', done: !!cv.personal.summary?.trim() },
    { label: 'At least one job', done: cv.experience?.length > 0 },
    { label: 'Job descriptions', done: cv.experience?.some(e => e.description?.trim()) },
    { label: 'Education entry', done: cv.education?.length > 0 },
    { label: 'At least 3 skills', done: cv.skills?.length >= 3 },
    { label: 'Profile photo', done: !!cv.personal.photo },
    { label: 'Website or LinkedIn', done: !!cv.personal.website },
  ];

  const done = checks.filter(c => c.done).length;
  const score = Math.round((done / checks.length) * 100);
  const missing = checks.filter(c => !c.done).map(c => c.label);

  let label = 'Getting started';
  if (score >= 90) label = 'Excellent';
  else if (score >= 70) label = 'Looking good';
  else if (score >= 50) label = 'Half way there';
  else if (score >= 30) label = 'Keep going';

  return { score, label, missing, total: checks.length, done };
}
