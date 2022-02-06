// notify when floor price is above/below chosen value in USD
const BN = require("bignumber.js");
const fetch = require("node-fetch");

const LISTED_AFTER__IN_MINUTES = 30;

class NewOffers {

    static displayName = "New Offers";
    static description = "Get notified about new offers for your NFTs on the Ethereum blockchain";
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
                label: "Threshold Price (ETH)",
                default: "0",
                description: "Set an offer price threshold in ETH"
            }
        ];
    }

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const subscription = args.subscription;

        const price = subscription["price"];

        const params = {
            limit: 50,
            side: 0, // Buy
            owner: args.address,
            listed_after: Math.floor(Date.now()) - (LISTED_AFTER__IN_MINUTES * 60 * 1000)
        };

        const result = await (await fetch(`https://api.opensea.io/wyvern/v1/orders?limit=${params.limit}&side=${params.side}&owner=${params.owner}&listed_after=${params.listed_after}`, {
                method: 'GET',
                headers: {'X-API-KEY': process.env.OPENSEA_API_KEY}
            })
        ).json();

        const orders = result.orders;

        const notifications = []

        const thresholdPriceEthBN = new BN(price);

        for (const order of orders) {

            const offerPriceEthBN = new BN(order.base_price).dividedBy('1e18');

            if (offerPriceEthBN.gt(thresholdPriceEthBN)) {

                const asset = order.asset;

                const uniqueId = asset.id + "-" + order.id;

                notifications.push({
                    uniqueId: uniqueId,
                    notification: `You have a new offer of ${offerPriceEthBN} ETH for ${asset.name} of collection ${asset.collection.name}`
                });

            }

        }

        return notifications;

    }

}

module.exports = NewOffers;
