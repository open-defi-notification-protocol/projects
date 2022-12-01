const TwapBase = require("./twap-base");

module.exports = class extends TwapBase {
  static displayName = "TWAP All Events";
  static description = "Get notified for all events regarding your TWAP orders (Avalanche)";
  static network = "avalanche";

  constructor() {
    super("avalanche");
  }
}
