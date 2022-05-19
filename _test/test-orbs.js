const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));
const web3Polygon = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testUnlockedCooldown(web3, notificationModule, address) {

    const UnlockCooldown = require('../orbs/' + notificationModule);
    const unlockCooldown = new UnlockCooldown();

    // simulate init event
    await unlockCooldown.onInit({
        web3
    });

    // simulate on blocks event
    return unlockCooldown.onBlocks({
        web3,
        address
    });
}

async function testPendingReward(web3, notificationModule, address, minimum) {

    const PendingReward = require('../orbs/' + notificationModule);
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

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testUnlockedCooldown(web3, 'unlock-cooldown', address));
    console.log(await testPendingReward(web3, 'pending-rewards', address, 4));

    console.log(await testUnlockedCooldown(web3Polygon, 'unlock-cooldown_polygon', address));
    console.log(await testPendingReward(web3Polygon, 'pending-rewards_polygon', address, 0));

}

main();
