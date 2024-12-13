const pgp = require("pg-promise")();

async function insertIntoLog(
  { DB_HOST, DB_PORT, DB_BASE, DB_USER, DB_PASS },
  { cronJobId, updDate, isError, errMessage, logger }
) {
  const db = pgp({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_BASE,
    user: DB_USER,
    password: DB_PASS,
  });

  try {
    const payload = [cronJobId, isError, errMessage, updDate];
    await db.any(
      "insert into rawdata.logs (cron_job_id, is_error, error_text, upd_date) values ($1, $2, $3, $4)",
      payload
    );
  } catch (err) {
    logger.error("Ошибка на стороне драйвера pg: " + err);
  }
}

module.exports = { insertIntoLog };
