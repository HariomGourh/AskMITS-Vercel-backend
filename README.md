# AskMITS Scraper API Backend

This is a production-ready Node.js/Express backend that actively scrapes `https://web.mitsgwalior.in/` to provide clean REST APIs for the AskMITS Chatbot.

## 🛠 Tech Stack
- **Node.js + Express**: Scalable web server
- **Axios**: High-performance HTTP client
- **Cheerio**: Fast DOM parsing (static HTML scraping)
- **Node-cache**: In-memory caching layer to prevent target site overloading
- *(Optional)* **Puppeteer**: Available via npm if dynamic javascript rendering becomes required later.

---

## 📂 Architecture & Modularity
The codebase is structured to isolate scraper functions, reducing failure risks and encouraging code re-use:
```
backend-node/
│-- package.json       (Dependencies & scripts)
│-- server.js          (Main Express entry point)
│-- src/
    │-- config/
    │   └── cache.js   (Node-cache setup: 15min TTL)
    │-- controllers/
    │   └── scrapeController.js (Higher-order caching & execution wrapper)
    │-- routes/
    │   └── api.js     (Endpoints mapping to controllers)
    │-- scrapers/
        ├── admissionsScraper.js
        ├── eventsScraper.js
        └── noticesScraper.js
```

---

## 🚀 Setup & Run Instructions

### 1. Install Dependencies
Open a terminal in this `backend-node` folder and run:
`npm install`

### 2. Start the Server
For development (with automatic restarts on file change):
`npm run dev`

For production:
`npm start`

### 3. Verify Server
Check if the server is running successfully:
- **Test Endpoint**: `GET http://localhost:3000/api/test`
- **Response**: `{ "message": "Server is working" }`

---

## 📡 API Endpoints

All APIs utilize the `scrapeController` which automatically injects a **15-minute caching layer**. If the scrape is successful, the data is served and cached. If scraping falls back or fails, it will attempt to serve the stale cache.

- **`GET /api/notices`** - Returns the latest 10 academic notices.
- **`GET /api/events`** - Returns the latest campus events & news.
- **`GET /api/admissions`** - Returns critical structural admissions data.

**Standard Response Format**:
```json
{
  "status": "success",
  "source": "live",  // or "cache"
  "data": [
    {
      "title": "Registration begins in June.",
      "link": "https://web.mitsgwalior.in/..."
    }
  ]
}
```
