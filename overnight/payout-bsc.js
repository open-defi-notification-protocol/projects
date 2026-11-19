const NewMarketBase = require("./payout-base");

module.exports = class extends NewMarketBase {
    static displayName = "New Payout";
    static description = "Get notified when a new payout event has taken place (BSC)";
    static network = "bsc";

    constructor() {
        super("bsc");
    }
}
