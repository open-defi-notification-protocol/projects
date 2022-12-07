const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceFantom extends WalletBalanceBase {

    static network = "fantom"

    constructor() {

        super('FTM');

    }

}

module.exports = WalletBalanceFantom;
