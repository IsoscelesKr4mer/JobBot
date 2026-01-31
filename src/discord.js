import { calculateMatchScore } from './filters.js';

/**
 * Send a job alert to Discord using webhook
 * @param {Object} job - Job object with title, company, location, url, etc.
 */
export async function sendDiscordAlert(job) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('❌ DISCORD_WEBHOOK_URL not set in environment variables');
    return;
  }

  const matchScore = job.matchScore || calculateMatchScore(job);
  const color = getColorForScore(matchScore);
  const timeAgo = job.postedAt ? formatTimeAgo(job.postedAt) : 'Recently';

  const embed = {
    title: `🚨 ${job.title}`,
    url: job.url,
    color: color,
    fields: [
      {
        name: '🏢 Company',
        value: job.company,
        inline: true
      },
      {
        name: '📍 Location',
        value: job.location,
        inline: true
      },
      {
        name: '💰 Salary',
        value: job.salary || 'Not specified',
        inline: true
      },
      {
        name: '🌐 Source',
        value: job.source,
        inline: true
      },
      {
        name: '⏰ Posted',
        value: timeAgo,
        inline: true
      },
      {
        name: '🎯 Match Score',
        value: `${matchScore}%`,
        inline: true
      }
    ],
    footer: {
      text: `Be one of the first to apply! • ${new Date().toLocaleString()}`
    }
  };

  // Add description preview if available
  if (job.description) {
    const preview = job.description.substring(0, 200).trim() + '...';
    embed.description = preview;
  }

  const payload = {
    username: 'Job Search Bot',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
    embeds: [embed]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status}`);
    }

    console.log(`✅ Sent alert: ${job.title} at ${job.company}`);
  } catch (error) {
    console.error('❌ Failed to send Discord alert:', error.message);
  }
}

/**
 * Get color based on match score
 * @param {number} score - Match score 0-100
 * @returns {number} - Hex color for Discord embed
 */
function getColorForScore(score) {
  if (score >= 80) return 0x00ff00; // Green - excellent match
  if (score >= 60) return 0xffaa00; // Orange - good match
  return 0xff6600; // Red/Orange - okay match
}

/**
 * Format a timestamp into "X hours ago" or "X days ago"
 * @param {string} timestamp - ISO timestamp or relative time string
 * @returns {string} - Formatted time ago string
 */
function formatTimeAgo(timestamp) {
  // If it's already a relative time string, return it
  if (typeof timestamp === 'string' && timestamp.includes('ago')) {
    return timestamp;
  }

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  } catch {
    return timestamp;
  }
}

/**
 * Send a test message to Discord to verify webhook is working
 */
export async function sendTestMessage() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('❌ DISCORD_WEBHOOK_URL not set');
    return;
  }

  const payload = {
    username: 'Job Search Bot',
    content: '✅ Job search bot is now active and monitoring for Customer Success Manager roles!',
    embeds: [{
      title: '🤖 Bot Status',
      description: 'Monitoring LinkedIn and Indeed every 15 minutes',
      color: 0x00ff00,
      fields: [
        {
          name: 'Target Roles',
          value: 'Customer Success Manager, Technical Account Manager, Solutions Engineer'
        },
        {
          name: 'Focus',
          value: 'Remote | Broadcast/SaaS/Sports Tech | Enterprise'
        }
      ]
    }]
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('✅ Test message sent to Discord');
  } catch (error) {
    console.error('❌ Failed to send test message:', error);
  }
}
