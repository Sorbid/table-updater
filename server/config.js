const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, API_KEY, DB_PASS, LOG_LEVEL } =
  process.env;

const config = {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASS,
  API_KEY,
  LOG_LEVEL: LOG_LEVEL || "debug",
};

module.exports = config;
