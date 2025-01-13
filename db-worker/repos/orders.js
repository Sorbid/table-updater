const Repository = require("../repository");

const cs = {};

class OrdersRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
  }

  async insert(data) {
    this.logger.debug("insert orders");
    await super.insert({ data, cs });
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "raw_orders",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "date", prop: "date", cast: "date" },
        {
          name: "last_change_date",
          prop: "lastChangeDate",
          cast: "date",
          def: undefined,
        },
        { name: "warehouse_name", prop: "warehouseName" },
        { name: "country_name", prop: "countryName" },
        { name: "oblast_okrug_name", prop: "oblastOkrugName" },
        { name: "region_name", prop: "regionName" },
        { name: "supplier_article", prop: "supplierArticle" },
        { name: "nm_id", prop: "nmId" },
        { name: "barcode", prop: "barcode" },
        { name: "category", prop: "category" },
        { name: "subject", prop: "subject" },
        { name: "brand", prop: "brand" },
        { name: "tech_size", prop: "techSize" },
        { name: "income_id", prop: "incomeID" },
        { name: "is_supply", prop: "isSupply" },
        { name: "is_realization", prop: "isRealization" },
        { name: "total_price", prop: "totalPrice" },
        { name: "discount_percent", prop: "discountPercent" },
        { name: "spp", prop: "spp" },
        { name: "finished_price", prop: "finishedPrice" },
        { name: "price_with_disc", prop: "priceWithDisc" },
        { name: "is_cancel", prop: "isCancel" },
        { name: "cancel_date", prop: "cancelDate", cast: "date" },
        { name: "order_type", prop: "orderType" },
        { name: "sticker", prop: "sticker" },
        { name: "g_number", prop: "gNumber" },
        { name: "srid", prop: "srid" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = OrdersRepository;
