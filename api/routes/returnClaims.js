const Api = require("../api");
const timeout = require("../../utils/timeout");

class ReturnClaims extends Api {
  constructor({ logger, config, db, url }) {
    super({
      logger,
      url,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.db = db.ReturnClaims;
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
    do {
      const data = await this.getReport({ is_archive: true, offset });
      total = data.total;
      offset += this.limit;
      if (data.claims.length) this.db.addUpsertQuery({ data: data.claims });
    } while (total >= offset);

    await this.db.runQueries();

    offset = 0;
    do {
      const data = await this.getReport({ is_archive: false, offset });
      total = data.total;
      offset += this.limit;
      if (data.claims.length) this.db.addUpsertQuery({ data: data.claims });
    } while (total >= offset);

    await this.db.runQueries();
  }
}

module.exports = ReturnClaims;
