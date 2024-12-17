const { RabbitMq, Logger, FileHandler } = require("@laretto/raw-data-lib");
const apis = require("./apis");

const SHARED_FOLDER = "./tmp-files";

class MainPackage {
  constructor() {
    this.folder = SHARED_FOLDER;
    const loggerInstance = new Logger();
    this.logger = loggerInstance.init({
      name: "api-fetcher",
      level: "debug",
    });
    this.queueName = "api-queue";
    this.fileHandler = new FileHandler(this.folder);
    this.rabbit = new RabbitMq({
      connectionString: "amqp://localhost",
      logger: this.logger,
    });
  }

  async init() {
    try {
      await this.rabbit.connect();
      await this.rabbit.initChannelForQueue(this.queueName, { prefetch: 1 });
      await this.rabbit.consumeMessages(
        this.queueName,
        async (message) => await this.processMessage(message)
      );
    } catch (error) {
      console.error("Error in RabbitMQ flow:", error);
    }
  }

  async processMessage(message) {
    const payload = JSON.parse(message);
    const { repository, params, cronJobId } = payload;
    try {
      if (!repository || !apis[repository]) {
        throw new Error(`Нет реализации api для загрузки: ${repository}`);
      }

      const { startDate, endDate, url } = params;
      const instance = new apis[repository]({ logger: this.logger, url });
      const result = await instance.start({
        startDate,
        endDate,
      });

      //TODO: реализовать батч сохранение потоком

      const link = await this.fileHandler.saveResultOnDisk(result);

      await this.sendToDb({
        link,
        updDate: params.startDate,
        repository,
        cronJobId,
      });
    } catch (err) {
      await this.processError({
        updDate: params.startDate,
        cronJobId,
        isError,
        err,
      });

      const message = `Ошибка при обработке сообщения: ${err.message},
      ${JSON.stringify(params)}`;
      this.logger.error(message);
      throw new Error(message);
    }
  }

  async sendToDb(body) {
    this.rabbit.sendMessage("db-queue", JSON.stringify(body));
  }

  async processError({ updDate, cronJobId, isError, err }) {
    sendToLog({ updDate, cronJobId, isError, errMessage: err.message });
  }

  async cleanup() {
    await this.rabbit.close();
  }
}

const main = new MainPackage();

main.init();

process.on("SIGINT", async () => {
  await main.cleanup();
  process.exit(0);
});
