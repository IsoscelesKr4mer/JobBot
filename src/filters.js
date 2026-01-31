// Filter jobs based on specific criteria for enterprise CSM roles
// Optimized for 10+ years experience in broadcast/sports tech

const TARGET_KEYWORDS = [
  'customer success manager',
  'technical account manager',
  'solutions engineer',
  'customer success engineer',
  'client success manager',
  'tam', // Common abbreviation for Technical Account Manager
];

const EXCLUDE_KEYWORDS = [
  'junior',
  'associate',
  'director',
  'vp',
  'vice president',
  'head of',
  'intern',
  'entry level',
  'entry-level',
];

const PREFERRED_INDUSTRIES = [
  // Broadcast/Media (your background)
  'broadcast',
  'media',
  'sports',
  'video',
  'streaming',
  'live events',
  
  // General SaaS/Tech (widest net)
  'saas',
  'software',
  'technology',
  'platform',
  'cloud',
  'data',
  'analytics',
  'security',
  'fintech',
  'edtech',
  'healthtech',
  'infrastructure',
  'developer tools',
  'api',
  'automation',
  'ai',
  'machine learning',
  'collaboration',
  'communication',
  'productivity',
  'enterprise software',
  'b2b',
  'marketplace',
];

const LOCATION_KEYWORDS = [
  'remote',
  'work from home',
  'wfh',
  'seattle',
  'washington',
  'pacific northwest',
  'anywhere',
];

/**
 * Filter jobs based on title, description, and location
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Filtered jobs that match criteria
 */
export function filterJobs(jobs) {
  return jobs.filter(job => {
    const titleLower = job.title.toLowerCase();
    const descriptionLower = job.description?.toLowerCase() || '';
    const locationLower = job.location.toLowerCase();
    const combinedText = `${titleLower} ${descriptionLower}`;

    // Must contain at least one target keyword in title
    const hasTargetKeyword = TARGET_KEYWORDS.some(keyword => 
      titleLower.includes(keyword)
    );
    if (!hasTargetKeyword) return false;

    // Must NOT contain exclude keywords in title
    const hasExcludeKeyword = EXCLUDE_KEYWORDS.some(keyword => 
      titleLower.includes(keyword)
    );
    if (hasExcludeKeyword) return false;

    // Must be remote or Seattle area
    const hasValidLocation = LOCATION_KEYWORDS.some(keyword =>
      locationLower.includes(keyword)
    );
    if (!hasValidLocation) return false;

    return true;
  });
}

/**
 * Calculate a match score for a job (0-100)
 * Higher scores indicate better fit
 */
export function calculateMatchScore(job) {
  let score = 50; // Base score
  
  const titleLower = job.title.toLowerCase();
  const descriptionLower = job.description?.toLowerCase() || '';
  const combinedText = `${titleLower} ${descriptionLower}`;

  // Industry match
  PREFERRED_INDUSTRIES.forEach(industry => {
    if (combinedText.includes(industry)) score += 5;
  });

  // Enterprise/B2B
  if (combinedText.includes('enterprise')) score += 10;
  if (combinedText.includes('b2b')) score += 5;

  // Technical indicators
  if (combinedText.includes('technical')) score += 10;
  if (combinedText.includes('api')) score += 5;
  if (combinedText.includes('sql')) score += 5;
  if (combinedText.includes('integration')) score += 5;

  // Seniority indicators
  if (titleLower.includes('senior')) score += 10;
  if (titleLower.includes('lead')) score += 5;

  // Remote preference
  if (job.location.toLowerCase().includes('remote')) score += 10;

  return Math.min(score, 100); // Cap at 100
}
