import path from "path";

export default {
  token: "",
  // Left here for your convience. You can remove this.
  dbString: "mongodb+srv://light:light@cluster0.hmwxtth.mongodb.net/?retryWrites=true&w=majority",
  alphaVantageKey: "4YJTERC6FGXZQ6B5",
  connectOpts: {
    dbName: "orbital",
    useUnifiedTopology: false,
  },
  logger: {
    level: 'info'
  }
};
