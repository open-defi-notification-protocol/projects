// notify when gas price is below chosen value in Gwei
const BN = require("bignumber.js");

class GasPrice {

    static displayName = "Block Height";
    static description = "Get notified when the last block base fee per gas price is above or below a certain threshold";
    static displayIcon = "hand";

    // runs when class is initialized
    async onInit(args) {
    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        return [
            {
                type: "input-number",
                id: "price",
                label: "Gas Price (Gwei)",
                default: 0,
                description: "The gas price threshold"
            },
            {
                type: "input-select",
                id: "above-below",
                label: "Above/Below",
                values: [
                    {value: 0, label: 'Above'},
                    {value: 1, label: 'Below'}
                ]
            }
        ];
    }

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const subscription = args.subscription;

        const price = subscription["price"];
        const above = subscription["above-below"].value === 0;

        const block = await args.web3.eth.getBlock("pending");

        const thresholdPriceWeiBN = new BN(args.web3.utils.toWei(price, 'Gwei'));

        const basePricePerGasBN = new BN(block.baseFeePerGas, 16);

        if ((above && thresholdPriceWeiBN.lt(basePricePerGasBN)) || (!above && thresholdPriceWeiBN.gt(basePricePerGasBN))) {

            return {notification: `Ethereum base price per gas is ${above ? 'above' : 'below'} ${price} Gwei`}

        } else {

            return [];
        }
    }

}

module.exports = GasPrice;
