describe("Config Module", () => {
  beforeEach(() => {
    jest.resetModules(); // This function resets the module registry before each test case
    process.env = {}; // Clear the environment variables before each test
  });

  it("should export default API_BASE_URL when environment variables are not set", () => {
    const expectedConfig = {
      DB_HOST: undefined,
      DB_PORT: undefined,
      DB_DATABASE: undefined,
      DB_USER: undefined,
      API_KEY: undefined,
      API_BASE_URL: "https://seller-analytics-api.wildberries.ru",
    };

    jest.mock("dotenv", () => ({ config: () => {} })); // Mocking dotenv to avoid loading .env file
    const config = require("../config");
    expect(config).toEqual(expectedConfig);
  });

  it("should use environment variables if they are set", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.DB_DATABASE = "mydatabase";
    process.env.DB_USER = "myuser";
    process.env.API_KEY = "myapikey";

    const expectedConfig = {
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_DATABASE: "mydatabase",
      DB_USER: "myuser",
      API_KEY: "myapikey",
      API_BASE_URL: "https://seller-analytics-api.wildberries.ru",
    };

    const config = require("../config");
    expect(config).toEqual(expectedConfig);
  });
});
