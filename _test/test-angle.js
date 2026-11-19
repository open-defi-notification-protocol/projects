const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(require('./dev-keys.json').web3)
);

/**
 *
 * @param address
 * @param threshold
 * @returns {Promise<{notification: string}|*[]>}
 */
async function testAngleLowHealth(address, threshold) {
    const PositionHealth = require('../angle/position-health');
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

    console.log(form)

    // simulate user filling in the subscription form in the app
    const subscription = {
        vault: form.find(o => o.id === 'vault').values[0].value,
        threshold: threshold || form.find(o => o.id === 'threshold').default
    };

    return positionHealth.onBlocks({
        web3,
        address,
        subscription
    });

}

async function main() {
    console.log('Running manual test:');

    console.log(
        await testAngleLowHealth(
            '0x3dacc571356e7d5dfb3b475d6922442ec06b9005',
            1.2
        )
    );
}

main();
