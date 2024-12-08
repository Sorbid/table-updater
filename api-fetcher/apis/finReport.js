const Api = require("./api");
const timeout = require("../../utils/timeout");

class FinReport extends Api {
  constructor({ logger, url }) {
    super({
      logger,
      url,
    });
    this.logger = logger;
    this.taskId = undefined;
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
    let result = [];
    while (stop === false) {
      const data = await this.getReport({ startDate, endDate, rrdid });
      if (data.length === 0) stop = true;
      else {
        result.push(data);
        rrdid = data.at(-1).rrd_id;
      }
    }

    return result;
  }
}

module.exports = FinReport;
