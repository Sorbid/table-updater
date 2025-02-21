const Api = require("../api");

class SupplyStocks extends Api {
  constructor({ logger, url, marketplace }) {
    super({
      logger,
      url,
      marketplace,
    });
    this.logger = logger;
  }

  async getReport({ startDate }) {
    this.logger.debug("getReport");
    const reply = await super.get(`/v1/supplier/stocks`, {
      params: {
        dateFrom: startDate,
      },
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    return await this.getReport({ startDate });
  }
}

module.exports = SupplyStocks;
