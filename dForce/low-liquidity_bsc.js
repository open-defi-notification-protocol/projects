const dForceBase = require("./low-liquidity-base");

module.exports = class extends dForceBase {
  static network = "bsc";

  constructor() {
    super("bsc");
  }
}
