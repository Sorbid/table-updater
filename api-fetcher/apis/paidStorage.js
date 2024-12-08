const Api = require("./api");
const timeout = require("../../utils/timeout");

class PaidStorage extends Api {
  constructor({ logger, url }) {
    super({
      logger,
      url,
    });
    this.logger = logger;
    this.taskId = undefined;
  }

  async createReport(dateFrom, dateTo) {
    this.logger.debug("createReport");
    const reply = await super.get("/v1/paid_storage", {
      params: {
        dateFrom: dateFrom,
        dateTo: dateTo,
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

  async start({ startDate, endDate }) {
    this.logger.info("Начало обновления paidStorage");

    await this.createReport(startDate, endDate);

    while (!(await this.checkReport())) {
      await timeout(30 * 1000);
    }
    const data = await this.getReport();

    return this.parseData(data);
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
