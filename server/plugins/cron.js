const fastifyCron = require("fastify-cron");
const { getCronConfig } = require("../utils/db");
const { getYesterdayDate } = require("../utils/date");

const createConfig = ({ task, sendMessage }) => {
  return {
    name: task.name,
    cronTime: task.schedule,
    onTick: () => {
      sendMessage("api-queue", {
        repository: task.repository,
        cronJobId: task.idCronJob,
        params: {
          startDate: getYesterdayDate(),
          endDate: getYesterdayDate(),
          url: task.url,
        },
      });
    },
  };
};

module.exports = async function (fastify, opts) {
  // Подключаем плагин fastify-cron
  await fastify.register(fastifyCron);
  const { sendMessage } = fastify.rabbitmq;
  const cronConfig = await getCronConfig(fastify.config);

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
