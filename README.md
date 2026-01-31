# 🤖 Job Search Discord Bot

Automated job search bot that monitors LinkedIn and Indeed for Customer Success Manager roles and sends instant Discord alerts when new positions are posted.

Built to give you first-mover advantage in a competitive job market by alerting you within minutes of new job postings.

## 🎯 Features

- **🔍 Multi-platform scraping**: Monitors both LinkedIn and Indeed
- **⚡ Real-time alerts**: Get notified within 15 minutes of new postings
- **🎨 Rich Discord embeds**: Beautiful, informative job alerts
- **🧠 Smart filtering**: Automatically filters for relevant CSM/TAM roles
- **🎯 Match scoring**: Rates jobs based on your criteria (industry, seniority, tech stack)
- **💾 Deduplication**: SQLite database prevents duplicate alerts
- **🚀 Railway-ready**: One-click deployment

## 📊 What It Filters For

**Target Roles:**
- Customer Success Manager
- Technical Account Manager
- Solutions Engineer
- Customer Success Engineer

**Excludes:**
- Junior/Associate positions
- Director/VP level roles
- Entry-level positions

**Preferred:**
- Remote or Seattle-area positions
- SaaS, tech, and enterprise software companies
- Enterprise/B2B focus
- Technical CSM roles (API, SQL, integrations)
- Bonus scoring for broadcast/media/sports tech (your background)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Discord server with webhook access
- Railway account (for deployment)

### Local Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/job-search-bot.git
   cd job-search-bot
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Discord webhook URL
   ```

3. **Create Discord Webhook**
   - Go to your Discord server
   - Server Settings > Integrations > Webhooks
   - Create webhook, copy URL
   - Paste into `.env` file

4. **Run locally**
   ```bash
   npm start
   ```

## 🌐 Deploy to Railway

1. **Connect GitHub**
   - Push this repo to your GitHub account
   - Go to [Railway.app](https://railway.app)
   - Create new project > Deploy from GitHub repo

2. **Set environment variables**
   - In Railway dashboard, go to Variables
   - Add `DISCORD_WEBHOOK_URL` with your webhook URL

3. **Deploy**
   - Railway will automatically build and deploy
   - Bot will start running every 15 minutes

## 📁 Project Structure

```
job-search-bot/
├── src/
│   ├── scrapers/
│   │   ├── linkedin.js      # LinkedIn job scraper
│   │   └── indeed.js        # Indeed job scraper
│   ├── database.js          # SQLite database for job tracking
│   ├── discord.js           # Discord webhook notifications
│   └── filters.js           # Job filtering logic
├── index.js                 # Main bot orchestrator
├── package.json             # Dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🔧 Customization

### Adjust Search Criteria

Edit `src/filters.js` to customize:
- Target job titles
- Exclude keywords
- Preferred industries
- Location preferences
- Match scoring algorithm

### Change Check Frequency

Edit `index.js` line 48:
```javascript
// Current: every 15 minutes
cron.schedule('*/15 * * * *', () => {
  runJobSearch();
});

// Change to hourly:
cron.schedule('0 * * * *', () => {
  runJobSearch();
});
```

### Add More Job Boards

Create a new scraper in `src/scrapers/` following the pattern in `linkedin.js` or `indeed.js`.

## 📊 Discord Alert Format

```
🚨 Senior Customer Success Manager

🏢 Company: Acme Corp
📍 Location: Remote
💰 Salary: $120-150K
🌐 Source: LinkedIn
⏰ Posted: 23 minutes ago
🎯 Match Score: 85%

Description preview...

[Apply Now Button]
```

## ⚠️ Important Notes

### Legal & Terms of Service

- **LinkedIn/Indeed TOS**: Web scraping may violate terms of service at scale
- **Personal use**: This bot is designed for individual job search use
- **Rate limiting**: Respects site resources with reasonable check intervals
- **No authentication**: Does not log into accounts or bypass security

### Limitations

- **Puppeteer overhead**: Headless browser scraping is resource-intensive
- **Selector brittleness**: Sites may change HTML structure, breaking scrapers
- **No full descriptions**: LinkedIn requires auth for full job descriptions
- **Rate limits**: Aggressive scraping may get IP blocked

### Best Practices

- Use on your own Railway/VPS account
- Don't share publicly with webhook URL exposed
- Monitor for scraper breakage (sites change frequently)
- Consider native email alerts as backup

## 🛠️ Troubleshooting

**Bot not sending alerts?**
- Check Discord webhook URL in `.env`
- Verify Railway environment variables are set
- Check Railway logs for errors

**No jobs found?**
- Job boards may have changed HTML selectors
- Check console logs for scraping errors
- Try adjusting filters in `filters.js`

**Duplicate alerts?**
- Database (`jobs.db`) should be persistent
- On Railway, ensure volume is mounted
- Clear database: `rm jobs.db` and restart

## 📈 Future Enhancements

- [ ] Add Greenhouse/Lever company career page scrapers
- [ ] Email notifications alongside Discord
- [ ] Web dashboard to view all tracked jobs
- [ ] Machine learning for better match scoring
- [ ] LinkedIn authentication for full descriptions
- [ ] Telegram/Slack notification options

## 🤝 Contributing

This is a personal project, but suggestions welcome! Open an issue or PR.

## 📝 License

MIT License - feel free to use and modify for your own job search.

## 👤 Author

Built by [Your Name] during unemployment after 10+ years in enterprise Customer Success.

**Why I built this:** After getting laid off, I found myself manually checking LinkedIn and Indeed multiple times per day. Being one of the first applicants significantly increases your chances, so I automated the search to get alerts within 15 minutes of new postings.

---

**⭐ If this helped your job search, give it a star!**

**🔗 LinkedIn Post**: [Link to your LinkedIn post about building this]
