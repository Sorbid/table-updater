const Api = require("../api");

class PaidStorage extends Api {
  constructor(logger, config) {
    super(logger, config);
    this.logger = logger;
    this.taskId = undefined;
  }

  async createReport(dateFrom, dateTo) {
    const reply = await super.get("/v1/paid_storage", {
      dateFrom,
      dateTo,
    });
    this.taskId = reply.data.taskId;
  }

  async checkReport() {
    const reply = await super.get(
      `/v1/paid_storage/tasks/${this.taskId}/status`
    );
    return reply.data.status === "done";
  }

  async getReport() {
    const reply = await super.get(
      `/v1/paid_storage/tasks/${this.taskId}/download`
    );

    return reply.data;
  }
}

module.exports = PaidStorage;
