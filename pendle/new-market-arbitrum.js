const NewMarketBase = require("./new-market-base");

module.exports = class extends NewMarketBase {
    static displayName = "New Market";
    static description = "Get notified when a new market has been created (Arb)";
    static network = "arbitrum";

    constructor() {
        super("arbitrum");
    }
}
