const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  API_KEY,
  API_BASE_URL = "https://seller-analytics-api.wildberries.ru",
} = process.env;

const config = {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  API_KEY,
  API_BASE_URL,
};

module.exports = config;
