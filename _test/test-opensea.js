async function testFloorPrice(collectionUrl, price, above) {
    const FloorPrice = require('../opensea/floor-price');
    const floorPrice = new FloorPrice();

    // simulate init event
    await floorPrice.onInit({});

    // simulate subscribe form event
    const form = await floorPrice.onSubscribeForm({});

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        collectionUrl: collectionUrl,
        price: price,
        "above-below": above ? "0" : "1"
    };

    // simulate on blocks event
    return floorPrice.onBlocks({
        subscription
    });
}

async function testActiveBids(address, price) {
    const ActiveBids = require('../opensea/new-offers');
    const activeBids = new ActiveBids();

    // simulate init event
    await activeBids.onInit({});

    // simulate subscribe form event
    const form = await activeBids.onSubscribeForm({});

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
    console.log(await testActiveBids(address,"0.01"));

}

main();


