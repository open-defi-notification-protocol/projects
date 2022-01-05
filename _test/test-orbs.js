const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testUnlockedCooldown(address) {

    const UnlockCooldown = require('../orbs/unlock-cooldown');
    const unlockCooldown = new UnlockCooldown();

    // simulate init event
    await unlockCooldown.onInit({
        web3
    });

    // simulate on blocks event
    return unlockCooldown.onBlocks({
        web3,
        address: address
    });
}

async function testPendingReward(address, minimum) {

    const PendingReward = require('../orbs/pending-rewards');
    const pendingReward = new PendingReward();

    // simulate init event
    await pendingReward.onInit({
        web3
    });

    // simulate on blocks event
    return pendingReward.onBlocks({
        web3,
        address: "0x3dacC571356e7D5dFB3b475d6922442Ec06B9005",
        subscription: {minimum: minimum}
    });
}

async function main() {

    console.log('Running manual test:');

    console.log(await testUnlockedCooldown('0x3dacC571356e7D5dFB3b475d6922442Ec06B9005'));
    console.log(await testPendingReward('0x3dacC571356e7D5dFB3b475d6922442Ec06B9005', 4));

}

main();
