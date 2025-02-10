const Api = require("./api");

class ProductList extends Api {
  constructor({ logger, url, marketplace }) {
    super({
      logger,
      url,
      marketplace,
    });
    this.logger = logger;
    this.limit = 100;
  }

  async getReport({ lastId }) {
    this.logger.debug("getReport");
    const reply = await super.post(`/v3/product/list`, {
      limit: this.limit,
      last_id: lastId,
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    let lastId = null;
    let items = null;
    let result = [];
    do {
      const data = await this.getReport({ lastId });
      ({ items, lastId } = data.result);
      result.push(...items.map((item) => ({ ...item, dateReport: startDate })));
    } while (items.length >= this.limit);

    return result;
  }
}

module.exports = ProductList;
