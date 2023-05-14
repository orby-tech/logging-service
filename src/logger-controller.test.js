"use strict";

const { test } = require("tap");
const fs = require("fs");

const LoggerController = require("./logger-controller");

test("should init LoggerController", async (t) => {
  const loggerController = new LoggerController("./test/logs.json", "./test/");

  fs.rmSync("./test/logs.json");
  fs.rmdirSync("./test/");
  t.equal(fs.existsSync("./test"), false, "check createLogsFile");
  t.equal(fs.existsSync("./test/logs.json"), false, "check createLogsFile");
  loggerController.createLogsFile();
  t.equal(fs.existsSync("./test"), true, "check createLogsFile");
  t.equal(fs.existsSync("./test/logs.json"), true, "check createLogsFile");
});
