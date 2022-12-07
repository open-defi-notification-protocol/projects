const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceEthereum extends WalletBalanceBase {

    static network = "ethereum"

    constructor() {

        super('ETH');

    }

}

module.exports = WalletBalanceEthereum;
