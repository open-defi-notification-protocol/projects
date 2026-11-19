const TVL = require("./tvl");

module.exports = class extends TVL {
  static displayName = "TVL";
  static description = "Track a pool's Total Value Locked (Arbitrum)";
  static network = "arbitrum";

  constructor() {
    super("arbitrum");
  }
};
