const NewMarketBase = require("./payout-base");

module.exports = class extends NewMarketBase {
    static displayName = "New Payout";
    static description = "Get notified when a new payout event has taken place (Polygon)";
    static network = "polygon";

    constructor() {
        super("polygon");
    }
}
