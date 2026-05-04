const redis = require("redis");
const redisClient = redis.createClient({
    username: 'default',
    password: 'jBbdWcKxTDkmm6VlLkAkTftYne42dByE',
    socket: {
        host: 'redis-18991.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 18991
    }
});

const connectRedis = async () => {
    await redisClient.connect();
}



module.exports = {redisClient , connectRedis};