const Api = require("./api");

class Warehouses extends Api {
  constructor({ logger, url }) {
    super({
      logger,
      url,
    });
    this.logger = logger;
  }

  async getReport() {
    this.logger.debug("getReport");
    const reply = await super.get(`/v1/warehouses`);

    return reply.data;
  }

  async start({ startDate, endDate }) {
    return await this.getReport();
  }
}

module.exports = Warehouses;
