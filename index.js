import cron from 'node-cron';
import dotenv from 'dotenv';
import { scrapeLinkedIn } from './src/scrapers/linkedin.js';
import { scrapeIndeed } from './src/scrapers/indeed.js';
import { initDatabase, saveJob, hasJobBeenSeen } from './src/database.js';
import { sendDiscordAlert } from './src/discord.js';
import { filterJobs, calculateMatchScore } from './src/filters.js';

dotenv.config();

// Initialize database on startup
initDatabase();

console.log('🤖 Job Search Bot initialized');
console.log('🔍 Monitoring LinkedIn and Indeed for Customer Success Manager roles');
console.log('📅 Checks will run every 15 minutes');

async function runJobSearch() {
  console.log(`\n⏰ [${new Date().toLocaleTimeString()}] Starting job search...`);
  
  try {
    // Scrape both platforms in parallel
    const [linkedInJobs, indeedJobs] = await Promise.all([
      scrapeLinkedIn().catch(err => {
        console.error('❌ LinkedIn scraper error:', err.message);
        return [];
      }),
      scrapeIndeed().catch(err => {
        console.error('❌ Indeed scraper error:', err.message);
        return [];
      })
    ]);

    const allJobs = [...linkedInJobs, ...indeedJobs];
    console.log(`📊 Found ${allJobs.length} total jobs (${linkedInJobs.length} from LinkedIn, ${indeedJobs.length} from Indeed)`);

    // Filter jobs based on criteria
    const filteredJobs = filterJobs(allJobs);
    console.log(`✅ ${filteredJobs.length} jobs match your criteria`);

    // Process new jobs
    let newJobsCount = 0;
    for (const job of filteredJobs) {
      if (!hasJobBeenSeen(job.url)) {
        // Calculate match score before sending
        job.matchScore = calculateMatchScore(job);
        await sendDiscordAlert(job);
        saveJob(job);
        newJobsCount++;
        // Small delay between Discord messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`🚨 Sent ${newJobsCount} new job alerts to Discord`);
    
  } catch (error) {
    console.error('❌ Error during job search:', error);
  }
}

// Run immediately on startup
console.log('🚀 Running initial job search...');
runJobSearch();

// Schedule to run every 15 minutes
cron.schedule('*/15 * * * *', () => {
  runJobSearch();
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down job search bot...');
  process.exit(0);
});
