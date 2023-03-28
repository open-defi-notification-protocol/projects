const dForceBase = require("./low-liquidity-base");

module.exports = class extends dForceBase {
  static network = "ethereum";

  constructor() {
    super("ethereum");
  }
}
