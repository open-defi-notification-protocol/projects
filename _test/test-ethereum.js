const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testBlockHeightMatch(address) {
    const BlockHeight = require('../ethereum/block-height');
    const blockHeight = new BlockHeight();

    // simulate subscribe form event
    const form = await blockHeight.onSubscribeForm({
        web3,
        address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        height: form.find(o => o.id === 'height').default.toString()
    };

    // simulate on blocks event
    return blockHeight.onBlocks({
        web3,
        address,
        fromBlock: parseInt(subscription['height']) - 10,
        toBlock: parseInt(subscription['height']) + 10,
        subscription
    });
}

async function testGasPriceAboveBelow(address, price, above) {

    const GasPrice = require('../ethereum/gas-price');

    const gasPrice = new GasPrice();

    // simulate subscribe form event
    let form = await gasPrice.onSubscribeForm({
        web3,
        address
    });

    console.log(form)

    // simulate user filling in the subscription form in the app
    const subscription = {
        "price": price,
        "above-below": above ? "0" : "1"
    };

    // simulate init event
    await gasPrice.onInit({
        web3
    });

    // simulate on blocks event
    return gasPrice.onBlocks({
        web3,
        address: "0xC81bD599a66dA6dcc3A64399f8025C19fFC42888",
        subscription: subscription,
        toBlock: 14441466
    });

}

async function main() {

    const address = '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888';

    console.log('Running manual test:');
    console.log(await testBlockHeightMatch(address));
    console.log("test price ABOVE 1000 gwei");
    console.log(await testGasPriceAboveBelow(address, '1000', true));
    console.log("test price ABOVE 10 gwei");
    console.log(await testGasPriceAboveBelow(address, '10', true));
    console.log("");
    console.log("test price BELOW 1000 gwei");
    console.log(await testGasPriceAboveBelow(address, '1000', false));
    console.log("test price BELOW 10 gwei");
    console.log(await testGasPriceAboveBelow(address, '10', false));

}

main();
