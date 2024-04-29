const V3PoolBase = require("./hf-v3-template");

module.exports = class extends V3PoolBase {
  static network = "metis";

  constructor() {
    super("metis");
  }
};
