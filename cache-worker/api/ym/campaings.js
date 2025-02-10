const Api = require("../api");

class Campaigns extends Api {
  constructor({ logger, url, marketplace }) {
    super({
      logger,
      url: url || "https://api.partner.market.yandex.ru/",
      marketplace,
    });
    this.logger = logger;
  }

  async getReport() {
    this.logger.debug("getReport");
    const reply = await super.get(`/campaigns`);

    return reply.data;
  }

  async start() {
    const data = await this.getReport();

    return data.campaigns;
  }
}

module.exports = Campaigns;
