const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

/**
 *
 * @param address
 * @returns {Promise<*>}
 */
async function testStakingUnlocked(address) {

    const StakingUnlocked = require('../curve/staking-unlocked');
    const stakingUnlocked = new StakingUnlocked();

    // simulate init event
    await stakingUnlocked.onInit({
        web3
    });

    // simulate subscribe form event
    await stakingUnlocked.onSubscribeForm({
        web3,
        address
    });

    // simulate on blocks event
    return stakingUnlocked.onBlocks({
        web3,
        address,
        subscription: {}
    });
}

/**
 *
 * @returns {Promise<void>}
 */
async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testStakingUnlocked(
        address
    ));

}

main();


