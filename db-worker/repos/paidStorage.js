const Repository = require("./repository");

const cs = {};

class PaidStorageRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
  }

  async insert(data) {
    this.logger.debug("insert paidStorage");
    await super.insert({ data, cs });
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "paid_storage",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "date", cast: "date" },
        { name: "logwarehousecoef", prop: "logWarehouseCoef" },
        { name: "officeid", prop: "officeId" },
        { name: "warehouse" },
        { name: "warehousecoef", prop: "warehouseCoef" },
        { name: "giid", prop: "giId" },
        { name: "chrtid", prop: "chrtId" },
        { name: "size" },
        { name: "barcode" },
        { name: "subject" },
        { name: "brand" },
        { name: "vendorcode", prop: "vendorCode" },
        { name: "nmid", prop: "nmId" },
        { name: "volume" },
        { name: "calctype", prop: "calcType" },
        { name: "warehouseprice", prop: "warehousePrice" },
        { name: "barcodescount", prop: "barcodesCount" },
        { name: "palletplacecode", prop: "palletPlaceCode" },
        { name: "palletcount", prop: "palletCount" },
        { name: "originaldate", cast: "date", prop: "originalDate" },
        { name: "loyaltydiscount", prop: "loyaltyDiscount" },
        { name: "tarifffixdate", cast: "date", prop: "tariffFixDate" },
        { name: "tarifflowerdate", cast: "date", prop: "tariffLowerDate" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = PaidStorageRepository;
