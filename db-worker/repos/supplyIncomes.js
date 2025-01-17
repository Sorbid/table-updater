const Repository = require("./repository");

const cs = {};

class SupplyIncomesRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.info("insert Goods");
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
      table: "supply_incomes",
      schema: "wb",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "income_id", prop: "incomeId" },
        { name: "number", prop: "number" },
        { name: "date", prop: "date", cast: "date" },
        { name: "last_change_date", prop: "lastChangeDate" },
        { name: "supplier_article", prop: "supplierArticle" },
        { name: "tech_size", prop: "techSize" },
        { name: "barcode", prop: "barcode" },
        { name: "quantity", prop: "quantity" },
        { name: "total_price", prop: "totalPrice" },
        { name: "date_close", prop: "dateClose", cast: "date" },
        { name: "warehouse_name", prop: "warehouseName" },
        { name: "nm_id", prop: "nmId" },
        { name: "status", prop: "status" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = SupplyIncomesRepository;
