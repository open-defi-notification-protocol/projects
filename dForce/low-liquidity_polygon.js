const dForceBase = require("./low-liquidity-base");

module.exports = class extends dForceBase {
  static network = "polygon";

  constructor() {
    super("polygon");
  }
}
