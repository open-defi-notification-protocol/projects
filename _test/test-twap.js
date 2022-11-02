const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testTwap(address, type, network) {

    const TwapNotification = require(`../twap/twap-${type}-${network}`);
    const twapNotification = new TwapNotification();

    // simulate init event
    await twapNotification.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await twapNotification.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate on blocks event
    return twapNotification.onBlocks({
        web3,
        address,
        subscription: {},
        fromBlock: 32492682,
        toBlock: 32492699
    });

}

async function main() {

    console.log('Running manual test:');

    const address = '';

    console.log(await testTwap(address, "all", "ftm"));
    console.log(await testTwap(address, "all", "polygon"));

    console.log(await testTwap(address, "order-completed", "ftm"));
    console.log(await testTwap(address, "order-completed", "polygon"));

}

main();


