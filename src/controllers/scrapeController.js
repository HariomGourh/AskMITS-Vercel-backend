const cache = require('../config/cache');

/**
 * Higher-order function to handle scraping, caching, and error handling.
 * @param {Function} scraperFunction - The specific scraping logic function
 */
const scrapeController = (scraperFunction) => async (req, res) => {
  const cacheKey = req.originalUrl;
  
  // 1. Check Cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`[Cache Hit] Serving ${cacheKey} from cache.`);
    return res.status(200).json({
      status: 'success',
      count: cachedData.length,
      data: cachedData
    });
  }

  // 2. Scrape Data
  console.log(`[Cache Miss] Scraping fresh data for ${cacheKey}...`);
  try {
    const freshData = await scraperFunction();
    
    if (!freshData || freshData.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No data retrieved from target website.'
      });
    }

    // 3. Set Cache
    cache.set(cacheKey, freshData);
    
    return res.status(200).json({
      status: 'success',
      count: freshData.length,
      data: freshData
    });

  } catch (error) {
    console.error(`[Scrape Error] Failed to scrape ${cacheKey}:`, error.message);
    
    // Fallback logic could be implemented here if persistent storage is used.
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve data from target website.',
      error: error.message
    });
  }
};

module.exports = scrapeController;
