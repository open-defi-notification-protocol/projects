const TwapOrderCompleted = require("./twap-order-completed");

module.exports = class TwapOrderCompletedFtm extends TwapOrderCompleted {
  static displayName = "TWAP Order Completed";
  static description = "Get notified when your TWAP order is completely filled (Fantom)";
  static network = "fantom";

  constructor() {
    super("0x85253417E9BF576980318E7882147618C4980969");
  }
}
