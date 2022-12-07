const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceEthereum extends WalletBalanceBase {

    static displayName = "Wallet Balance (Ethereum)";
    static network = "ethereum"
    static description = "Get notified when your wallet's balance in ETH is above or below a certain threshold";

    constructor() {

        super('ETH');

    }

}

module.exports = WalletBalanceEthereum;
