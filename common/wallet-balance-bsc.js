const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceBsc extends WalletBalanceBase {

    static network = "bsc"

    constructor() {

        super('BNB');

    }

}

module.exports = WalletBalanceBsc;
