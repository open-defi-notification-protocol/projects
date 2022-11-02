const TwapAllBase = require("./twap-all-base");

module.exports = class TwapAllFtm extends TwapAllBase {
  static displayName = "TWAP All Events";
  static description = "Get notified for all events regarding your TWAP orders (Fantom)";
  static network = "fantom";

  constructor() {
    super("0x85253417E9BF576980318E7882147618C4980969");
  }
}
