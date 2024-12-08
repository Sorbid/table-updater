const Api = require("./api");

class ReturnClaims extends Api {
  constructor({ logger, url }) {
    super({
      logger,
      url,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.limit = 50;
  }

  async getReport({ is_archive, offset }) {
    this.logger.debug("getReport");
    const reply = await super.get(`/v1/claims`, {
      params: {
        limit: this.limit,
        is_archive,
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
      const data = await this.getReport({ is_archive: true, offset });
      total = data.total;
      offset += this.limit;
      result.push(data.claims);
    } while (total >= offset);

    // await this.db.runQueries();

    offset = 0;
    do {
      const data = await this.getReport({ is_archive: false, offset });
      total = data.total;
      offset += this.limit;
      result.push(data.claims);
    } while (total >= offset);

    return result;
  }
}

module.exports = ReturnClaims;
