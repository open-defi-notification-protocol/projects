const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(require('./dev-keys.json').web3)
);

/**
 *
 * @param address
 * @param minimum
 * @returns {Promise<*>}
 */
async function testPendingReward(address, minimum) {

    const PendingRewards = require('../stake-dao/pending-reward');
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
        gauge: form.find(o => o.id === 'gauge').values[0].value,
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

    console.log(
        await testPendingReward(
            "0x3dacC571356e7D5dFB3b475d6922442Ec06B9005",
            "0.0000001"
        )
    );
}

main();
