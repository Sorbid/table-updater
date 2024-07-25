require("dotenv").config();
const { db } = require("./db");
const apis = require("./api");
const config = require("./config");
const logger = require("./utils/logger");
const dates = require("./utils/dates");

const start = async () => {
  Object.keys(apis).map(async (api) => {
    const instance = new apis[api](logger, config);
    console.log(dates);
    for (const date of dates) {
      const data = await instance.start(date.start, date.end);
      await db[api].insert(data);
    }
  });
};

start();
