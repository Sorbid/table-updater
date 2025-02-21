const Api = require("../api");

class TariffBoxes extends Api {
  constructor({ logger, url, marketplace }) {
    super({
      logger,
      url,
      marketplace,
    });
    this.logger = logger;
    this.taskId = undefined;
  }

  async getReport(date) {
    this.logger.debug("getReport");
    const reply = await super.get("/v1/tariffs/box", {
      params: {
        date,
      },
    });

    return reply.data.response.data;
  }

  async start({ startDate, endDate }) {
    this.logger.info("Начало обновления tariffBoxes");

    const data = await this.getReport(endDate);

    return this.parseData({ data, endDate });
  }

  parseData({ data, endDate }) {
    const parsedData = [];

    data.warehouseList.map((item) => {
      parsedData.push({
        ...item,
        dtNextBox: data.dtNextBox ? data.dtNextBox : undefined,
        dtTillMax: data.dtTillMax,
        dateReport: endDate,
      });
      return item;
    });

    return parsedData;
  }
}

module.exports = TariffBoxes;
