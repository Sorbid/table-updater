require("dotenv").config();
const { db } = require("./db");
const apis = require("./api");
const config = require("./config");
const logger = require("./utils/logger");
// const dates = require("./utils/dates");

const start = async () => {
  Object.keys(apis).map(async (api) => {
    const instance = new apis[api](logger, config);
    const dates = [
      {
        start: new Date("2024-07-27T00:00:00.000Z"),
        end: new Date("2024-07-29T00:00:00.000Z"),
      },
    ];
    console.log(dates);
    for (const date of dates) {
      const data = await instance.start(date.start, date.end);
      await db[api].insert(data);
    }
  });
};

start();
