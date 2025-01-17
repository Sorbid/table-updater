const Api = require("./api");

class TrashCards extends Api {
  constructor({ logger, url }) {
    super({
      logger,
      url,
    });
    this.logger = logger;
    this.limit = 100;
  }

  async getReport({ updatedAt, nmID }) {
    this.logger.debug("getReport");
    const reply = await super.post(`/content/v2/get/cards/trash`, {
      settings: {
        cursor: {
          limit: this.limit,
          updatedAt,
          nmID,
        },
      },
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    let updatedAt = null;
    let nmID = null;
    let total;
    let result = [];
    do {
      const data = await this.getReport({ updatedAt, nmID });
      ({ updatedAt, nmID, total } = data.cursor);
      result.push(
        ...data.cards.map((item) => ({ ...item, dateReport: startDate }))
      );
    } while (total >= this.limit);

    return result;
  }
}

module.exports = TrashCards;
