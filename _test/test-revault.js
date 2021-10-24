const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./api-keys.json').bsc));

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


async function main() {
    console.log('Running manual test:');
    console.log(await testRevaultChangeStrategy());
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