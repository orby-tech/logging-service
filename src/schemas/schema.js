const { LOG_TYPES } = require("../constants");

const schema = {
  dateOnServiceSide: function (value) {
    return !!value && !isNaN(value) && parseInt(value) == value && value > 0;
  },
  serviceName: function (value) {
    return !!value && typeof value === "string";
  },
  moduleName: function (value) {
    return !!value && typeof value === "string";
  },
  messageType: function (value) {
    return !!value && typeof value === "string" && LOG_TYPES.includes(value);
  },
  message: function (value) {
    return !!value && typeof value === "string";
  },
};

module.exports = schema;
