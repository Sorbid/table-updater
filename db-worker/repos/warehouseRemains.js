const Repository = require("./repository");

const cs = {};

class WarehouseRemainsRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
  }

  async insert(data) {
    this.logger.debug("insert WarehouseRemainsRepository");
    await super.insert({ data, cs });
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "warehouse_remains",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "warehouses", mod: ":json", def: undefined },
        { name: "tech_size", prop: "techSize", def: undefined },
        { name: "barcode", def: undefined },
        { name: "subject_name", prop: "subjectName", def: undefined },
        { name: "brand", def: undefined },
        { name: "vendor_code", prop: "vendorCode", def: undefined },
        { name: "nmid", prop: "nmId", def: undefined },
        { name: "volume", def: undefined },
        { name: "in_way_to_client", prop: "inWayToClient", def: undefined },
        { name: "in_way_from_client", prop: "inWayFromClient", def: undefined },
        {
          name: "quantity_warehouses_full",
          prop: "quantityWarehousesFull",
          def: undefined,
        },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = WarehouseRemainsRepository;
