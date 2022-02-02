// notify when floor price is above/below chosen value in USD
const BN = require("bignumber.js");
const fetch = require("node-fetch");

const LISTED_AFTER__MINUTES = 60;

class Offers {

    static displayName = "Offers";
    static description = "Get notified about new offers for your NFTs";
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
            limit: 1,
            side: 0, // Buy
            owner: args.address,
            listed_after: Math.floor(Date.now()) - (LISTED_AFTER__MINUTES * 60 * 1000)
        };

        /* const result = await (await fetch(`https://api.opensea.io/wyvern/v1/orders`, {
                 method: 'GET',
                 body: params,
                 headers: {'X-API-KEY': process.env.OPENSEA_API_KEY}
             })
         ).json();

         const orders = result.orders;

         const thresholdPriceBN = new BN(price);

         const floorPrice = collection.stats.floor_price;

         const uniqueId = collectionUrl + "-" + above + "-" + price;

         if ((above && thresholdPriceBN.lt(floorPrice)) || (!above && thresholdPriceBN.gt(floorPrice))) {

             return {
                 uniqueId: uniqueId,
                 notification: `You have a new offer of 1.5 ETH for ${collection.name} (${floorPrice} ETH) ${above ? 'is above' : 'dropped below'} ${price} ETH`
             }

         } else {

             return [];
         }*/
        return []
    }

}

module.exports = Offers;
