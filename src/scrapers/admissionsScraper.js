const axios = require('axios');
const cheerio = require('cheerio');

const ADMISSION_URL = 'https://web.mitsgwalior.in/admissions'; // Target URL

// Fallback mock data used when the live page is unavailable
const MOCK_ADMISSIONS = [
  { title: 'B.Tech Admissions 2026-27', details: 'Admissions based on JEE Main scores via DTE MP Counseling.' },
  { title: 'M.Tech Admissions 2026-27', details: 'Admissions based on GATE scores via CCMT Counseling.' },
  { title: 'MBA Admissions 2026-27',    details: 'Admissions based on CAT/MAT scores.' },
  { title: 'Important Dates',           details: 'Online registration begins in June 2026.' },
  { title: 'Contact Admissions Office', details: 'Email: admissions@mitsgwalior.in | Phone: +91-751-XXXXXXX' },
];

const scrapeAdmissions = async () => {
  try {
    const { data } = await axios.get(ADMISSION_URL, {
      headers: { 'User-Agent': 'AskMITS-Bot/1.0' },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const admissionsInfo = [];

    // NOTE: Update selector for exact admissions DOM elements
    $('.admission-info, .card-content').each((index, element) => {
      if (index >= 5) return false;

      const title   = $(element).find('h3, strong').text().replace(/\s+/g, ' ').trim();
      const details = $(element).text().replace(/\s+/g, ' ').trim();

      if (title || details) admissionsInfo.push({ title, details });
    });

    // Fallback to mock if selectors matched nothing
    return admissionsInfo.length > 0 ? admissionsInfo : MOCK_ADMISSIONS;

  } catch (error) {
    // Network / HTTP error — return mock data so the API never breaks
    console.warn('[Admissions Scraper] Live page unavailable, serving mock data:', error.message);
    return MOCK_ADMISSIONS;
  }
};

module.exports = scrapeAdmissions;
