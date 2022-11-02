const ABIs = require("./abis.json");

module.exports = class TwapOrderCompletedBase {
  constructor(twapAddress) {
    this.twapAddress = twapAddress;
  }

  /**
   * runs when class is initialized
   *
   * @param args
   * @returns {Promise<void>}
   */
  async onInit(args) {
    const web3 = args.web3;
    this.twapContract = new web3.eth.Contract(ABIs.twap, this.twapAddress);
  }

  /**
   * runs right before user subscribes to new notifications and populates subscription form
   *
   * @param args
   * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
   */
  async onSubscribeForm(args) {
    return [
      {
        id: "allow-subscribe",
        label: "This input makes sure the Subscribe button will be shown",
        type: "hidden",
        value: true,
      },
    ];
  }

  /**
   * runs when endpoint's chain is extended - notification scanning happens here
   *
   * @param args
   * @returns {Promise<{notification: string}|*[]>}
   */
  async onBlocks(args) {
    const events = await this.twapContract.getPastEvents("OrderCompleted", {
      fromBlock: args.fromBlock,
      toBlock: args.toBlock,
      filter: { maker: args.address },
    });

    return events.map((e) => ({
      uniqueId: `order-${e.returnValues.id}-${e.event}`,
      notification: `Your TWAP order #${e.returnValues.id} is completely filled!`,
    }));
  }
}
