const Api = require("../api");

class AdStats extends Api {
  constructor({ logger, config, db, url }) {
    super({ logger, url, API_KEY: config.API_KEY });
    this.logger = logger;
    this.adType = {
      4: "кампания в каталоге",
      5: "кампания в карточке товара",
      6: "кампания в поиске",
      7: "кампания в рекомендациях на главной странице",
      8: "автоматическая кампания",
      9: "поиск + каталог",
    };
    this.db = db.AdStats;
  }

  async getAllAdverts() {
    const reply = await super.get("/adv/v1/promotion/count");

    return reply.data.adverts;
  }

  async getStats(ad, begin, end) {
    try {
      const reply = await super.post("/adv/v2/fullstats", [
        {
          id: ad.id,
          interval: {
            begin,
            end,
          },
        },
      ]);

      if (reply.data.length > 0) {
        const data = reply.data[0];
        return { ...data, type: ad.type };
      }
      return undefined;
    } catch (err) {
      return undefined;
    }
  }

  async getReport() {
    this.logger.debug("getReport");
    const reply = await super.get(
      `/v1/paid_storage/tasks/${this.taskId}/download`
    );

    return reply.data;
  }

  async start({ startDate, endDate }) {
    const ads = await this.getAllAdverts();

    const parsedAds = this.parseAdverts(ads);

    let result = [];

    for (let item of parsedAds) {
      result.push(await this.getStats(item, startDate, endDate));
    }

    await this.db.insert(this.parseResult(result));
  }

  parseResult(res) {
    let result = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i] != undefined)
        for (let j = 0; j < res[i].days.length; j++) {
          for (let y = 0; y < res[i].days[j].apps.length; y++) {
            for (let z = 0; z < res[i].days[j].apps[y].nm.length; z++) {
              result.push({
                ad_id: res[i].advertId,
                date_stat: res[i].days[j].date,
                views: res[i].days[j].apps[y].nm[z].views,
                clicks: res[i].days[j].apps[y].nm[z].clicks,
                ctr: res[i].days[j].apps[y].nm[z].ctr,
                cpc: res[i].days[j].apps[y].nm[z].cpc,
                sum: res[i].days[j].apps[y].nm[z].sum,
                atbs: res[i].days[j].apps[y].nm[z].atbs,
                orders: res[i].days[j].apps[y].nm[z].orders,
                cr: res[i].days[j].apps[y].nm[z].cr,
                shks: res[i].days[j].apps[y].nm[z].shks,
                sum_price: res[i].days[j].apps[y].nm[z].sum_price,
                title: res[i].days[j].apps[y].nm[z].name,
                nmid: res[i].days[j].apps[y].nm[z].nmId,
                type: this.adType[res[i].type],
              });
            }
          }
        }
    }
    return result;
  }

  parseAdverts(ads) {
    let arr = [];
    const parsed = ads.filter((item) => item.status == 9);

    for (let i = 0; i < parsed.length; i++) {
      parsed[i].advert_list.map((item) =>
        arr.push({ id: item.advertId, type: parsed[i].type })
      );
    }

    return arr;
  }
}

module.exports = AdStats;
