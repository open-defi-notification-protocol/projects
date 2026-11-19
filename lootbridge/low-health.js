const BigNumber = require("bignumber.js");
const ABIs = require("./abis.json");

class LowHealth {
  static displayName = "Low Health";
  static description = "Get notified when health factor is getting low (below 1.1)";

  async onInit(args) {
    this.contract = new args.web3.eth.Contract(
      ABIs.lendingPool,
      "0x2133C6f93Cf7A303394D58BE514894FBf545b20E"
    );
  }

  async onSubscribeForm(_args) {
    return [
      {
        id: 'allow-subscribe',
        label: 'This input makes sure the Subscribe button will be shown',
        type: 'hidden',
        value: true,
      },
    ];
  }

  async onBlocks(args) {
    const position = await this.contract.methods.getUserAccountData(args.address).call();
    if (new BigNumber(position.healthFactor).dividedBy("1e18").toNumber() < 1.1) return {
      notification: "Health factor dropped below 1.1"
    };
    return {
      notification: "health is " + new BigNumber(position.healthFactor).dividedBy("1e18").toNumber()
    }
  }

}

module.exports = LowHealth;