import dotenv from 'dotenv';
import { sendTestMessage } from './src/discord.js';
import { initDatabase, getStats } from './src/database.js';

dotenv.config();

console.log('🧪 Running Job Search Bot Tests\n');

// Check environment variables
console.log('1️⃣ Checking environment variables...');
if (!process.env.DISCORD_WEBHOOK_URL) {
  console.error('❌ DISCORD_WEBHOOK_URL is not set in .env file');
  process.exit(1);
}
console.log('✅ DISCORD_WEBHOOK_URL is set\n');

// Initialize database
console.log('2️⃣ Initializing database...');
initDatabase();
const stats = getStats();
console.log(`✅ Database initialized. Total jobs tracked: ${stats.total}\n`);

// Test Discord webhook
console.log('3️⃣ Testing Discord webhook...');
await sendTestMessage();
console.log('\n✅ All tests passed! Bot is ready to run.');
console.log('\nRun "npm start" to start the job search bot.');
