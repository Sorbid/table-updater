const Repository = require("../repository");

const cs = {};

class TariffBoxesRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
  }

  async insert(data) {
    this.logger.debug("insert tariffBoxes");
    await super.insert({ data, cs });
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "tariff_boxes",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        {
          name: "dt_next_box",
          prop: "dtNextBox",
          cast: "date",
          def: undefined,
        },
        {
          name: "dt_till_max",
          prop: "dtTillMax",
          cast: "date",
          def: undefined,
        },
        {
          name: "date_report",
          prop: "dateReport",
          cast: "date",
          def: undefined,
        },
        {
          name: "box_delivery_and_storage_expr",
          prop: "boxDeliveryAndStorageExpr",
        },
        {
          name: "box_delivery_base",
          prop: "boxDeliveryBase",
        },
        {
          name: "box_delivery_liter",
          prop: "boxDeliveryLiter",
        },
        {
          name: "box_storage_base",
          prop: "boxStorageBase",
        },
        {
          name: "box_storage_liter",
          prop: "boxStorageLiter",
        },
        {
          name: "warehouse_name",
          prop: "warehouseName",
        },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = TariffBoxesRepository;
