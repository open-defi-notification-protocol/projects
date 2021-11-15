const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testQiuckPendingRewards(address) {
    const PendingRewards = require('../quickswap/pending-reward');
    const pendingRewards = new PendingRewards();

    // simulate init event
    await pendingRewards.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await pendingRewards.onSubscribeForm({
        web3,
        address: address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        minimum: form.find(o => o.id === 'minimum').default
    };

    // simulate on blocks event
    return pendingRewards.onBlocks({
        web3,
        address: address,
        subscription
    });
}

async function testQiuckPositionWorth(address) {
    const PositionWorth = require('../quickswap/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionWorth.onSubscribeForm({
        web3,
        address: address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        drop: form.find(o => o.id === 'drop').default
    };

    // simulate on blocks event
    return positionWorth.onBlocks({
        web3,
        address: address,
        subscription
    });
}

async function testQiuckTokenAmount(address) {
    const TokenAmount = require('../quickswap/token-amount');
    const tokenAmount = new TokenAmount();

    // simulate init event
    await tokenAmount.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await tokenAmount.onSubscribeForm({
        web3,
        address: address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        drop: form.find(o => o.id === 'drop').default
    };

    // simulate on blocks event
    return tokenAmount.onBlocks({
        web3,
        address: address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testQiuckPendingRewards(address));
    console.log(await testQiuckPositionWorth(address));
    console.log(await testQiuckTokenAmount(address));

}

main();


