const fastifyCron = require("fastify-cron");
const { getCronConfig } = require("../utils/db");
const { getYesterdayDate } = require("../utils/date");

const createConfig = ({ task, sendMessage }) => {
  const {
    name,
    schedule,
    repository,
    cronJobId,
    marketplace,
    url,
    startDate,
    endDate,
  } = task;
  return {
    name,
    cronTime: schedule,
    onTick: () => {
      sendMessage("api-queue", {
        repository,
        cronJobId,
        marketplace,
        url,
        params: {
          startDate: startDate || getYesterdayDate(),
          endDate: endDate || getYesterdayDate(),
        },
      });
    },
  };
};

module.exports = async function (fastify, opts) {
  await fastify.register(fastifyCron);
  const { sendMessage } = fastify.rabbitmq;
  const cronConfig = await getCronConfig(fastify.config, fastify.log);

  // Регистрируем задачи из конфигурации
  cronConfig.forEach((task) => {
    if (task.isEnabled) {
      const config = createConfig({ task, sendMessage });
      fastify.cron.createJob(config);
      fastify.cron.getJobByName(task.name).start();
    }
  });

  console.log("Cron задачи зарегистрированы");
};
