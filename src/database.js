import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'jobs.db');

let db;

/**
 * Initialize the SQLite database and create tables if they don't exist
 */
export function initDatabase() {
  db = new Database(dbPath);
  
  // Create jobs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      source TEXT NOT NULL,
      salary TEXT,
      posted_at TEXT,
      seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      match_score INTEGER DEFAULT 0
    )
  `);

  console.log('✅ Database initialized at:', dbPath);
}

/**
 * Check if a job URL has already been seen
 * @param {string} url - Job posting URL
 * @returns {boolean} - True if job has been seen before
 */
export function hasJobBeenSeen(url) {
  const stmt = db.prepare('SELECT id FROM jobs WHERE url = ?');
  const result = stmt.get(url);
  return !!result;
}

/**
 * Save a new job to the database
 * @param {Object} job - Job object with url, title, company, location, etc.
 */
export function saveJob(job) {
  const stmt = db.prepare(`
    INSERT INTO jobs (url, title, company, location, source, salary, posted_at, match_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  try {
    stmt.run(
      job.url,
      job.title,
      job.company,
      job.location,
      job.source,
      job.salary || null,
      job.postedAt || null,
      job.matchScore || 0
    );
  } catch (error) {
    if (!error.message.includes('UNIQUE constraint failed')) {
      console.error('Error saving job to database:', error);
    }
  }
}

/**
 * Get all jobs from the database
 * @returns {Array} - Array of all jobs
 */
export function getAllJobs() {
  const stmt = db.prepare('SELECT * FROM jobs ORDER BY seen_at DESC');
  return stmt.all();
}

/**
 * Get statistics about the job search
 * @returns {Object} - Stats object with counts by source
 */
export function getStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
  const bySource = db.prepare('SELECT source, COUNT(*) as count FROM jobs GROUP BY source').all();
  
  return {
    total: total.count,
    bySource: bySource.reduce((acc, row) => {
      acc[row.source] = row.count;
      return acc;
    }, {})
  };
}

/**
 * Close the database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
  }
}
