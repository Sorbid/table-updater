const pgp = require("pg-promise")();

async function getCronConfig({ DB_HOST, DB_PORT, DB_BASE, DB_USER, DB_PASS }) {
  const db = pgp({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_BASE,
    user: DB_USER,
    password: DB_PASS,
  });

  try {
    return await db.any("select * from rawdata.jobs");
  } catch (err) {
    logger.error("Ошибка на стороне драйвера pg: " + err);
  } finally {
    pgp.end();
  }
}

module.exports = { getCronConfig };
