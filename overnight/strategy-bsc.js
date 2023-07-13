const StrategyBase = require("./strategy-base");

module.exports = class extends StrategyBase {
    static displayName = "Strategy update";
    static description = "Get notified when a strategy has been updated (BSC)";
    static network = "bsc";

    constructor() {
        super("bsc");
    }
}
