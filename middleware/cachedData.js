const { redisClient } = require('../config/redisConfig');

async function checkCache(req, res, next) {
  const { category, query } = req.query;
  const cachedData = await redisClient.get(`${category}-${query}`);

  if (!cachedData) {
    return next();
  }

  const parsedCache = JSON.parse(cachedData);

  if (
    category === parsedCache?.category &&
    query === parsedCache?.query
  ) {
    return res.status(200).json({
      success: true,
      message: 'Search Result (Cache)',
      data: parsedCache.data
    });
  }

  next();
}

module.exports = checkCache;