const pgp = require("pg-promise")();
const logger = require("./logger");

async function getCronConfig({ DB_HOST, DB_PORT, DB_BASE, DB_USER, DB_PASS }) {
  const db = pgp({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_BASE,
    user: DB_USER,
    password: DB_PASS,
  });

  try {
    // return await db.any("select * from app_updater.cron_jobs");
    return [
      {
        isEnabled: true,
        name: "test",
        schedule: "* * * * *",
        repository: "ReturnClaims",
        idCronJob: 1,
        url: "https://returns-api.wildberries.ru/api/",
      },
    ];
  } catch (err) {
    logger.error("Ошибка на стороне драйвера pg: " + err);
  } finally {
    pgp.end();
  }
}

module.exports = { getCronConfig };
