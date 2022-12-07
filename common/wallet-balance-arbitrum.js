const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceArbitrum extends WalletBalanceBase {

    static displayName = "Wallet Balance (Arbitrum)";
    static network = "arbitrum"
    static description = "Get notified when your wallet's balance in ETH is above or below a certain threshold";

    constructor() {

        super('ETH');

    }

}

module.exports = WalletBalanceArbitrum;
