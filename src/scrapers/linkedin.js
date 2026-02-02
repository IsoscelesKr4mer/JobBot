import puppeteer from 'puppeteer';

/**
 * Scrape LinkedIn for Customer Success Manager jobs
 * @returns {Promise<Array>} - Array of job objects
 */
export async function scrapeLinkedIn() {
  console.log('🔍 Scraping LinkedIn...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-first-run',
      '--disable-notifications',
      '--disable-speech-api',
      '--single-process',
      '--no-zygote'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Build LinkedIn search URL
    // f_TPR=r604800 = Past week
    // f_WT=2 = Remote
    const searchUrl = 'https://www.linkedin.com/jobs/search/?keywords=Customer%20Success%20Manager&location=United%20States&f_WT=2&f_TPR=r604800&sortBy=DD';
    
    console.log('📱 Navigating to LinkedIn...');
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for job listings to load
    await page.waitForSelector('.jobs-search__results-list', { timeout: 10000 }).catch(() => {
      console.log('⚠️  LinkedIn job list not found, might need to adjust selectors');
    });

    // Give the page a moment to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract job listings
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.base-card');
      const results = [];

      jobCards.forEach(card => {
        try {
          const titleElement = card.querySelector('.base-search-card__title');
          const companyElement = card.querySelector('.base-search-card__subtitle');
          const locationElement = card.querySelector('.job-search-card__location');
          const linkElement = card.querySelector('a.base-card__full-link');
          const timeElement = card.querySelector('time');

          // Try multiple selectors for salary
          let salary = null;
          const salaryElement = card.querySelector('.job-search-card__salary-info') ||
                               card.querySelector('[class*="salary"]') ||
                               card.querySelector('.base-search-card__metadata');
          if (salaryElement) {
            const salaryText = salaryElement.textContent.trim();
            // Only use if it looks like a salary (contains $, numbers, or salary keywords)
            if (salaryText.match(/\$|k|salary|year|hour|compensation/i)) {
              salary = salaryText;
            }
          }

          if (titleElement && companyElement && linkElement) {
            results.push({
              title: titleElement.textContent.trim(),
              company: companyElement.textContent.trim(),
              location: locationElement?.textContent.trim() || 'Remote',
              salary: salary,
              url: linkElement.href.split('?')[0], // Clean URL
              source: 'LinkedIn',
              postedAt: timeElement?.getAttribute('datetime') || new Date().toISOString(),
              description: '' // LinkedIn doesn't show descriptions in search results
            });
          }
        } catch (err) {
          // Skip problematic cards
        }
      });

      return results;
    });

    console.log(`✅ Found ${jobs.length} jobs on LinkedIn`);
    return jobs;

  } catch (error) {
    console.error('❌ LinkedIn scraping error:', error.message);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Get job description from LinkedIn job posting page
 * Note: This requires authentication, so we skip it for now
 * @param {string} jobUrl - LinkedIn job URL
 * @returns {Promise<string>} - Job description
 */
export async function getLinkedInJobDescription(jobUrl) {
  // LinkedIn requires login to see full job descriptions
  // For now, we'll skip this and rely on title/company filtering
  // Future enhancement: Add LinkedIn authentication
  return '';
}
