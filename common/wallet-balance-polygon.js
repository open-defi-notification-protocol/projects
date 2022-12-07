const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalancePolygon extends WalletBalanceBase {

    static displayName = "Wallet Balance (Polygon)";
    static network = "polygon"
    static description = "Get notified when your wallet's balance in MATIC is above or below a certain threshold";

    constructor() {

        super('MATIC');

    }

}

module.exports = WalletBalancePolygon;
