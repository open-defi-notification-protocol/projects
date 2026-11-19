const WalletBalanceBase = require("./wallet-balance-base");

class WalletBalanceCronos extends WalletBalanceBase {

    static displayName = "Wallet Balance (Cronos)";
    static network = "cronos"
    static description = "Get notified when your wallet's balance in CRO is above or below a certain threshold";

    constructor() {

        super('CRO');

    }

}

module.exports = WalletBalanceCronos;
