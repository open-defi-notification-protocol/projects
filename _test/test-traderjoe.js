const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').avalanche));

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


async function main() {

    console.log('Running manual test:');

    // borrow limit above threshold (notify)
    console.log("Notification: ", await testTraderJoeLending(
        {
            address: '0x0181c4c3514210d8f33fec7934a888b9574fbb74',//0x343ba440db35997170cc6402692a0803c360c48c',//0xd253c7cc525345922cb1de7824a753d21083dede',
            threshold: 70,
        }
    ));

    // borrow limit below (no notification)
    console.log("Notification: ", await testTraderJoeLending(
        {
            address: '0x0181c4c3514210d8f33fec7934a888b9574fbb74',
            threshold: 80,
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
            threshold: 99.9
        }
    ));

    // collateral with no loan
    console.log("Notification: ", await testTraderJoeLending(
        {
            address: '0xd253c7cc525345922cb1de7824a753d21083dede',
        }
    ));
}

main();
