const Api = require("./api");
const timeout = require("../utils/timeout");

class WarehouseRemains extends Api {
  constructor({ logger, url }) {
    super({
      logger,
      url,
    });
    this.logger = logger;
    this.taskId = undefined;
  }

  async createReport() {
    this.logger.debug("createReport");
    const reply = await super.get("/v1/warehouse_remains", {
      params: {
        groupByNm: true,
        groupBySize: true,
        locale: "ru",
        groupByBrand: true,
        groupBySubject: true,
        groupBySa: true,
        groupByBarcode: true,
        filterPics: 0,
        filterVolume: 0,
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

  async start() {
    this.logger.info("Начало обновления warehouseRemains");

    await this.createReport();

    while (!(await this.checkReport())) {
      await timeout(5 * 1000);
    }

    return await this.getReport();
  }
}

module.exports = WarehouseRemains;
