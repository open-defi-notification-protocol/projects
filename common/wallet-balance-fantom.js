const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceFantom extends WalletBalanceBase {

    static displayName = "Wallet Balance (Fantom)";
    static network = "fantom"
    static description = "Get notified when your wallet's balance in FTM is above or below a certain threshold";

    constructor() {

        super('FTM');

    }

}

module.exports = WalletBalanceFantom;
