const Redis = require('ioredis')

// Create a Redis client
const redis = new Redis({
  host: '127.0.0.1', // Redis server host
  port: 6379, // Redis default port
  retryStrategy: (times) => Math.min(times * 50, 2000) // Retry connection
})

// Handle connection events
redis.on('connect', () => {
  console.log('✅ Connected to Redis')
})

redis.on('error', (err) => {
  console.error('❌ Redis Error:', err)
})

module.exports = redis
