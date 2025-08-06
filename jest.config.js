module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  globals: {
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
};