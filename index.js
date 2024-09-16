require("dotenv").config();
const apis = require("./api");
const config = require("./config");
const logger = require("./utils/logger");
const db = require("./db");
// const dates = require("./utils/dates");

const start = async () => {
  Object.keys(apis).map(async (api) => {
    const instance = new apis[api]({ logger, config, db });
    const dates = {
      startDate: new Date(Date.UTC(2024, 8, 9)),
      endDate: new Date(Date.UTC(2024, 8, 12)),
    };
    console.log(dates);
    // for (const date of dates) {
    const data = await instance.start({
      startDate: dates.startDate,
      endDate: dates.endDate,
    });
    // await db[api].insert(data);
    // }
  });
};

start();
