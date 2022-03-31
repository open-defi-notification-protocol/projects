const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testTokensWorth(address, tokenAddress, threshold, above) {
    const TokensWorth = require('../uniswap/tokens-worth');
    const tokensWorth = new TokensWorth();

    // simulate init event
    await tokensWorth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await tokensWorth.onSubscribeForm({
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
    return tokensWorth.onBlocks({
        web3,
        address,
        subscription
    });
}

async function testUniPositionWorth(address, threshold) {

    const PositionWorth = require('../uniswap/position-worth');
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
    console.log(form.find(o => o.id === 'pair'));

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
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
/*

    console.log(await testUniPositionWorth(
        address,
        '90'
    ));
*/


    const tokenAddress = '0x846C66cf71C43f80403B51fE3906B3599D63336f';

    console.log(await testTokensWorth(
        '0x98C3fC24A4A1DCB6010685115d6B5F8EF3F0Cc19',
        tokenAddress,
        "20500",
        false
    ));

}

main();
