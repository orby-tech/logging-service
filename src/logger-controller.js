const fs = require("fs");

const logsEvents = {
  updated: "updated",
  autovacuum: "autovacuum",
};

class LoggerController {
  _logs = [];
  logsFile = "";
  valueDir = "";
  set logs(logs) {
    this._logs = logs;
    this.logsQueue.push(logsEvents.updated);
  }
  get logs() {
    return this._logs;
  }

  logsQueue = [];

  constructor(logsFile, valueDir) {
    this.logsFile = logsFile;
    this.valueDir = valueDir;

    this.createLogsFile();
    const loadedLogs = fs.readFileSync(logsFile);
    this.logs = JSON.parse(loadedLogs);

    setInterval(() => {
      if (this.logsQueue.includes(logsEvents.autovacuum)) {
        this.logs = this.logs.slice(0, 100000);
        fs.writeFileSync(this.logsFile, JSON.stringify(this.logs, null, 2));
      } else if (this.logsQueue.includes(logsEvents.updated)) {
        fs.writeFileSync(this.logsFile, JSON.stringify(this.logs, null, 2));
      }
      this.logsQueue = [];
    }, 1000);

    setInterval(() => {
      this.logsQueue.push(logsEvents.autovacuum);
    }, 10000);
  }

  log(message, username) {
    this.logs = [
      ...this.logs,
      { dateOnServer: Date.now(), ...message, username },
    ];
  }

  createLogsFile() {
    this.createValueDir();
    this.createEmptyLogsFile();
  }

  createValueDir() {
    const valueDir = this.valueDir;
    if (!fs.existsSync(valueDir)) {
      fs.mkdirSync(valueDir);
    }
  }

  createEmptyLogsFile() {
    const logsFile = this.logsFile;
    if (!fs.existsSync(logsFile)) {
      const demo = [];

      for (let i = 0; i < 100000; i++) {
        demo.push({
          dateOnServer: Date.now() - i * 1000,
          dateOnServiceSide: Date.now() - i * 1000,
          serviceName: "demo",
          username: "demo",
          moduleName: "demo",
          messageType: "info",
          message: "test_message",
        });
      }

      fs.writeFileSync(logsFile, JSON.stringify(demo));
    }
  }
}

module.exports = LoggerController;
