const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));

async function testTokensWorth(address, tokenAddress, threshold, above) {
    const PositionWorth = require('../pancakeswap/tokens-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionWorth.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        'above-below': above ? '0' : '1',
        tokenAddress: tokenAddress,
        threshold: threshold
    };

    // simulate on blocks event
    return positionWorth.onBlocks({
        web3,
        address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';
    const tokenAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';

    console.log(await testTokensWorth(
        address,
        tokenAddress,
        "20500",
        false
    ));

}

main();


