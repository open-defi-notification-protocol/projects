const fetch = require("node-fetch");
process.env.OPENSEA_API_KEY = require('./dev-keys.json').openSeaApiKey;

async function testFloorPrice(address, collectionUrl, price, above) {
    const FloorPrice = require('../opensea/floor-price');
    const floorPrice = new FloorPrice();

    // simulate init event
    await floorPrice.onInit({});

    // simulate subscribe form event
    const form = await floorPrice.onSubscribeForm({
        platformKeys: {opensea: process.env.OPENSEA_API_KEY},
        address: address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        collection: form.find(o => o.id === 'collection').values[3].value,
        collectionUrl: collectionUrl,
        price: price,
        "above-below": above ? "0" : "1"
    };

    // simulate on blocks event
    return floorPrice.onBlocks({
        platformKeys: {opensea: process.env.OPENSEA_API_KEY},
        subscription
    });
}

async function testNewOffers(address, price) {
    const NewOffers = require('../opensea/new-offers');
    const newOffers = new NewOffers();

    // simulate init event
    await newOffers.onInit({});

    // simulate subscribe form event
    const form = await newOffers.onSubscribeForm({
        platformKeys: {opensea: process.env.OPENSEA_API_KEY},
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        price: price,
        // collectionUrl: "https://opensea.io/collection/punklaus",
        collection: form.find(o => o.id === 'collection').values[3].value
    };

    // simulate on blocks event
    return newOffers.onBlocks({
        platformKeys: {opensea: process.env.OPENSEA_API_KEY},
        address,
        subscription
    });
}

async function testNewOffersByFloor(address, threshold) {
    const NewOffersByFloor = require('../opensea/new-offers-by-floor');
    const newOffersByFloor = new NewOffersByFloor();

    // simulate init event
    await newOffersByFloor.onInit({});

    // simulate subscribe form event
    const form = await newOffersByFloor.onSubscribeForm();

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        "floor-threshold": threshold
    };

    // simulate on blocks event
    return newOffersByFloor.onBlocks({
        address,
        platformKeys: {opensea: process.env.OPENSEA_API_KEY},
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x1fC4b564c2f0E601198969817ee999cB78517ED5';

    // console.log(await testFloorPrice(address, "https://opensea.io/collection/boredapeyachtclub", "25", true));
    // console.log(await testNewOffersByFloor(address, "60"));
    console.log(await testNewOffers(address, "0.0001"));

    // load testing opensea api
    /*const p = []

    for (let i = 0; i < 1; i++) {

        p.push((async () => {

            const params = {
                limit: 50,
                side: 0, // Buy
                owner: address,
                listed_after: Math.floor(Date.now()) - (30 * 60 * 1000)
            };

            const result = (await fetch(
                    `https://api.opensea.io/wyvern/v1/orders?limit=${params.limit}&side=${params.side}&owner=${params.owner}&listed_after=${params.listed_after}`, {
                        method: 'GET',
                        headers: {'X-API-KEY': process.env.OPENSEA_API_KEY}
                    })
            );

            // const result = await (await fetch(`https://api.opensea.io/api/v1/collection/boredapeyachtclub`));

            try {

                // console.log(i + ' ' + JSON.stringify(await result.json()))
                console.log(i + ' ' + await result.text())

            } catch (e) {
                console.log(e)
            }

        })())

    }

        await Promise.all(p)

    */


}

main();


