const Repository = require("./repository");

const cs = {};

class GoodsRepository extends Repository {
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
      table: "goods",
      schema: "wb",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "nm_id", prop: "nmId" },
        { name: "vendor_code", prop: "vendorCode" },
        { name: "sizes", prop: "sizes", cast: "jsonb", mod: ":json" },
        { name: "currency_iso_code_4217", prop: "currencyIsoCode4217" },
        { name: "discount", prop: "discount" },
        { name: "club_discount", prop: "clubDiscount" },
        {
          name: "editable_size_price",
          prop: "editableSizePrice",
          cast: "boolean",
        },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = GoodsRepository;
