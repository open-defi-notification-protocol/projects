const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));
const web3Polygon = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testUnlockedCooldown(web3, notificationModule, address, daysBefore) {

    const UnlockCooldown = require('../orbs/' + notificationModule);
    const unlockCooldown = new UnlockCooldown();

    // simulate init event
    await unlockCooldown.onInit({
        web3
    });

    // simulate on blocks event
    return unlockCooldown.onBlocks({
        web3,
        address,
        subscription: {daysBefore: daysBefore}
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

async function testRewardsClaim(web3, notificationModule, address) {

    const RewardsClaim = require('../orbs/' + notificationModule);
    const rewardsClaim = new RewardsClaim();

    // simulate init event
    await rewardsClaim.onInit({
        web3
    });

    // simulate on blocks event
    return rewardsClaim.onBlocks({
        web3,
        address: address,
        subscription: {},
        fromBlock: 29770000,
        toBlock: 29772309
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testUnlockedCooldown(web3, 'unlock-cooldown', address, 14));
    console.log(await testPendingReward(web3, 'pending-rewards', address, 4));

    console.log(await testUnlockedCooldown(web3Polygon, 'unlock-cooldown_polygon', address, 10));
    console.log(await testPendingReward(web3Polygon, 'pending-rewards_polygon', address, 0));

    console.log(await testRewardsClaim(web3Polygon, 'polygon-auto-compound', address))

}

main();
