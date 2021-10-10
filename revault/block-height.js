class BlockHeight {

  static displayName = "Block Height";
  static description = "Get notified when the chain reaches a specific block height";
  static displayIcon = "hand";

  // runs right before user subscribes to new notifications and populates subscription form
  async onSubscribeForm(args) {
    const defaultHeight = await args.web3.eth.getBlockNumber() + 20;
    return [
      { type: "input-number", id: "height", label: "Block Height", default: defaultHeight, description: "The block height to be notified about when reached" }
    ];
  }

  // runs when new blocks are added to the mainnet chain - notification scanning happens here
  async onBlocks(args) {
    const height = parseInt(args.subscription["height"]);
    if (height >= args.fromBlock && height <= args.toBlock) return {
      notification: `Block height ${height} reached`
    };
    return [];
  }

}

module.exports = BlockHeight;