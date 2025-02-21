const Api = require("../api");

class NmReportDetail extends Api {
  constructor({ logger, url, marketplace }) {
    super({
      logger,
      url,
      marketplace,
    });
    this.logger = logger;
  }

  async getReport({ startDate, endDate, page }) {
    this.logger.debug("getReport");
    const reply = await super.get(`/v2/nm-report/detail`, {
      params: {
        period: {
          begin: startDate,
          end: endDate,
        },
        page,
      },
    });

    return reply.data;
  }

  async start({ startDate, endDate }) {
    let isNextPage;
    let page = 0;
    let result = [];
    do {
      const data = await this.getReport({ startDate, endDate, page });
      let { error, errorText } = data;
      if (error) throw new Error("Ошибка в получении данных: " + errorText);
      ({ isNextPage } = data.data);
      result.push(...data.cards);
      page += 1;
    } while (isNextPage);

    return result;
  }
}

module.exports = NmReportDetail;
