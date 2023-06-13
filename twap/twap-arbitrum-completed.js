const TwapBase = require("./twap-base");

module.exports = class extends TwapBase {
  static displayName = "TWAP Order Completed";
  static description = "Get notified when your TWAP order is completely filled (Arbitrum)";
  static network = "arbitrum";

  constructor() {
    super("arbitrum", "OrderCompleted");
  }
}
