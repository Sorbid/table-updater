const axiosRetry = require("axios-retry").default;
const axios = require("axios");

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
      retries: 3,
      retryCondition: (error) => {
        console.log(error);
      }, // Retry all errors
      retryDelay: () => {
        return 61 * 1000;
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
      return await this.api.get(route, opts);
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
