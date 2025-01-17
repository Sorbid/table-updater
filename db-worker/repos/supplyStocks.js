const Repository = require("./repository");

const cs = {};

class SupplyStockRepository extends Repository {
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
        { name: "last_change_date", prop: "lastChangeDate", cast: "timestamp" },
        { name: "warehouse_name", prop: "warehouseName" },
        { name: "supplier_article", prop: "supplierArticle" },
        { name: "nm_id", prop: "nmId" },
        { name: "barcode", prop: "barcode" },
        { name: "quantity", prop: "quantity" },
        { name: "in_way_to_client", prop: "inWayToClient" },
        { name: "in_way_from_client", prop: "inWayFromClient" },
        { name: "quantity_full", prop: "quantityFull" },
        { name: "category", prop: "category" },
        { name: "subject", prop: "subject" },
        { name: "brand", prop: "brand" },
        { name: "tech_size", prop: "techSize" },
        { name: "price", prop: "Price" },
        { name: "discount", prop: "Discount" },
        { name: "is_supply", prop: "isSupply", cast: "boolean" },
        { name: "is_realization", prop: "isRealization", cast: "boolean" },
        { name: "sc_code", prop: "SCCode" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = SupplyStockRepository;
