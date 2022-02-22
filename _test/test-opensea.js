process.env.OPENSEA_API_KEY = require('./dev-keys.json').openSeaApiKey;

async function testFloorPrice(address, collectionUrl, price, above) {
    const FloorPrice = require('../opensea/floor-price');
    const floorPrice = new FloorPrice();

    // simulate init event
    await floorPrice.onInit({});

    // simulate subscribe form event
    const form = await floorPrice.onSubscribeForm({address});

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        collection: form.find(o => o.id === 'collection').values[12].value,
        collectionUrl: collectionUrl,
        price: price,
        "above-below": above ? "0" : "1"
    };

    // simulate on blocks event
    return floorPrice.onBlocks({
        subscription
    });
}

async function testNewOffers(address, price) {
    const NewOffers = require('../opensea/new-offers');
    const newOffers = new NewOffers();

    // simulate init event
    await newOffers.onInit({});

    // simulate subscribe form event
    const form = await newOffers.onSubscribeForm({address});

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        price: price,
        // collectionUrl: "https://opensea.io/collection/punklaus",
        collection: form.find(o => o.id === 'collection').values[12].value
    };

    // simulate on blocks event
    return newOffers.onBlocks({
        address,
        subscription
    });
}

async function testNewOffersByFloor(address, price) {
    const NewOffersByFloor = require('../opensea/new-offers-by-floor');
    const activeBids = new NewOffersByFloor();

    // simulate init event
    await activeBids.onInit({});

    // simulate subscribe form event
    const form = await activeBids.onSubscribeForm({address});

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        price: price
    };

    // simulate on blocks event
    return activeBids.onBlocks({
        address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0xbcb6e5e402badcef505baabd9cf9759cf3083636';


    // console.log(await testFloorPrice("https://opensea.io/collection/boredapeyachtclub", "25", true));
    console.log(await testNewOffers(address, "0.01"));
    // console.log(await testNewOffersByFloor(address, "0.01"));

}

main();


