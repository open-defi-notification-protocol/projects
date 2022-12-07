const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceArbitrum extends WalletBalanceBase {

    static network = "arbitrum"

    constructor() {

        super('ETH');

    }

}

module.exports = WalletBalanceArbitrum;
