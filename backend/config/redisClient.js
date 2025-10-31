const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL;

const client = createClient({
  url: redisUrl,
});

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  try {
    await client.connect();
    console.log('Connected to Upstash Redis');
  } catch (err) {
    console.error('Redis connect error', err);
  }
})();

module.exports = client;


// const { createClient } = require('redis');

// const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
// const client = createClient({ url: redisUrl });

// client.on('error', (err) => console.error('Redis Client Error', err));

// (async () => {
//   try {
//     await client.connect();
//     console.log('Connected to Redis');
//   } catch (err) {
//     console.error('Redis connect error', err);
//   }
// })();

// module.exports = client;
