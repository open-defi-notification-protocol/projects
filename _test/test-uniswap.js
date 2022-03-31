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

    let address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testUniPositionWorth(
        address,
        '90'
    ));


    const tokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    address = '0x9257a4bdc6e6de95e1c662bf66583735a779736f';

    console.log(await testTokensWorth(
        address,
        tokenAddress,
        "2000000",
        false
    ));

}

main();
