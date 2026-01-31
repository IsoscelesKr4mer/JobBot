import puppeteer from 'puppeteer';

/**
 * Scrape Indeed for Customer Success Manager jobs
 * @returns {Promise<Array>} - Array of job objects
 */
export async function scrapeIndeed() {
  console.log('🔍 Scraping Indeed...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Build Indeed search URL
    // q = search query
    // l = location
    // remotejob = remote filter
    // fromage = days since posted (7 = past week)
    // sort = date (most recent first)
    const query = encodeURIComponent('Customer Success Manager');
    const location = encodeURIComponent('Remote');
    const searchUrl = `https://www.indeed.com/jobs?q=${query}&l=${location}&remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11&fromage=7&sort=date`;
    
    console.log('📱 Navigating to Indeed...');
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for job listings to load
    await page.waitForSelector('#mosaic-provider-jobcards', { timeout: 10000 }).catch(() => {
      console.log('⚠️  Indeed job list not found, might need to adjust selectors');
    });

    // Give the page a moment to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract job listings
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job_seen_beacon');
      const results = [];

      jobCards.forEach(card => {
        try {
          const titleElement = card.querySelector('h2.jobTitle span[title]');
          const companyElement = card.querySelector('[data-testid="company-name"]');
          const locationElement = card.querySelector('[data-testid="text-location"]');
          const salaryElement = card.querySelector('[data-testid="attribute_snippet_testid"]');
          const linkElement = card.querySelector('h2.jobTitle a');
          const dateElement = card.querySelector('[data-testid="myJobsStateDate"]');

          if (titleElement && companyElement && linkElement) {
            const jobKey = linkElement.getAttribute('data-jk') || linkElement.id || '';
            const jobUrl = jobKey ? `https://www.indeed.com/viewjob?jk=${jobKey}` : linkElement.href;

            results.push({
              title: titleElement.textContent.trim(),
              company: companyElement.textContent.trim(),
              location: locationElement?.textContent.trim() || 'Remote',
              salary: salaryElement?.textContent.trim() || null,
              url: jobUrl,
              source: 'Indeed',
              postedAt: dateElement?.textContent.trim() || 'Recently',
              description: '' // Will be populated if we fetch individual job pages
            });
          }
        } catch (err) {
          // Skip problematic cards
        }
      });

      return results;
    });

    console.log(`✅ Found ${jobs.length} jobs on Indeed`);
    return jobs;

  } catch (error) {
    console.error('❌ Indeed scraping error:', error.message);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Get job description from Indeed job posting page
 * @param {string} jobUrl - Indeed job URL
 * @returns {Promise<string>} - Job description
 */
export async function getIndeedJobDescription(jobUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    await page.goto(jobUrl, { 
      waitUntil: 'networkidle2',
      timeout: 20000 
    });

    const description = await page.evaluate(() => {
      const descElement = document.querySelector('#jobDescriptionText');
      return descElement ? descElement.textContent.trim() : '';
    });

    return description;
  } catch (error) {
    console.error('Error fetching Indeed job description:', error.message);
    return '';
  } finally {
    await browser.close();
  }
}
