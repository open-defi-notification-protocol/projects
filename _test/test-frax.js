const Web3 = require('web3');
const PositionHealth = require("../aave/position-health");
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

/**
 *
 * @param address
 * @param minimum
 * @returns {Promise<*>}
 */
async function testPendingRewards(address, minimum) {

    const PendingRewards = require('../frax/pending-reward');
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
        minimum: minimum
    };

    // simulate on blocks event
    return pendingRewards.onBlocks({
        web3,
        address,
        subscription
    });
}

/**
 *
 * @param address
 * @param threshold
 * @returns {Promise<{notification: string}|[]>}
 */
async function testPositionHealth(address, threshold) {

    const PositionHealth = require('../frax/position-health');

    const positionHealth = new PositionHealth();

    // simulate init event
    await positionHealth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionHealth.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        threshold: threshold || form.find(o => o.id === 'threshold').default
    };

    return positionHealth.onBlocks({
        web3,
        address,
        subscription
    });

}

/**
 *
 * @returns {Promise<void>}
 */
async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testPendingRewards(
        address,
        '0.000001'
    ));

    console.log(await testPositionHealth(
        address,
        '70'
    ));

}

main();


