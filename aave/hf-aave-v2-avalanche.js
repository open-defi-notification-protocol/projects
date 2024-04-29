const V2PoolBase = require("./hf-v2-template");

module.exports = class extends V2PoolBase {
  static network = "avalanche";

  constructor() {
    super("avalanche");
  }
};
