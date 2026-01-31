# 🚀 Setup Guide

Follow these steps to get your job search bot running in under 10 minutes.

## Step 1: Get Discord Webhook URL

1. Open Discord and go to your server
2. Right-click the channel where you want job alerts
3. Click **Edit Channel** > **Integrations** > **Webhooks**
4. Click **New Webhook** or **Create Webhook**
5. Give it a name like "Job Search Bot"
6. **Copy the Webhook URL** - you'll need this!

## Step 2: Local Setup

```bash
# Navigate to your project folder
cd job-search-bot

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and paste your Discord webhook URL
# On Mac/Linux: nano .env
# On Windows: notepad .env
```

Your `.env` should look like:
```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/123456789/abcdef...
```

## Step 3: Test It

```bash
# Run the test script
npm test
```

You should see:
- ✅ Environment variables check
- ✅ Database initialization  
- ✅ Test message sent to Discord

Check your Discord channel - you should see a test message from the bot!

## Step 4: Run Locally

```bash
# Start the bot
npm start
```

The bot will:
1. Run an immediate job search
2. Send any new jobs to Discord
3. Continue checking every 15 minutes

**Let it run for a few minutes to see if it finds jobs!**

## Step 5: Deploy to Railway

### Option A: Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Link to new project
railway init

# Set environment variable
railway variables set DISCORD_WEBHOOK_URL="your-webhook-url-here"

# Deploy
railway up
```

### Option B: Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click **New Project** > **Deploy from GitHub repo**
3. Select your `job-search-bot` repository
4. Go to **Variables** tab
5. Add variable: `DISCORD_WEBHOOK_URL` = your webhook URL
6. Click **Deploy**

Railway will automatically:
- Install dependencies
- Start the bot
- Keep it running 24/7

## Step 6: Verify Deployment

In Railway dashboard:
1. Go to **Deployments** tab
2. Click latest deployment
3. Check **Logs** - you should see:
   ```
   🤖 Job Search Bot initialized
   🔍 Monitoring LinkedIn and Indeed...
   ```

## Troubleshooting

### "Cannot find module 'puppeteer'"
```bash
npm install
```

### "DISCORD_WEBHOOK_URL not set"
Make sure your `.env` file exists and has the webhook URL.

### "No jobs found"
This is normal if there are no NEW jobs since you started. Wait 15 minutes for next check.

### Railway "Build Failed"
- Make sure `package.json` is in the root directory
- Check Railway logs for specific error
- Verify Node version is 18+

## Customization

### Change check frequency
Edit `index.js` line 48:
```javascript
// Every 15 minutes (current)
cron.schedule('*/15 * * * *', runJobSearch);

// Every 30 minutes
cron.schedule('*/30 * * * *', runJobSearch);

// Every hour
cron.schedule('0 * * * *', runJobSearch);
```

### Adjust filters
Edit `src/filters.js` to change:
- Target keywords
- Exclude keywords  
- Preferred industries
- Location preferences

## Next Steps

1. **Let it run for 24 hours** to see what jobs it finds
2. **Fine-tune filters** based on results
3. **Create LinkedIn post** about building it
4. **Share on GitHub** with the README

---

Need help? Check the main README.md or open an issue on GitHub.
