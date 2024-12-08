const Repository = require("./repository");

const cs = {};

class ReturnClaimsRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.debug("insert returnClaims");
    await super.insert({ data, cs });
  }

  addInsertQuery({ data }) {
    this.queries.push(super.createInsertQuery({ data, cs }));
  }

  addUpdateQuery({ data }) {
    this.queries.push(super.createUpdateQuery({ data, cs }));
  }

  async runQueries() {
    await Promise.all(this.queries.map((sql) => super.runRawQuery({ sql })));
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "return_claims",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "id" },
        { name: "claim_type" },
        { name: "status" },
        { name: "status_ex" },
        { name: "nm_id" },
        { name: "user_comment" },
        { name: "wb_comment" },
        { name: "dt" },
        { name: "imt_name" },
        { name: "order_dt", cast: "timestamp" },
        { name: "dt_update", cast: "timestamp" },
        { name: "photos", mod: ":json" },
        { name: "video_paths", mod: ":json" },
        { name: "actions", mod: ":json" },
        { name: "price" },
        { name: "currency_code" },
      ],
      { table }
    );
    cs.update = new pgp.helpers.ColumnSet(
      [
        { name: "id", cnd: true },
        { name: "claim_type" },
        { name: "status" },
        { name: "status_ex" },
        { name: "nm_id" },
        { name: "user_comment" },
        { name: "wb_comment" },
        { name: "dt" },
        { name: "imt_name" },
        { name: "order_dt", cast: "timestamp" },
        { name: "dt_update", cast: "timestamp" },
        { name: "photos", mod: ":json" },
        { name: "video_paths", mod: ":json" },
        { name: "actions", mod: ":json" },
        { name: "price" },
        { name: "currency_code" },
        {
          name: "updated_at",
          cast: "timestamp",
          mod: ":raw",
          init: () => "NOW()",
        },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = ReturnClaimsRepository;
