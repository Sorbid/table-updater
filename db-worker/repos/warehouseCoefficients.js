const Repository = require("./repository");

const cs = {};

class WarehouseCoefficientRepository extends Repository {
  constructor({ logger, db, pgp }) {
    super({ logger, db, pgp });
    this.logger = logger;
    createColumnsets(pgp);
    this.queries = [];
  }

  async insert(data) {
    this.logger.info("insert WarehouseCoefficient");
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
      table: "warehouse_coefficients",
      schema: "wb",
    });

    cs.insert = new pgp.helpers.ColumnSet(
      [
        { name: "date", prop: "date" },
        { name: "coefficient", prop: "coefficient" },
        { name: "warehouse_id", prop: "warehouseId" },
        { name: "warehouse_name", prop: "warehouseName" },
        { name: "allow_unload", cast: "boolean", prop: "allowUnload" },
        { name: "box_type_name", prop: "boxTypeName" },
        { name: "box_type_id", prop: "boxTypeId" },
        { name: "storage_coef", prop: "storageCoef" },
        { name: "delivery_coef", prop: "deliveryCoef" },
        { name: "delivery_base_liter", prop: "deliveryBaseLiter" },
        { name: "delivery_additional_liter", prop: "deliveryAdditionalLiter" },
        { name: "storage_base_liter", prop: "storageBaseLiter" },
        { name: "storage_additional_liter", prop: "storageAdditionalLiter" },
        { name: "is_sorting_center", cast: "boolean", prop: "isSortingCenter" },
      ],
      { table }
    );
  }
  return cs;
}

module.exports = WarehouseCoefficientRepository;
