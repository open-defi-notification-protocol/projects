const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testQuickPendingRewards(address, minimum) {
    const PendingRewards = require('../quickswap/pending-reward');
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
        minimum
    };

    // simulate on blocks event
    return pendingRewards.onBlocks({
        web3,
        address,
        subscription
    });
}

async function testQuickPositionWorth(address, threshold, customPoolAddress) {

    const PositionWorth = require('../quickswap/position-worth');
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
        pair: customPoolAddress ? null : form.find(o => o.id === 'pair').values[2].value,
        threshold: threshold,
        customPoolAddress: customPoolAddress
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

    // console.log(await testQuickPendingRewards(address, "0.000001"));

    console.log(await testQuickPositionWorth(address, "25000", "0x57fd1e87cc7616f2b086b3912bce3cf9fee36256"));

}

main();


