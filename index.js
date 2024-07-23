require("dotenv").config();
const { db } = require("./db");
const apis = require("./api");
const config = require("./config");
const logger = require("./utils/logger");

const start = async () => {
  Object.keys(apis).map(async (api) => {
    const instance = new apis[api](logger, config);

    const data = await instance.start();

    await db[api].insert(data);
  });
};

start();
