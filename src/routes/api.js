const express = require('express');
const router = express.Router();

// Scrapers
const noticesScraper = require('../scrapers/noticesScraper');
const eventsScraper = require('../scrapers/eventsScraper');
const admissionsScraper = require('../scrapers/admissionsScraper');
const scrapeController = require('../controllers/scrapeController');
const chatbotController = require('../controllers/chatbotController');

// Test Route (As requested)
router.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Production Scraper Routes
router.get('/notices', scrapeController(noticesScraper));
router.get('/events', scrapeController(eventsScraper));
router.get('/admissions', scrapeController(admissionsScraper));

// Chatbot Route
router.get('/chatbot', chatbotController);

module.exports = router;
