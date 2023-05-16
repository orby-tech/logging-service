const fs = require("fs");

class LoggerController {
  _logs = [];
  logsFile = "";
  valueDir = "";
  set logs(logs) {
    this._logs = logs;
    fs.writeFileSync(this.logsFile, JSON.stringify(logs, null, 2));
  }
  get logs() {
    return this._logs;
  }

  constructor(logsFile, valueDir) {
    this.logsFile = logsFile;
    this.valueDir = valueDir;

    this.createLogsFile();
    const loadedLogs = fs.readFileSync(logsFile);
    this.logs = JSON.parse(loadedLogs);
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
      fs.writeFileSync(logsFile, "[]");
    }
  }
}

module.exports = LoggerController;
