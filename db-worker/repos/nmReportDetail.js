const Repository = require("./repository");

const cs = {};

class NmReportDetailRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.info("insert NmReportDetail");
    await super.insert({ data, cs });
  }

  addQuery({ data }) {
    this.queries.push(super.createInsertQuery({ data, cs }));
  }

  async runQueries() {
    await Promise.all(this.queries.map((sql) => super.runRawQuery({ sql })));
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "nm_report_detail",
      schema: "wb",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "nm_id", prop: "nmID" },
        { name: "vendor_code", prop: "vendorCode" },
        { name: "brand_name", prop: "brandName" },
        { name: "tags", prop: "tags", cast: "jsonb", mod: ":json" },
        { name: "object", prop: "object", cast: "jsonb", mod: ":json" },
        { name: "statistics", prop: "statistics", cast: "jsonb", mod: ":json" },
        { name: "stocks", prop: "stocks", cast: "jsonb", mod: ":json" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = NmReportDetailRepository;
