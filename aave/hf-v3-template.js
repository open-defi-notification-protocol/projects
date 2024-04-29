const ABIs = require("./abis.json");
const addresses = require("./addresses.json");
const BN = require("bignumber.js");

const amountFormatter = Intl.NumberFormat("en");

class V3PoolBase {
  static displayName = "Position Health";
  static description = "Get notified when Health Factor is getting below a certain threshold";

  /**
   *
   * @param network
   */
  constructor(network) {
    this.network = network;
    this.poolContractAddress = addresses["V3"][network];
  }

  /**
   *
   * @param args
   * @returns {Promise<void>}
   */
  async onInit(args) {
    this.contract = new args.web3.eth.Contract(ABIs.pool, this.poolContractAddress);
  }

  async onSubscribeForm(args) {
    const healthFactorBN = await this._getPositionHealth(args);

    if (healthFactorBN !== "no-position") {
      return [
        {
          type: "input-number",
          id: "threshold",
          label: `Health Factor Threshold (current is ${amountFormatter.format(healthFactorBN.toString())})`,
          default: "1.1",
          description: "Notify me when the Health Factor of my position goes below this threshold.",
        },
      ];
    } else {
      return [];
    }
  }

  async onBlocks(args) {
    const threshold = args.subscription["threshold"];

    const uniqueId = "aave-health-" + this.network + "-v3-" + threshold;

    const healthFactorBN = await this._getPositionHealth(args);

    if (healthFactorBN !== "no-position" && healthFactorBN.isLessThan(threshold))
      return {
        uniqueId: uniqueId,
        notification: `Current Health Factor (${amountFormatter.format(healthFactorBN.toString())}) is below the threshold of ${threshold}!`,
      };

    return [];
  }

  async _getPositionHealth(args) {
    const position = await this.contract.methods.getUserAccountData(args.address).call();
    return new BN(position.totalDebtBase).isGreaterThan(0) ? new BN(position.healthFactor).dividedBy("1e18") : "no-position";
  }
}

module.exports = V3PoolBase;
