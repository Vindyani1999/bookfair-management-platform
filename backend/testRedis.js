// testRedis.js
const redis = require('./config/redisClient');

(async () => {
  await redis.set('testKey', 'Hello Upstash!');
  const value = await redis.get('testKey');
  console.log('Value from Redis:', value);
  process.exit(0);
})();
