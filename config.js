const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER } = process.env;

const config = {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
};

module.exports = config;
