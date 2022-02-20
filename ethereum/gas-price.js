// notify when gas price is above/below chosen value in Gwei
const BN = require("bignumber.js");

class GasPrice {

    static displayName = "Gas Price";
    static description = "Get notified when the last block base fee per gas price is above or below a certain threshold";
    static displayIcon = "hand";

    // runs when class is initialized
    async onInit(args) {

        this.lastBlock = null;

    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        this.lastBlock = await args.web3.eth.getBlock('latest');
        const basePricePerGasBN = new BN(this.lastBlock.baseFeePerGas, 16);

        return [
            {
                type: "input-number",
                id: "price",
                label: "Gas Price (Gwei)",
                default: "0",
                description: `The gas price threshold (current is ${this._formatGasPrice(args.web3, basePricePerGasBN)} Gwei)`
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
     * @param priceBN
     * @returns {number}
     * @private
     */
    _formatGasPrice(web3, priceBN) {

        return Math.round(web3.utils.fromWei(priceBN.toString(), 'Gwei'))

    }

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        if (this.lastBlock === null || this.lastBlock.height !== args.toBlock) {
            this.lastBlock = await args.web3.eth.getBlock(args.toBlock);
        }

        const subscription = args.subscription;

        const price = subscription["price"];
        const above = subscription["above-below"] === "0";

        const thresholdPriceWeiBN = new BN(args.web3.utils.toWei(price, 'Gwei'));

        const basePricePerGasBN = new BN(this.lastBlock.baseFeePerGas, 16);

        if ((above && thresholdPriceWeiBN.lt(basePricePerGasBN)) || (!above && thresholdPriceWeiBN.gt(basePricePerGasBN))) {

            return {notification: `Ethereum base price per gas (${this._formatGasPrice(args.web3, basePricePerGasBN)}) is ${above ? 'above' : 'below'} ${price} Gwei`}

        } else {

            return [];
        }
    }

}

module.exports = GasPrice;
