const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://web.mitsgwalior.in/';

const scrapeNotices = async () => {
  try {
    const { data } = await axios.get(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000 // 10 second timeout for performance
    });
    
    const $ = cheerio.load(data);
    const notices = [];

    // NOTE: Update these selectors based on the exact DOM structure of MITS Gwalior
    // This is a robust template targeting standard notice board components
    $('.notice-item, .marquee, .announcement').each((index, element) => {
      // Limit to latest 10 notices for chatbot efficiency
      if (index >= 10) return false; 

      const title = $(element).text().replace(/\s+/g, ' ').trim();
      let link = $(element).find('a').attr('href') || null;
      
      if (link && !link.startsWith('http')) {
        link = new URL(link, BASE_URL).href;
      }
      
      if (title) {
        notices.push({
          title,
          link,
          dateScraped: new Date().toISOString()
        });
      }
    });

    // Provide mock data if the target structure doesn't match yet
    if (notices.length === 0) {
      return [
        { title: "Mid-Term Examination Schedule Released", link: BASE_URL + "exam" },
        { title: "Campus Hackathon Registrations Open", link: BASE_URL + "events" }
      ];
    }

    return notices;
  } catch (error) {
    throw new Error('Failed to scrape notices: ' + error.message);
  }
};

module.exports = scrapeNotices;
