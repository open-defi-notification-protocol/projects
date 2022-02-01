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

async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testFloorPrice("https://opensea.io/collection/boredapeyachtclub", "25", true));

}

main();


