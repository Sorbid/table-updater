const Api = require("./api");

class WarehouseCoefficients extends Api {
  constructor({ logger, url }) {
    super({
      logger,
      url,
    });
    this.logger = logger;
  }

  async getReport() {
    this.logger.debug("getReport");
    const reply = await super.get(`/v1/acceptance/coefficients`, {});

    return reply.data;
  }

  async start({ startDate, endDate }) {
    return await this.getReport();
  }
}

module.exports = WarehouseCoefficients;
