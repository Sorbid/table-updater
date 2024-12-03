const Api = require("../api");

class ContentCards extends Api {
  constructor({ logger, config, db, url }) {
    super({
      logger,
      url,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.db = db.ContentCards;
    this.limit = 100;
  }

  async getReport({ updatedAt, nmID }) {
    this.logger.debug("getReport");
    const reply = await super.post(`/content/v2/get/cards/list`, {
      settings: {
        cursor: {
          limit: this.limit,
          updatedAt,
          nmID,
        },
        filter: {
          withPhoto: -1,
        },
      },
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    let updatedAt = null;
    let nmID = null;
    let total;
    do {
      const data = await this.getReport({ updatedAt, nmID });
      ({ updatedAt, nmID, total } = data.cursor);
      this.db.addQuery({
        data: data.cards.map((item) => ({ ...item, dateReport: startDate })),
      });
    } while (total >= this.limit);
    await this.db.runQueries();
  }
}

module.exports = ContentCards;
