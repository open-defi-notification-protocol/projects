const dForceBase = require("./low-liquidity-base");

module.exports = class extends dForceBase {

  static displayName = "Low Liquidity";
  static description = "Get notified when getting close to liquidation";
  static network = "polygon";

  constructor() {
    super("polygon");
  }
}
