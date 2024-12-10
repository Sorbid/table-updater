const Repository = require("./repository");

const cs = {};

class AdStatsRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
  }

  async insert(data) {
    this.logger.debug("insert adStats");
    await super.insert({ data, cs });
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "ad_stats",
      schema: process.env.DB_SCHEMA,
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "date_stat", cast: "date" },
        { name: "ad_id" },
        { name: "views" },
        { name: "clicks" },
        { name: "ctr" },
        { name: "cpc" },
        { name: "sum" },
        { name: "atbs" },
        { name: "orders" },
        { name: "cr" },
        { name: "shks" },
        { name: "sum_price" },
        { name: "title" },
        { name: "nmid" },
        { name: "type" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = AdStatsRepository;
