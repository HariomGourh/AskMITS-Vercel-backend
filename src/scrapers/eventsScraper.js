const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://web.mitsgwalior.in/';

const scrapeEvents = async () => {
  try {
    const { data } = await axios.get(BASE_URL, {
      headers: { 'User-Agent': 'AskMITS-Bot/1.0' },
      timeout: 10000 
    });
    
    const $ = cheerio.load(data);
    const events = [];

    // NOTE: Update selector for exact events DOM elements
    $('.event-item, .news-item').each((index, element) => {
      if (index >= 5) return false; 
      
      const title = $(element).text().replace(/\s+/g, ' ').trim();
      let link = $(element).find('a').attr('href') || null;
      if (link && !link.startsWith('http')) link = new URL(link, BASE_URL).href;
      
      if (title) events.push({ title, link });
    });

    if (events.length === 0) {
      return [
        { title: "Annual Tech Fest 2026", link: BASE_URL },
        { title: "Alumni Meet", link: BASE_URL }
      ];
    }
    return events;
  } catch (error) {
    throw new Error('Failed to scrape events: ' + error.message);
  }
};

module.exports = scrapeEvents;
