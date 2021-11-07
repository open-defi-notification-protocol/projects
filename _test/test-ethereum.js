const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testBlockHeightMatch() {
    const BlockHeight = require('../ethereum/block-height');
    const blockHeight = new BlockHeight();

    // simulate subscribe form event
    const form = await blockHeight.onSubscribeForm({
        web3,
        address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        height: form.find(o => o.id === 'height').default.toString()
    };

    // simulate on blocks event
    return blockHeight.onBlocks({
        web3,
        address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
        fromBlock: parseInt(subscription['height']) - 10,
        toBlock: parseInt(subscription['height']) + 10,
        subscription
    });
}

async function testGasPriceAboveBelow(price, above) {

    const GasPrice = require('../ethereum/gas-price');

    const gasPrice = new GasPrice();

    // simulate subscribe form event
    await gasPrice.onSubscribeForm({
        web3,
        address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
    });

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
        toBlock: 13569998
    });

}


async function testTransactionConfirmations(txHash, confirmations) {

    const GasPrice = require('../ethereum/transaction-confirmations');

    const gasPrice = new GasPrice();

    // simulate subscribe form event
    await gasPrice.onSubscribeForm({
        web3,
        address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
    });

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
        subscription: subscription
    });

}

async function main() {


    console.log('Running manual test:');
    console.log(await testBlockHeightMatch());
    console.log("test price ABOVE 1000 gwei");
    console.log(await testGasPriceAboveBelow('1000', true));
    console.log("test price ABOVE 10 gwei");
    console.log(await testGasPriceAboveBelow('10', true));
    console.log("");
    console.log("test price BELOW 1000 gwei");
    console.log(await testGasPriceAboveBelow('1000', false));
    console.log("test price BELOW 10 gwei");
    console.log(await testGasPriceAboveBelow('10', false));

}

main();
