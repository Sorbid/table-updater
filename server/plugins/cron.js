const fastifyCron = require("@fastify/cron");
const { getCronConfig } = require("../utils/db");
const { getYesterdayDate } = require("../utils/date");

const createConfig = ({ task, sendMessage }) => {
  return {
    name: task.name,
    cronTime: task.schedule,
    onTick: () => {
      sendMessage("api-queue", {
        repository: task.repository,
        cronJobId: task.cron_job_id,
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
  fastify.register(fastifyCron);
  const { sendMessage } = fastify.rabbitmq;
  const cronConfig = await getCronConfig(fastify.config);

  // Регистрируем задачи из конфигурации
  cronConfig.tasks.forEach((task) => {
    if (task.is_enabled) {
      const config = createConfig({ task, sendMessage });
      fastify.cron.createJob(config);
    }
  });

  console.log("Cron задачи зарегистрированы");
};
