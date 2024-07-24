const Api = require("../api");
const timeout = require("../../utils/timeout");

class PaidStorage extends Api {
  constructor(logger, config) {
    super(logger, config);
    this.logger = logger;
    this.taskId = undefined;
  }

  async createReport(dateFrom, dateTo) {
    this.logger.debug("createReport");
    const reply = await super.get("/v1/paid_storage", {
      dateFrom,
      dateTo,
    });
    this.taskId = reply.data.taskId;
  }

  async checkReport() {
    this.logger.debug("checkReport");
    const reply = await super.get(
      `/v1/paid_storage/tasks/${this.taskId}/status`
    );
    return reply.data.status === "done";
  }

  async getReport() {
    this.logger.debug("getReport");
    const reply = await super.get(
      `/v1/paid_storage/tasks/${this.taskId}/download`
    );

    return reply.data;
  }

  async start() {
    const currentDate = new Date();
    const yesterday = currentDate.getTime() - 24 * 60 * 60 * 1000;
    await this.createReport(yesterday, currentDate);
    while (!(await this.checkReport())) {
      await timeout(30 * 1000);
    }
    return await this.getReport();
  }
}

module.exports = PaidStorage;
