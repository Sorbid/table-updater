const pgPromise = require("pg-promise");
const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASS,
} = require("../config");
const repos = require("./repos");
const logger = require("../utils/logger");

const initOptions = {
  extend(obj) {
    Object.keys(repos).map(
      (repo) => (obj[repo] = new repos[repo](logger, obj, pgp))
    );
  },
};

const pgp = pgPromise(initOptions);

const db = pgp({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASS,
});

module.exports = { db, pgp };
