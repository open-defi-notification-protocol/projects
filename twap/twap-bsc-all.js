const TwapBase = require("./twap-base");

module.exports = class extends TwapBase {
  static displayName = "TWAP All Events";
  static description = "Get notified for all events regarding your TWAP orders (BSC)";
  static network = "bsc";

  constructor() {
    super("bsc");
  }
}
