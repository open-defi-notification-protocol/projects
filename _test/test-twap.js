const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testTwap(address, type) {

    const TwapNotification = require('../twap/twap-' + type);
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

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testTwap("0x5FaadBBc3bc42E463BDE53dbD45b8a29D3a1C66f", "all"));

    console.log(await testTwap("0x5FaadBBc3bc42E463BDE53dbD45b8a29D3a1C66f", "order-completed"));

}

main();


