const TwapAllBase = require("./twap-all-base");

module.exports = class TwapAllFtm extends TwapAllBase {
    static displayName = "TWAP All Events";
    static description = "Get notified for all events regarding your TWAP orders (Polygon)";
    static network = "fantom";

    constructor() {
        super("0x8358686cf6dE08c89EE48016b6A40BBf1b1F9d3D");
    }
}
