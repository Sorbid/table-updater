const Repository = require("../repository");

const cs = {};

class FinReportRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.debug("insert finReport");
    await super.insert({ data, cs });
  }

  addQuery({ data }) {
    this.queries.push(super.createInsertQuery({ data, cs }));
  }

  async runQueries() {
    await Promise.all(this.queries.map((sql) => super.rawInsert({ sql })));
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "fin_report",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "realizationreport_id" },
        { name: "date_from", cast: "date" },
        { name: "date_to", cast: "date" },
        { name: "create_dt", cast: "date" },
        { name: "currency_name" },
        { name: "gi_id" },
        { name: "subject_name" },
        { name: "nm_id" },
        { name: "brand_name" },
        { name: "sa_name" },
        { name: "ts_name" },
        { name: "barcode" },
        { name: "doc_type_name" },
        { name: "quantity" },
        { name: "retail_price" },
        { name: "retail_amount" },
        { name: "sale_percent" },
        { name: "commission_percent" },
        { name: "office_name" },
        { name: "supplier_oper_name" },
        { name: "order_dt" },
        { name: "sale_dt" },
        { name: "rr_dt", cast: "date" },
        { name: "shk_id" },
        { name: "retail_price_withdisc_rub" },
        { name: "delivery_amount" },
        { name: "return_amount" },
        { name: "delivery_rub" },
        { name: "gi_box_type_name" },
        { name: "product_discount_for_report" },
        { name: "supplier_promo" },
        { name: "rid" },
        { name: "ppvz_spp_prc" },
        { name: "ppvz_kvw_prc_base" },
        { name: "ppvz_kvw_prc" },
        { name: "sup_rating_prc_up" },
        { name: "is_kgvp_v2" },
        { name: "ppvz_sales_commission" },
        { name: "ppvz_for_pay" },
        { name: "ppvz_reward" },
        { name: "acquiring_fee" },
        { name: "acquiring_percent" },
        { name: "acquiring_bank" },
        { name: "ppvz_vw" },
        { name: "ppvz_vw_nds" },
        { name: "ppvz_office_id" },
        { name: "ppvz_office_name" },
        { name: "ppvz_supplier_id" },
        { name: "ppvz_supplier_name" },
        { name: "ppvz_inn" },
        { name: "declaration_number" },
        { name: "bonus_type_name", def: null },
        { name: "sticker_id" },
        { name: "site_country" },
        { name: "penalty" },
        { name: "additional_payment" },
        { name: "rebill_logistic_cost" },
        { name: "rebill_logistic_org", def: null },
        { name: "kiz", def: null },
        { name: "storage_fee" },
        { name: "deduction" },
        { name: "acceptance" },
        { name: "srid" },
        { name: "report_type" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = FinReportRepository;
