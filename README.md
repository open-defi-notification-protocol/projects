# Open DeFi Notification Protocol

### An open always-free notification protocol for DeFi on-chain events.

## Goals

1. Always free for users - no subscription fees or ads

    > We believe that mobile alerts for DeFi positions should be a free core blockchain service accessible to anyone, much like MetaMask or Etherscan.

2. Never miss anything - mobile app with persistent alarms and even phone calls

    > When money is involved and you're about to be liquidated, you can't afford to miss a notification. We will wake you up if needed in the middle of the night.

3. Multi network support - Ethereum, BSC, Polygon and more

    > The DeFi ecosystem is constantly expanding to new networks like Polygon and Arbitrum. The protocol is chain agnostic and designed to integrate with any ecosystem.

4. Community-led open protocol with public and decentralized alert nodes

    > Core blockchain services should be as decentralized as possible. Allow any developer to contribute code, any project to integrate and any validator to help run nodes.

&nbsp;

## How to integrate a new project

Integrating notifications for a new project requires implementing a small [web3](https://github.com/ChainSafe/web3.js)-compatible JavaScript class and creating a new [PR](https://docs.github.com/en/github/collaborating-with-pull-requests) to add the class to this repo.

### Example - low health notification for Aave

This notification aims to protect Aave users from liquidation by notifying them when their position health factor drops below 1.1:

```js
const BigNumber = require("bignumber.js");

class LowHealth {

  static displayName = "Low Health";
  static description = "Get notified when health factor is getting low (below 1.1)";

  async onInit(args) {
    const abi = [{/* ... */}];
    this.contract = new args.web3.eth.Contract(abi, "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
  }

  async onBlocks(args) {
    const position = await this.contract.methods.getPositionData(args.address).call();
    if (new BigNumber(position.healthFactor).dividedBy("1e18").toNumber() < 1.1) return {
      notification: "Health factor dropped below 1.1"
    };
  }

}

module.exports = LowHealth;
```

### Documentation and more examples

Formal TypeScript type definitions for the class interface are available [here](projects/interfaces.ts). Explore example integrations to different projects by browsing the different directories in this repo.

&nbsp;

## Execution environment

These JavaScript classes are constantly executed by protocol alert nodes in order to analyze new blocks of on-chain data for notifying protocol subscribers. Alert nodes are currently supported on the [Orbs Network](https://orbs.com) and executed by the public validators of the network.
