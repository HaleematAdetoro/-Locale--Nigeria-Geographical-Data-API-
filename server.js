require("dotenv").config();
const app = require("./app");
const logger = require("./utils/logger");
const { connectToMongoDB } = require("./config/dbConfig");
const Cache = require("./config/redisConfig");

// CONFIGURE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  logger.info("UNCAUGHT EXCEPTION! 🔥 Shutting Down...");
  logger.info(err.name, err.message);
  process.exit(1);
});

connectToMongoDB();

Cache.connect();

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  logger.info(`Server is running at PORT ${PORT}`);
});

// CONFIGURE UNCAUGHT REJECTIONS
process.on("unhandledRejection", (err) => {
  logger.info("UNHANDLED REJECTION! 🔥 Shutting Down...");
  logger.info(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});