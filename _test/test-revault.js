const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));
const web3Fantom = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3fantom));

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

async function testRevaultVaultPendingRewards_fantom(args) {
    const VaultPendingRewards_fantom = require('../revault/vault-pending-reward_fantom');
    const vaultPendingRewards_fantom = new VaultPendingRewards_fantom();

    // simulate init event
    await vaultPendingRewards_fantom.onInit({
        web3: web3Fantom
    });

    // simulate subscribe form event
    const form = await vaultPendingRewards_fantom.onSubscribeForm({
        web3: web3Fantom,
        address: args.address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        "vault-deposit-token": args.depositTokenAddress,
        minimum: args.minimum,
    };

    // simulate on blocks event
    return vaultPendingRewards_fantom.onBlocks({
        web3: web3Fantom,
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

async function testRevaultChangeStrategy(address) {
    const ChangeStrategy = require('../revault/change-strategy');
    const changeStrategy = new ChangeStrategy();

    // simulate init event
    await changeStrategy.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await changeStrategy.onSubscribeForm({
        web3,
        address: address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        strategy: form.find(o => o.id === 'strategy').values[0].value
    };

    // simulate on blocks event
    return changeStrategy.onBlocks({
        web3,
        address: address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    /* console.log(await testRevaultPendingRewards(
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

     console.log(await testRevaultChangeStrategy(
         '0x0672c5B9BDd5b5c4dE0C80a449d2f1b2779455Ce'
     ));
 */
    console.log(await testRevaultVaultPendingRewards_fantom(
        {
            address: '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005',
            depositTokenAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
            minimum: "0.0001",
        }
    ));

}

main();

