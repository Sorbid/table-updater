const Api = require("../api");
const timeout = require("../../utils/timeout");

class PaidStorage extends Api {
  constructor({ logger, config, db }) {
    super({
      logger,
      API_BASE_URL: config.SELLER_ANALYTICS_URL,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.db = db.PaidStorage;
  }

  async createReport(dateFrom, dateTo) {
    this.logger.debug("createReport");
    const reply = await super.get("/v1/paid_storage", {
      params: {
        dateFrom: dateFrom.toJSON(),
        dateTo: dateTo.toJSON(),
      },
    });
    this.taskId = reply.data.data.taskId;
  }

  async checkReport() {
    this.logger.debug("checkReport");
    const reply = await super.get(
      `/v1/paid_storage/tasks/${this.taskId}/status`
    );
    return reply.data.data.status === "done";
  }

  async getReport() {
    this.logger.debug("getReport");
    const reply = await super.get(
      `/v1/paid_storage/tasks/${this.taskId}/download`
    );

    return reply.data;
  }

  async start({ stardDate, endDate }) {
    this.logger.info("Начало обновления paidStorage");

    await this.createReport(stardDate, endDate);

    while (!(await this.checkReport())) {
      await timeout(30 * 1000);
    }
    const data = await this.getReport();

    this.logger.info("Обновление paidStorage успешно завершено");

    await this.insertData(this.parseData(data));
  }

  async insertData(data) {
    this.logger.debug("insertData");
    await this.db.insert(data);
  }

  parseData(data) {
    return data.map((item) => {
      item.tariffFixDate = item.tariffFixDate || undefined;
      item.tariffLowerDate = item.tariffLowerDate || undefined;
      return item;
    });
  }
}

module.exports = PaidStorage;
