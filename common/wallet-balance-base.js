const BN = require("bignumber.js");
const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class WalletBalanceBase {

    static displayName = "Wallet Balance";
    static description = "Get notified when your wallet's balance in ETH is above or below a certain threshold";
    static displayIcon = "hand";

    /**
     *
     * @param nativeCurrentySymbol
     */
    constructor(nativeCurrentySymbol) {
        this.nativeCurrentySymbol = nativeCurrentySymbol
    }

    /**
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        const currentBalanceBN = await this._getCurrentBalanceBN(
            args.web3,
            args.address
        );

        return [
            {
                type: "input-number",
                id: "threshold",
                label: "Threshold",
                default: 0,
                description: `Notify me when the balance of my wallet goes above/below this value in ${this.nativeCurrentySymbol} (current balance: ${amountFormatter.format(currentBalanceBN.dividedBy('1e18').toString())})`
            },
            {
                type: "input-select",
                id: "above-below",
                label: "Above/Below",
                values: [
                    {value: "0", label: "Above"},
                    {value: "1", label: "Below"}
                ]
            }
        ];
    }

    /**
     *
     * @param web3
     * @param address
     * @returns {BigNumber}
     * @private
     */
    async _getCurrentBalanceBN(web3, address) {

        return new BN(await web3.eth.getBalance(address));

    }

// runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const subscription = args.subscription;

        const threshold = subscription['threshold'];

        const thresholdWei = new BN(threshold).multipliedBy('1e18');
        const above = subscription["above-below"] === "0";

        const currentBalanceBN = await this._getCurrentBalanceBN(
            args.web3,
            args.address
        );

        const uniqueId = "above-" + above + "-" + threshold;

        if ((above && currentBalanceBN.gt(thresholdWei)) || (!above && currentBalanceBN.lt(thresholdWei))) {

            return {
                uniqueId: uniqueId,
                notification: `Your wallet's balance (${amountFormatter.format(currentBalanceBN.dividedBy('1e18').toString())}) ${above ? 'is above' : 'has dropped below'} ${amountFormatter.format(threshold)} ${this.nativeCurrentySymbol}`
            };

        } else {

            return [];

        }

    }

}

module.exports = WalletBalanceBase;
