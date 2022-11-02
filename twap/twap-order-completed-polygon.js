const TwapOrderCompletedBase = require("./twap-order-completed-base");

module.exports = class TwapOrderCompletedFtm extends TwapOrderCompletedBase {

    static displayName = "TWAP Order Completed";
    static description = "Get notified when your TWAP order is completely filled (Polygon)";

    static network = "polygon";

    constructor() {
        super("0x8358686cf6dE08c89EE48016b6A40BBf1b1F9d3D");
    }
}
