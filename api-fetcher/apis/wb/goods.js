const Api = require("../api");

class Goods extends Api {
  constructor({ logger, url, marketplace }) {
    super({
      logger,
      url,
      marketplace,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.limit = 500;
  }

  async getReport({ offset }) {
    this.logger.debug("getReport");
    const reply = await super.get(`/v2/list/goods/filter`, {
      params: {
        limit: this.limit,
        offset,
      },
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    let offset = 0;
    let total = 0;
    const result = [];

    do {
      const data = await this.getReport({ offset });
      total = data.listGoods.length;
      offset += this.limit;
      result.push(...data.listGoods);
    } while (total != 0);

    return result;
  }
}

module.exports = Goods;
