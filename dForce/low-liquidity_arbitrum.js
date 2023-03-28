const dForceBase = require("./low-liquidity-base");

module.exports = class extends dForceBase {
  static network = "arbitrum";

  constructor() {
    super("arbitrum");
  }
}
