const { logsFile, valueDir,serviciesFile } = require("./src/constants");

const server = require("./src/app")({
  logger: {
    level: "warn",
    transport: {
      target: "pino-pretty",
    },
  },
  logsFile,
  valueDir,
  serviciesFile

});

const start = async () => {
  try {
    await server.listen({ port: 2300 }, (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
