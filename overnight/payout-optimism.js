const NewMarketBase = require("./payout-base");

module.exports = class extends NewMarketBase {
    static displayName = "New Payout";
    static description = "Get notified when a new payout event has taken place (Optimism)";
    static network = "optimism";

    constructor() {
        super("optimism");
    }
}
