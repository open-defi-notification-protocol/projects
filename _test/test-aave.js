const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

/**
 *
 * @param address
 * @param threshold
 * @returns {Promise<{notification: string}|[]>}
 */
async function testAavePisitionHealth(address, threshold) {
    const PositionHealth = require('../aave/position-health');
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
        threshold: threshold || form.find(o => o.id === 'threshold').default
    };

    return positionHealth.onBlocks({
        web3,
        address,
        subscription
    });

}

async function main() {

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log('Running manual test:');
    console.log(await testAavePisitionHealth(
        address,
        2
    ));

}

main();
