const NodeCache = require('node-cache');

// Standard cache duration: 15 minutes (900 seconds)
// checkperiod: checks for expired items every 120 seconds
const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

module.exports = cache;
