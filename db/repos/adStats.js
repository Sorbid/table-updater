const cs = {};

class AdStatsRepository {
  constructor(logger, db, pgp) {
    this.logger = logger;
    this.db = db;
    this.pgp = pgp;
    createColumnsets(pgp);
  }

  async insert(data) {
    this.logger.debug("insert");
    const insert = this.pgp.helpers.insert(data, cs.insert);
    await this.db.none(insert);
  }

  async create() {}
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "ad_stats",
      schema: "public",
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
