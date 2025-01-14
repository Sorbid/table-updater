const Api = require("./api");
const timeout = require("../utils/timeout");

class TariffBoxes extends Api {
  constructor({ logger, config, db, url }) {
    super({
      logger,
      url,
      API_KEY: config.API_KEY,
    });
    this.logger = logger;
    this.taskId = undefined;
    this.db = db.TariffBoxes;
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

    await this.insertData(this.parseData({ data, endDate }));

    this.logger.info("Обновление paidStorage успешно завершено");
  }

  async insertData(data) {
    this.logger.debug("insertData");
    await this.db.insert(data);
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
