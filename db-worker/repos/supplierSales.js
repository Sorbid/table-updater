const Repository = require("./repository");

const cs = {};

class SupplierSalesRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.info("insert SupplierSales");
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
      table: "supplier_sales",
      schema: "wb",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "date", prop: "date", cast: "timestamp" },
        { name: "last_change_date", prop: "lastChangeDate", cast: "timestamp" },
        { name: "warehouse_name", prop: "warehouseName" },
        { name: "warehouse_type", prop: "warehouseType" },
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
        { name: "income_id", prop: "incomeId" },
        { name: "is_supply", prop: "isSupply", cast: "boolean" },
        { name: "is_realization", prop: "isRealization", cast: "boolean" },
        { name: "total_price", prop: "totalPrice" },
        { name: "discount_percent", prop: "discountPercent" },
        { name: "spp", prop: "spp" },
        { name: "payment_sale_amount", prop: "paymentSaleAmount" },
        { name: "for_pay", prop: "forPay" },
        { name: "finished_price", prop: "finishedPrice" },
        { name: "price_with_disc", prop: "priceWithDisc" },
        { name: "sale_id", prop: "saleId" },
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

module.exports = SupplierSalesRepository;
