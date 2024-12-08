const axios = require("axios");
const axiosRetry = require("axios-retry").default;

class Api {
  constructor({ logger, url }) {
    this.logger = logger;
    const opts = {
      baseURL: url,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: process.env.API_KEY,
      },
      timeout: 1000 * 60 * 1,
      responseType: "json",
      responseEncoding: "utf8",
    };
    this.api = axios.create(opts);
    this.retryConfig = {
      retries: 3,
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkError(error) ||
          (error.response &&
            [429, 500, 502, 503, 504].includes(error.response.status))
        );
      },
      retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 10000),
      onRetry: (retryCount, err, conf) => {
        logger.warn(`error: ${err}, ${err?.response?.data?.statusText}`);
        logger.info(`retry req: ${conf.url}, count: ${retryCount}`);
      },
    };

    axiosRetry(this.api, this.retryConfig);
  }

  async get(route, opts = {}) {
    try {
      this.logger.debug(
        `Выполнение get запроса: ${JSON.stringify(route)}, ${JSON.stringify(
          opts
        )}`
      );
      return await this.api.get(route, { ...opts });
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
