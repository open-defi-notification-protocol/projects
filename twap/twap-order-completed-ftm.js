const TwapOrderCompletedBase = require("./twap-order-completed-base");

module.exports = class TwapOrderCompletedFtm extends TwapOrderCompletedBase {
  static displayName = "TWAP Order Completed";
  static description = "Get notified when your TWAP order is completely filled (Fantom)";
  static network = "fantom";

  constructor() {
    super("0xBb9F828E34A1327607c3e4eA3dD35891398DD5EE");
  }
}
