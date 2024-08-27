const redisClient = require("../config/redis");

const getUserDetail = async (userId) => {
  try {
    const data = await redisClient.get(userId);

    if (!data) {
      console.log(`[getUserDetails] No data found for userId: ${userId}`.bgRed.white);
      return null; 
    }
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error(`[getUserDetail]Error fetching user details for userId ${userId}: ${error}`.bgRed.white);
      return null;
  }
};

module.exports = getUserDetail;
