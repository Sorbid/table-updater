const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  API_KEY,
  DB_PASS,
  END_DATE,
  START_DATE,
} = process.env;

const currentDate = new Date().setUTCHours(0, 0, 0, 0);
const yesterday = new Date(currentDate - 24 * 60 * 60 * 1000);

const config = {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASS,
  API_KEY,
  LOG_LEVEL: "debug",
  SELLER_ANALYTICS_URL: "https://seller-analytics-api.wildberries.ru/api/",
  AD_URL: "https://advert-api.wildberries.ru",
  endDate: new Date(END_DATE) || currentDate,
  startDate: new Date(START_DATE) || yesterday,
};

module.exports = config;
