const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testFloorPrice(collectionUrl, price, above) {
    const FloorPrice = require('../opensea/floor-price');
    const floorPrice = new FloorPrice();

    // simulate init event
    await floorPrice.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await floorPrice.onSubscribeForm({
        web3
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        collectionUrl: collectionUrl,
        price: price,
        "above-below": above ? "0" : "1"
    };

    // simulate on blocks event
    return floorPrice.onBlocks({
        web3,
        subscription
    });
}

async function testActiveBids(address, price) {
    const ActiveBids = require('../opensea/active-bids');
    const activeBids = new ActiveBids();

    // simulate init event
    await activeBids.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await activeBids.onSubscribeForm({
        web3
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        price: price
    };

    // simulate on blocks event
    return activeBids.onBlocks({
        web3,
        address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x04a7450b1ca006372ebf321e4cd22c362372abe9';

    // console.log(await testFloorPrice("https://opensea.io/collection/boredapeyachtclub", "25", true));
    console.log(await testActiveBids(address,"0.01"));

}

main();


