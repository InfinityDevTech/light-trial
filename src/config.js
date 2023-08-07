const path = require("path");

config = {
  token: "MTEzNzkyODEzODI2NjAwMTQwOQ.Gk3-QX.VaryBi88pp4xApSHY5es-n4-uaH3I2Dw77aYbU",
  dbString: "mongodb+srv://light:light@cluster0.hmwxtth.mongodb.net/?retryWrites=true&w=majority",
  connectOpts: {
    dbName: "orbital",
    useUnifiedTopology: false,
  },
  logger: {
    level: 'debug'
  },
};

module.exports = config;
