const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalancePolygon extends WalletBalanceBase {

    static network = "polygon"

    constructor() {

        super('MATIC');

    }

}

module.exports = WalletBalancePolygon;
