const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceBsc extends WalletBalanceBase {

    static displayName = "Wallet Balance (BSC)";
    static network = "bsc"
    static description = "Get notified when your wallet's balance in BNB is above or below a certain threshold";

    constructor() {

        super('BNB');

    }

}

module.exports = WalletBalanceBsc;
