const cache = require('../config/cache');
const scrapeNotices = require('../scrapers/noticesScraper');
const scrapeEvents = require('../scrapers/eventsScraper');
const scrapeAdmissions = require('../scrapers/admissionsScraper');

// ─────────────────────────────────────────────
// Category Configuration
// Each entry defines: cache key, scraper fn,
// keywords that trigger it, and the human answer.
// ─────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'notices',
    cacheKey: '/api/notices',
    scraper: scrapeNotices,
    keywords: ['notice', 'notices', 'announcement', 'announcements'],
    answer: 'Here are the latest notices from MITS Gwalior:',
  },
  {
    name: 'events',
    cacheKey: '/api/events',
    scraper: scrapeEvents,
    keywords: ['event', 'events', 'fest', 'festival', 'program', 'programme'],
    answer: 'Here are the latest events at MITS Gwalior:',
  },
  {
    name: 'admissions',
    cacheKey: '/api/admissions',
    scraper: scrapeAdmissions,
    keywords: ['admission', 'admissions', 'apply', 'application', 'form', 'enroll', 'enrolment'],
    answer: 'Here is the latest admissions information for MITS Gwalior:',
  },
];

// ─────────────────────────────────────────────
// Helper: Resolve category from query string
// ─────────────────────────────────────────────
const resolveCategory = (lowerQuery) => {
  for (const category of CATEGORIES) {
    if (category.keywords.some((kw) => lowerQuery.includes(kw))) {
      return category;
    }
  }
  return null;
};

// ─────────────────────────────────────────────
// Helper: Get data (cache-first, scrape on miss)
// ─────────────────────────────────────────────
const getData = async (category) => {
  // 1. Try cache first
  const cached = cache.get(category.cacheKey);
  if (cached) {
    console.log(`[Chatbot] Cache Hit  → ${category.name}`);
    return cached;
  }

  // 2. Cache miss — scrape and repopulate
  console.log(`[Chatbot] Cache Miss → ${category.name}. Scraping fresh data...`);
  const fresh = await category.scraper();
  if (fresh && fresh.length > 0) {
    cache.set(category.cacheKey, fresh);
  }
  return fresh;
};

// ─────────────────────────────────────────────
// Main Handler
// ─────────────────────────────────────────────
const handleChatbotQuery = async (req, res) => {
  const query = (req.query.q || '').trim();
  const lowerQuery = query.toLowerCase();

  // Guard: empty query
  if (!query) {
    return res.status(400).json({
      query: '',
      category: null,
      answer: 'Please provide a query using the "q" parameter. Example: /api/chatbot?q=latest notices',
      data: [],
    });
  }

  // Resolve which category the query belongs to
  const category = resolveCategory(lowerQuery);

  // Fallback: unrecognized query
  if (!category) {
    return res.status(200).json({
      query,
      category: null,
      answer: 'I can help with notices, events, and admissions. Please ask accordingly.',
      data: [],
    });
  }

  // Fetch data (cache-first)
  try {
    const data = await getData(category);

    if (!data || data.length === 0) {
      return res.status(200).json({
        query,
        category: category.name,
        answer: `Sorry, there is currently no ${category.name} information available.`,
        data: [],
      });
    }

    // Limit to top 5 results
    const topResults = data.slice(0, 5);

    return res.status(200).json({
      query,
      category: category.name,
      answer: category.answer,
      data: topResults,
    });

  } catch (error) {
    console.error(`[Chatbot Error] Failed to fetch ${category.name}:`, error.message);
    return res.status(500).json({
      query,
      category: category.name,
      answer: `Sorry, I encountered an error while fetching ${category.name}. Please try again later.`,
      data: [],
    });
  }
};

module.exports = handleChatbotQuery;
