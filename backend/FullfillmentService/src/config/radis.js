const redis = require("redis");
const colors = require("colors");

const redisClient = redis.createClient();
redisClient
  .connect()
  .then(() => {
    console.log(`[Fullfillment Service]Connected to Redis`.bgGreen.white);
  })
  .catch((err) => {
    console.error(
      `[Fullfillment Service] Redis connection error:, ${err}`.bgRed.white
    );
  });

module.exports = redisClient;
