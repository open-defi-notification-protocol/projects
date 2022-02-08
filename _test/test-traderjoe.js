const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3avalanche));

async function testTraderJoeLending(args) {
    const AccountHealth = require('../traderjoe/account-health');
    const accountHealth = new AccountHealth();

    const accountInfo = await accountHealth.fetchAccountLendingInfo(args.address);

    accountInfo.borrowLimit = accountHealth.calcBorrowLimit(accountInfo.health);

    console.log("\n\n########  testTraderJoeLending #######");
    console.log("args: \n", args, "\n");
    console.log("Account info:\n", accountInfo, "\n");

    // simulate init event
    await accountHealth.onInit(args);

    // simulate subscribe form event
    const form = await accountHealth.onSubscribeForm(args);

    console.log("Form: \n", form, "\n");

    // simulate user filling in the subscription form in the app
    args.subscription = {
        'borrow-limit': args['borrow-limit'] ? args['borrow-limit'] : form[0].default
    }

    // simulate on blocks event
    return accountHealth.onBlocks(args);
}

/**
 * testing pending rewards notification
 *
 * @param address
 * @param minimum
 * @returns {Promise<{notification: string}|*[]>}
 */
async function testTraderJoePendingRewards(address, minimum) {

    const PendingRewards = require('../traderjoe/pending-reward');
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
        pool: form.find(o => o.id === 'pool').values[0].value,
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

    /* // borrow limit above threshold (notify)
     console.log("Notification: ", await testTraderJoeLending(
         {
             address: '0x0181c4c3514210d8f33fec7934a888b9574fbb74',//0x343ba440db35997170cc6402692a0803c360c48c',//0xd253c7cc525345922cb1de7824a753d21083dede',
             'borrow-limit': '70',
         }
     ));

     // borrow limit below (no notification)
     console.log("Notification: ", await testTraderJoeLending(
         {
             address: '0x0181c4c3514210d8f33fec7934a888b9574fbb74',
             'borrow-limit': '80',
         }
     ));

     // extreme borrow limit - caution liquidation risk - description
     console.log("Notification: ", await testTraderJoeLending(
         {
             address: '0x0153767a621aae02061380ec465ff91d8d517094',
         }
     ));

     // extreme borrow limit + no notification
     console.log("Notification: ", await testTraderJoeLending(
         {
             address: '0x0153767a621aae02061380ec465ff91d8d517094',
             'borrow-limit': '99.9'
         }
     ));

     // collateral with no loan
     console.log("Notification: ", await testTraderJoeLending(
         {
             address: '0xd253c7cc525345922cb1de7824a753d21083dede',
         }
     ));*/

    console.log(
        await testTraderJoePendingRewards(
            '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005',
            '0.0001'
        )
    );

}

main();
