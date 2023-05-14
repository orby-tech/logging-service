const { logsFile, valueDir } = require("./src/constants");

const server = require("./src/app")({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
  logsFile,
  valueDir,
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
