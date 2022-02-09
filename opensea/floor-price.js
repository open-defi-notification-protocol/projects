// notify when floor price is above/below chosen value in USD
const BN = require("bignumber.js");
const fetch = require("node-fetch");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class FloorPrice {

    static displayName = "Floor Price";
    static description = "Get notified when the floor price of a collection (in ETH) is above or below a certain threshold";
    static displayIcon = "hand";

    // runs when class is initialized
    async onInit(args) {

    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm() {

        return [
            {
                type: "input-text",
                id: "collectionUrl",
                label: "Collection URL",
                default: "",
                description: "Paste the OpenSea collection URL here"
            },
            {
                type: "input-number",
                id: "price",
                label: "Threshold Price (ETH)",
                default: "0",
                description: "The floor price threshold in ETH"
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

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const subscription = args.subscription;

        let collectionUrl = subscription["collectionUrl"];
        const price = subscription["price"];
        const above = subscription["above-below"] === "0";

        collectionUrl = collectionUrl.indexOf('collection/') >= 0 ? collectionUrl.split('collection/')[1] : collectionUrl;

        const result = await (await fetch(`https://api.opensea.io/api/v1/collection/${collectionUrl}`)).json();

        const collection = result.collection;

        const thresholdPriceBN = new BN(price);

        const floorPrice = collection.stats.floor_price;

        const uniqueId = collectionUrl + "-" + above + "-" + price;

        if ((above && thresholdPriceBN.lt(floorPrice)) || (!above && thresholdPriceBN.gt(floorPrice))) {

            return {
                uniqueId: uniqueId,
                notification: `Floor price for collection ${collection.name} (${amountFormatter.format(floorPrice)} ETH) ${above ? 'is above' : 'dropped below'} ${price} ETH`
            }

        } else {

            return [];
        }
    }

}

module.exports = FloorPrice;
