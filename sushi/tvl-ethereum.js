const TVL = require("./tvl");

module.exports = class extends TVL {
  static displayName = "TVL";
  static description = "Track a pool's Total Value Locked (Ethereum)";
  static network = "ethereum";

  constructor() {
    super("ethereum");
  }
};
