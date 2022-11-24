const TwapAllBase = require("./twap-all-base");

module.exports = class TwapAllFtm extends TwapAllBase {
  static displayName = "TWAP All Events";
  static description = "Get notified for all events regarding your TWAP orders (Fantom)";
  static network = "fantom";

  constructor() {
    super("0xBb9F828E34A1327607c3e4eA3dD35891398DD5EE");
  }
}
