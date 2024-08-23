const redis = require("redis");
const colors = require("colors");

const redisClient = redis.createClient();
redisClient
  .connect()
  .then(() => {
    console.log(`[Payment Service] Connected to Redis`.bgGreen.white);
  })
  .catch((err) => {
    console.error(
      `[Payment Service] Redis connection error:, ${err}`.bgRed.white
    );
  });

module.exports = redisClient;
