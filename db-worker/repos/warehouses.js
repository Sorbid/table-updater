const Repository = require("./repository");

const cs = {};

class WarehousesRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.info("insert Warehouses");
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
      table: "warehouses",
      schema: "wb",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "id", prop: "id" },
        { name: "name", prop: "name" },
        { name: "address", prop: "address" },
        { name: "work_time", prop: "workTime" },
        { name: "accepts_qr", cast: "boolean", prop: "acceptsQr" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = WarehousesRepository;
