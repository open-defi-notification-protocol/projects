const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceAvalanche extends WalletBalanceBase {

    static network = "avalanche"

    constructor() {

        super('AVAX');

    }

}

module.exports = WalletBalanceAvalanche;
