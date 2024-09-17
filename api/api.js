const axios = require("axios");
const axiosRetry = require("axios-retry").default;

class Api {
  constructor({ logger, API_BASE_URL, API_KEY }) {
    this.logger = logger;
    const opts = {
      baseURL: API_BASE_URL,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: API_KEY,
      },
      timeout: 1000 * 60 * 1,
      responseType: "json",
      responseEncoding: "utf8",
    };
    this.api = axios.create(opts);
    axiosRetry(this.api, {
      retries: 0,
      // retryCondition: (error) => true,
      retryDelay: (retryCount) => {
        return retryCount * 10000;
      },
      onRetry: (retryCount, err, conf) => {
        logger.info(`retry req: ${conf.url}, count: ${retryCount}`);
      },
    });
  }

  async get(route, opts = {}) {
    try {
      this.logger.debug(
        `Выполнение get запроса: ${JSON.stringify(route)}, ${JSON.stringify(
          opts
        )}`
      );
      return await this.api.get(route, {
        ...opts,
        "axios-retry": { retries: 3 },
      });
    } catch (error) {
      this.logger.error("Произошла ошибка при обращении в API (get): " + error);
      throw error;
    }
  }

  async post(route, body, opts) {
    try {
      this.logger.debug(
        `Выполнение post запроса: ${JSON.stringify(route)}, ${JSON.stringify(
          body
        )}, ${JSON.stringify(opts)}`
      );
      return await this.api.post(route, body, opts);
    } catch (error) {
      this.logger.error(
        "Произошла ошибка при обращении в API (post): " + error
      );
      throw error;
    }
  }
}

module.exports = Api;
