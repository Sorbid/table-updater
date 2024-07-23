const axios = require("axios");

class Api {
  constructor(logger, { API_BASE_URL, API_KEY }) {
    this.logger = logger;
    const opts = {
      baseURL: API_BASE_URL,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        headers: {
          Authorization: API_KEY,
        },
      },
      timeout: 1000 * 60 * 1,
      responseType: "json",
      responseEncoding: "utf8",
    };
    this.axios = axios.create(opts);
  }

  static async get() {}

  static async post() {}
}

module.exports = Api;
