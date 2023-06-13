const TwapBase = require("./twap-base");

module.exports = class extends TwapBase {
  static displayName = "TWAP All Events";
  static description = "Get notified for all events regarding your TWAP orders (Arbitrum)";
  static network = "arbitrum";

  constructor() {
    super("arbitrum");
  }
}
