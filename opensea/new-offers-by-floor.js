// notify when floor price is above/below chosen value in USD
const BN = require("bignumber.js");
const fetch = require("node-fetch");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

const LISTED_AFTER__IN_MINUTES = 30;

const CACHE_STALENESS_MILLIS = 1000 * 60 * 10;

const collectionsCache = {};

class NewOffersByFloor {

    static displayName = "New Offers by Floor";
    static description = "Get notified about new offers for your NFTs on the Ethereum blockchain by setting a floor price threshold in percentage";
    static displayIcon = "hand";

    // runs when class is initialized
    async onInit(args) {

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @returns {Promise<[{default: string, description: string, id: string, label: string, type: string, suffix: string}]>}
     */
    async onSubscribeForm() {

        return [
            {
                type: "input-number",
                id: "floor-threshold",
                label: "Floor price threshold",
                default: "90",
                suffix: "%",
                description: "Set an offer price threshold in percentage from the collection's floor price"
            }
        ];

    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<*[]>}
     */
    async onBlocks(args) {

        const subscription = args.subscription;

        const thresholdPerc = subscription["floor-threshold"];

        const params = {
            limit: 50,
            side: 0, // Buy
            owner: args.address,
            listed_after: Math.floor(Date.now() / 1000) - (LISTED_AFTER__IN_MINUTES * 60)
        };

        const notifications = [];

        const result = await (await fetch(`https://api.opensea.io/wyvern/v1/orders?limit=${params.limit}&side=${params.side}&owner=${params.owner}&listed_after=${params.listed_after / 1000}`, {
                method: 'GET',
                headers: {'X-API-KEY': args.platformKeys.opensea}
            })
        ).json();

        const orders = result.orders;

        const thresholdPercBN = new BN(thresholdPerc);

        for (const order of orders) {

            const offerPriceEthBN = new BN(order.base_price).dividedBy('1e18');

            const asset = order.asset;

            const floor = new BN(await this.getCollectionFloor(asset.collection.slug));

            if (floor.multipliedBy(thresholdPercBN.dividedBy(100)).isLessThan(offerPriceEthBN)) {

                const uniqueId = thresholdPerc + "-" + asset.id + "-" + order.id;

                notifications.push({
                    uniqueId: uniqueId,
                    notification: `You have a new offer of ${amountFormatter.format(offerPriceEthBN)} ETH for ${asset.name}${order.quantity !== '1' ? ` (quantity:${order.quantity})` : ''} of collection ${asset.collection.name} (floor ${amountFormatter.format(floor)} ETH)`
                });

            }

        }


        return notifications;

    }

    async getCollectionFloor(collectionSlug) {

        let collectionData = collectionsCache[collectionSlug];

        if (collectionData && collectionData.timestampMillis > (new Date().getTime() - CACHE_STALENESS_MILLIS)) {

            return collectionData.floor;

        } else {

            const result = await (await fetch(`https://api.opensea.io/api/v1/collection/${collectionSlug}`)).json();

            const floorPrice = result.collection.stats.floor_price;

            collectionsCache[collectionSlug] = {
                floor: floorPrice,
                slug: collectionSlug,
                timestampMillis: new Date().getTime()
            };

            return floorPrice;

        }

    }

}

module.exports = NewOffersByFloor;
