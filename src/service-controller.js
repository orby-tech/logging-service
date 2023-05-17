const fs = require("fs");
const { getJwtToken, validateJwtToken } = require("./tools/jwt");

class ServicesController {
  _services = [];
  serviciesFile = "";
  valueDir = "";
  get services() {
    return this._services;
  }
  set services(services) {
    this._services = services;
    fs.writeFileSync(this.servicesFile, JSON.stringify(services, null, 2));
  }

  constructor(servicesFile, valueDir, SECRET) {
    this.servicesFile = servicesFile;
    this.valueDir = valueDir;
    this.SECRET = SECRET;
    this.createServicesFile();
    const loadedServicies = fs.readFileSync(servicesFile);
    this.services = JSON.parse(loadedServicies);
  }

  add(username, serviceName) {
    const jwt = getJwtToken(
      {
        username,
        serviceName,
      },
      this.SECRET
    );
    this.services.push({
      username,
      serviceName,
    });

    return jwt;
  }

  getNewJWT(username, serviceName) {
    const jwt = getJwtToken({
      username,
      serviceName,
    });
    return jwt;
  }

  get(username) {
    return this.services.filter((service) => service.username === username);
  }

  validateService(serviceJWT) {
    const service = validateJwtToken(serviceJWT);
    return this.get(service.id);
  }

  createServicesFile() {
    this.createValueDir();
    this.createEmptyServicesFile();
  }

  createValueDir() {
    const valueDir = this.valueDir;
    if (!fs.existsSync(valueDir)) {
      fs.mkdirSync(valueDir);
    }
  }

  createEmptyServicesFile() {
    const servicesFile = this.servicesFile;
    if (!fs.existsSync(servicesFile)) {
      fs.writeFileSync(
        servicesFile,
        JSON.stringify([{ username: "demo", serviceName: "demo" }])
      );
    }
  }
}

module.exports = ServicesController;
