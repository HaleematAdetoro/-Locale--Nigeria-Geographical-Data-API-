const Redis = require('redis');
const logger = require('../utils/logger');
require('dotenv').config();

class Cache {
  constructor() {
    this.redis = null;
  }

  async connect() {
    try {
      this.redis = Redis.createClient({url: process.env.REDIS_URI});
      // this.redis = Redis.createClient();
      this.redis.connect();

      this.redis.on("connect", () => {
        logger.info("Connected to Redis...");
      });

      this.redis.on("error", () => {
        logger.info("Redis connection error");
      });
    } catch (err) {
      logger.info(err);
    }
  }

  async disconnect() {
    await this.redis.disconnect();
  }
}

const instance = new Cache();

module.exports = instance;