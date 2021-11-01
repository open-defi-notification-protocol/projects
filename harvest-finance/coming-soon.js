class PlaceHolder {

  static displayName = "Coming Soon";
  static description = "Support for Harvest finance will be here soon...";
  static displayIcon = "hand";

  // runs right before user subscribes to new notifications and populates subscription form
  async onSubscribeForm(args) {
    return [];
  }

  // runs when new blocks are added to the mainnet chain - notification scanning happens here
  async onBlocks(args) {
    return [];
  }

}

module.exports = PlaceHolder;
