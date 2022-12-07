const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceAvalanche extends WalletBalanceBase {

    static displayName = "Wallet Balance (Avalanche)";
    static network = "avalanche"
    static description = "Get notified when your wallet's balance in AVAX is above or below a certain threshold";

    constructor() {

        super('AVAX');

    }

}

module.exports = WalletBalanceAvalanche;
