const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testDinoPendingRewards(address) {
    const PendingRewards = require('../dinoswap/pending-reward');
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

async function testDinoPositionWorth(address) {
    const PositionWorth = require('../dinoswap/position-worth');
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

async function testDinoTokenAmount(address) {
    const TokenAmount = require('../dinoswap/token-amount');
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
    console.log(await testDinoPendingRewards('0x74040b0f71568251908b09d0d6943088a206e0fd'));
    console.log(await testDinoPositionWorth('0x74040b0f71568251908b09d0d6943088a206e0fd'));
    console.log(await testDinoTokenAmount('0x74040b0f71568251908b09d0d6943088a206e0fd'));
}

main();
