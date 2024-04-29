const V2PoolBase = require("./hf-v2-template");

module.exports = class extends V2PoolBase {
  static network = "polygon";

  constructor() {
    super("polygon");
  }
};
