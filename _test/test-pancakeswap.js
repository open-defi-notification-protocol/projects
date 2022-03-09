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

async function testPancakeswapPendingRewards(address, minimum) {

    const PendingRewards = require('../pancakeswap/pending-reward');
    const pendingRewards = new PendingRewards();

    // simulate init event
    await pendingRewards.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await pendingRewards.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        minimum: minimum
    };

    // simulate on blocks event
    return pendingRewards.onBlocks({
        web3,
        address,
        subscription
    });
}

async function testPancakeswapSyrupPendingRewards(address, minimum) {

    const SyrupPendingRewards = require('../pancakeswap/syrup-pending-reward');
    const syrupPendingRewards = new SyrupPendingRewards();

    // simulate init event
    await syrupPendingRewards.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await syrupPendingRewards.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        minimum: minimum
    };

    // simulate on blocks event
    return syrupPendingRewards.onBlocks({
        web3,
        address,
        subscription
    });
}

async function testPancakeswapPositionWorth(address, threshold) {

    const PositionWorth = require('../pancakeswap/position-worth');
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
    const tokenAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';

    /*
        console.log(await testTokensWorth(
            address,
            tokenAddress,
            "20500",
            false
        ));

        console.log(await testPancakeswapPendingRewards(
            address,
            '0.000001'
        ));
    */

    console.log(await testPancakeswapSyrupPendingRewards(
        address,
        '0.0000000001'
    ));
    /*
        console.log(await testPancakeswapPositionWorth(
            address,
            '10000'
        ));
    */
}

main();


