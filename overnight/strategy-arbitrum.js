const StrategyBase = require("./strategy-base");

module.exports = class extends StrategyBase {
    static displayName = "Strategy update";
    static description = "Get notified when a strategy has been updated (Arb)";
    static network = "arbitrum";

    constructor() {
        super("arbitrum");
    }
}
