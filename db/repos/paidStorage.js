const cs = {};

class PaidStorageRepository {
  constructor(logger, db, pgp) {
    this.logger = logger;
    this.db = db;
    this.pgp = pgp;
    createColumnsets(pgp);
  }

  async insert(data) {
    this.logger.info("insert");
    // const insert = this.pgp.helpers.insert(data, cs);
    // await this.db.none(insert);
  }

  async create() {}
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "products",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(["name"], { table });
  }
  return cs;
}

module.exports = PaidStorageRepository;
