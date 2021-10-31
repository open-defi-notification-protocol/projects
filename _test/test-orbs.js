const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testUnlockedCooldown() {
    const UnlockCooldown = require('../orbs/unlock-cooldown');
    const unlockCooldown = new UnlockCooldown();

    // simulate init event
    await unlockCooldown.onInit({
        web3
    });

    // simulate on blocks event
    return unlockCooldown.onBlocks({
        web3,
        address: '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005'
    });
}

async function testPendingReward() {
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
        subscription: {minimum: 1}
    });
}

async function main() {
    console.log('Running manual test:');
    console.log(await testUnlockedCooldown());
    console.log(await testPendingReward());
}

main();
