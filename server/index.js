require("dotenv").config();
const apis = require("./api");
const config = require("./config");
const logger = require("../utils/logger");
const { db } = require("./db");

const start = async () => {
  logger.info("Начало выполнения обновления");
  const setting = db.Settings;

  logger.debug("Получение настроек");
  const settingData = await setting.select();

  for (const elem of settingData) {
    await updateEntity({ elem, setting });
  }
  logger.info("Выполнение закончено");
};

const updateEntity = async ({ elem, setting }) => {
  const { repository, start_date, end_date, upd_table_id, url } = elem;
  const instance = new apis[repository]({ logger, db, config, url });
  try {
    await instance.start({
      startDate: start_date,
      endDate: end_date,
    });
    await setting.updateDate({
      data: { lastUpdDate: new Date(), upd_table_id },
      cond: ["upd_table_id"],
    });
    await setting.insertLog({
      data: {
        upd_table_id,
        isError: false,
        errorText: undefined,
        updDate: start_date,
      },
    });
  } catch (err) {
    await setting.insertLog({
      data: {
        upd_table_id,
        isError: true,
        errorText: err.message,
        updDate: start_date,
      },
    });
  }
};

start();
