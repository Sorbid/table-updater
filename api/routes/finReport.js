const Api = require("../api");
const timeout = require("../../utils/timeout");

class FinReport extends Api {
  constructor({ logger, config, db }) {
    super({
      logger,
      API_BASE_URL: config.SELLER_ANALYTICS_URL,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.db = db.FinReport;
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

  async start(dateFrom, dateTo) {
    await this.createReport(dateFrom, dateTo);
    while (!(await this.checkReport())) {
      await timeout(30 * 1000);
    }
    const data = await this.getReport();

    return this.parseData(data);
  }

  parseData(data) {
    return data.map((item) => {
      item.tariffFixDate =
        item.tariffFixDate == "" ? undefined : item.tariffFixDate;
      item.tariffLowerDate =
        item.tariffLowerDate == "" ? undefined : item.tariffLowerDate;
      return item;
    });
  }
}

module.exports = FinReport;
