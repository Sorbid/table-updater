const Api = require("../api");

class Orders extends Api {
  constructor({ logger, config, db, url }) {
    super({
      logger,
      url,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.db = db.Orders;
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
    const data = await this.getReport({ startDate });
    return this.db.insert(data);
  }
}

module.exports = Orders;
