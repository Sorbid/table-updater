const pgPromise = require("pg-promise");
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER } = require("../config");
const { Users, Products } = require("./repos");

const initOptions = {
  extend(obj) {
    obj.users = new Users(obj, pgp);
    obj.products = new Products(obj, pgp);
  },
};

const pgp = pgPromise(initOptions);

const db = pgp({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  user: DB_USER,
});

module.exports = { db, pgp };
