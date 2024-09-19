const Api = require("../api");
const timeout = require("../../utils/timeout");

class FinReport extends Api {
  constructor({ logger, config, db, url }) {
    super({
      logger,
      url,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.db = db.FinReport;
  }

  async getReport({ startDate, endDate, rrdid }) {
    this.logger.debug("getReport");
    const reply = await super.get(`/v5/supplier/reportDetailByPeriod`, {
      params: {
        dateFrom: startDate,
        dateTo: endDate,
        rrdid,
      },
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    let rrdid = 0;
    let stop = false;
    while (stop === false) {
      const data = await this.getReport({ startDate, endDate, rrdid });
      if (data.length === 0) stop = true;
      else {
        this.db.addQuery({ data });
        rrdid = data.at(-1).rrd_id;
      }
    }
    await this.db.runQueries();
    // return this.parseData(data);
  }
}

module.exports = FinReport;
