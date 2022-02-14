const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));

async function testRevaultPendingRewards(args) {
    const PendingRewards = require('../revault/pending-reward');
    const pendingReward = new PendingRewards();

    // simulate init event
    await pendingReward.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await pendingReward.onSubscribeForm({
        web3,
        address: args.address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pool: args.pid,
        threshold: args.threshold,
    };

    // simulate on blocks event
    return pendingReward.onBlocks({
        web3,
        address: args.address,
        subscription
    });
}


async function testRevaultStakingUnlock(args) {

    const StakingUnlock = require('../revault/staking-unlock');

    const stakingUnlock = new StakingUnlock();

    // simulate init event
    await stakingUnlock.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await stakingUnlock.onSubscribeForm({
        web3,
        address: args.address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pool: args.pid
    };

    // simulate on blocks event
    return stakingUnlock.onBlocks({
        web3,
        address: args.address,
        subscription
    });
}


/*

async function testRevaultChangeStrategy() {
    const ChangeStrategy = require('../revault/change-strategy');
    const changeStrategy = new ChangeStrategy();

    // simulate init event
    await changeStrategy.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await changeStrategy.onSubscribeForm({
        web3,
        address: '0x0672c5B9BDd5b5c4dE0C80a449d2f1b2779455Ce'
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        strategy: form.find(o => o.id === 'strategy').values[0].value
    };

    // simulate on blocks event
    return changeStrategy.onBlocks({
        web3,
        address: '0x0672c5B9BDd5b5c4dE0C80a449d2f1b2779455Ce',
        subscription
    });
}

*/


async function main() {

    console.log('Running manual test:');

    console.log(await testRevaultPendingRewards(
        {
            address:'0x825c9b788f475F17E2Cbfcc200de8dBd0ea3D68D',
            pid:"0",
            threshold: "807",
        }
    ));

    console.log(await testRevaultPendingRewards(
        {
            address:'0xc38F405bF48a6eEA9cCE578235A6D8c4DE0Ef60f',
            pid:"3",
            threshold: "1909",
        }
    ));

    console.log(await testRevaultStakingUnlock(
        {
            address:'0xc38F405bF48a6eEA9cCE578235A6D8c4DE0Ef60f',
            pid:"3",
        }
    ));

    console.log(await testRevaultStakingUnlock(
        {
            address:'0xc38F405bF48a6eEA9cCE578235A6D8c4DE0Ef60f',
            pid:"0",
        }
    ));

}

main();

//
//
// (async () => {
//
//     // Get user vault id = 2
//     const userVault = vaults.find(v => parseInt(v.additionalData.vid) === 2);
//
//     const promises = vaults.filter(v => v.depositTokenSymbol === userVault.depositTokenSymbol).map(v => getApy(v.additionalData.vid));
//
//     const result = await Promise.all(promises);
//
//     console.log(result);
//
// })();
