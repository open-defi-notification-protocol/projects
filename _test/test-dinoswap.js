const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

/**
 *
 * @param address
 * @param minimum
 * @returns {Promise<{notification: string}|*[]>}
 */
async function testDinoPendingRewards(address, minimum) {

    const PendingRewards = require('../dinoswap/pending-reward');
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

async function main() {

    console.log('Running manual test:');

    console.log(await testDinoPendingRewards(
        '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005',
        "0"
    ));

}

main();
