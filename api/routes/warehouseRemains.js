const Api = require("../api");
const timeout = require("../../utils/timeout");

class WarehouseRemains extends Api {
  constructor({ logger, config, db, url }) {
    super({
      logger,
      url,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.db = db.WarehouseRemains;
  }

  async createReport(dateFrom, dateTo) {
    this.logger.debug("createReport");
    const reply = await super.get("/v1/warehouse_remains", {
      params: {
        dateFrom: dateFrom,
        dateTo: dateTo,
        groupByNm: true,
        groupBySize: true,
      },
    });
    this.taskId = reply.data.data.taskId;
  }

  async checkReport() {
    this.logger.debug("checkReport");
    const reply = await super.get(
      `/v1/warehouse_remains/tasks/${this.taskId}/status`
    );
    return reply.data.data.status === "done";
  }

  async getReport() {
    this.logger.debug("getReport");
    const reply = await super.get(
      `/v1/warehouse_remains/tasks/${this.taskId}/download`
    );

    return reply.data;
  }

  async start({ startDate, endDate }) {
    this.logger.info("Начало обновления warehouseRemains");

    await this.createReport(startDate, endDate);

    while (!(await this.checkReport())) {
      await timeout(5 * 1000);
    }
    const data = await this.getReport();

    await this.insertData(data);

    this.logger.info("Обновление warehouseRemains успешно завершено");
  }

  async insertData(data) {
    this.logger.debug("insertData");
    await this.db.insert(data);
  }
}

module.exports = WarehouseRemains;