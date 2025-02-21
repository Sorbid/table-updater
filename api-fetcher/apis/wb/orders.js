const Api = require("../api");

class Orders extends Api {
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
    const reply = await super.get(`/v1/supplier/orders`, {
      params: {
        dateFrom: startDate,
        flag: 1,
      },
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    return await this.getReport({ startDate });
  }
}

module.exports = Orders;
