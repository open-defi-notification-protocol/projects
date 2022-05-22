// notify when floor price is above/below chosen value in USD
const BN = require("bignumber.js");
const fetch = require("node-fetch");
const Common = require("./common");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

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
                type: "input-select",
                id: "collection",
                label: "Collection",
                values: await Common.getWalletCollections(args)
            },
            {
                type: "input-number",
                id: "price",
                label: "Threshold Price (ETH)",
                default: "0",
                description: "Set an offer price threshold in ETH"
            },
            {
                type: "input-text",
                id: "collectionUrl",
                label: "Collection URL",
                optional: true,
                default: "",
                description: "If this collection is missing from the list you can paste the OpenSea collection URL here instead"
            }
        ];

    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        const subscription = args.subscription;

        const price = subscription["price"];

        let collectionSlug = subscription["collectionUrl"] || subscription["collection"];
        collectionSlug = collectionSlug.indexOf('collection/') >= 0 ? collectionSlug.split('collection/')[1] : collectionSlug;

        const params = {
            limit: 50,
            side: 0, // Buy
            owner: args.address,
            listed_after: Math.floor(Date.now()) - (LISTED_AFTER__IN_MINUTES * 60 * 1000)
        };

        const result = await (await fetch(`https://api.opensea.io/wyvern/v1/orders?limit=${params.limit}&side=${params.side}&owner=${params.owner}&listed_after=${params.listed_after}`, {
                method: 'GET',
                headers: {'X-API-KEY': args.platformKeys.opensea}
            })
        ).json();

        const orders = result.orders;

        const notifications = []

        const thresholdPriceEthBN = new BN(price);

        for (const order of orders) {

            if (collectionSlug === order.asset.collection.slug) {

                const offerPriceEthBN = new BN(order.base_price).dividedBy('1e18');

                if (offerPriceEthBN.gt(thresholdPriceEthBN)) {

                    const asset = order.asset;

                    const uniqueId = asset.id + "-" + order.id;

                    notifications.push({
                        uniqueId: uniqueId,
                        notification: `You have a new offer of ${amountFormatter.format(offerPriceEthBN)} ETH for ${asset.name}${order.quantity !== '1' ? ` (quantity:${order.quantity})` : ''} of collection ${asset.collection.name}`
                    });

                }

            }

        }

        return notifications;

    }

}

module.exports = NewOffers;
