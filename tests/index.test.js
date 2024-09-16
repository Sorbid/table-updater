const index = require("../index"); // Adjust the path according to your project structure
const db = {
  api1: { insert: jest.fn() },
  api2: { insert: jest.fn() },
};
const apis = {
  api1: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue({ data: "api1Data" }),
  })),
  api2: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue({ data: "api2Data" }),
  })),
};
const config = { someConfigKey: "someConfigValue" };
const logger = console; // Assuming the mock is already provided by Jest or imported correctly

jest.mock("../db", () => ({ db }));
jest.mock("../api", () => apis);
jest.mock("../config", () => config);
jest.mock("../utils/logger", () => logger);

describe("index", () => {
  it("should start and insert data from all APIs successfully", async () => {
    await index.start();

    expect(apis.api1.mock.results[0].value.start).toHaveBeenCalled();
    expect(db.api1.insert).toHaveBeenCalledWith({ data: "api1Data" });
    expect(apis.api2.mock.results[0].value.start).toHaveBeenCalled();
    expect(db.api2.insert).toHaveBeenCalledWith({ data: "api2Data" });
  });

  it("should handle errors if any API fails to start", async () => {
    apis.api1.mockImplementationOnce(() => ({
      start: jest.fn().mockRejectedValue(new Error("API1 Failed")),
    }));

    await expect(index.start()).rejects.toThrow("API1 Failed");
  });
});
