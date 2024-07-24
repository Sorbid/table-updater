const axiosRetry = require("axios-retry").default;
const axios = require("axios");

class Api {
  constructor(logger, { API_BASE_URL, API_KEY }) {
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
      retryDelay: axiosRetry.exponentialDelay,
    });
  }

  async get(route, opts = {}) {
    try {
      return await this.api.get(route, opts);
    } catch (error) {
      throw error;
    }
  }

  async post() {}
}

module.exports = Api;
