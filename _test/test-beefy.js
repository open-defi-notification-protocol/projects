const Web3 = require('web3');
const web3Arbitrum = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Arbitrum));


async function testTvl(web3, notificationModule, threshold, above, address) {

    const Tvl = require('../beefy/' + notificationModule);
    const tvl = new Tvl();

    // simulate init event
    await tvl.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await tvl.onSubscribeForm({
        web3,
        address
    });

    console.log(form)

    // simulate user filling in the subscription form in the app
    const subscription = {
        vault: '0xCBAB6076b4B0c482e7127a201b79a13D117E2B53',
        'above-below': above ? '0' : '1',
        threshold: threshold
    };

    // simulate on blocks event
    return tvl.onBlocks({
        web3,
        address: address,
        subscription: subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testTvl(web3Arbitrum, 'tvl', '0', true, address))

}

main();
