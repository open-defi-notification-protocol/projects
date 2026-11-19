const Web3 = require('web3');
const web3s = {
    ethereum: new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3)),
    fantom: new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3fantom)),
    avalanche: new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3avalanche)),
    arbitrum: new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Arbitrum)),
    polygon: new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon)),
    bsc: new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc)),
    cronos: new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3cronos))
}


async function testWalletBalance(networkName, address, above, threshold) {

    const WalletBalance = require('../common/wallet-balance-' + networkName);

    const walletBalance = new WalletBalance();

    const web3 = web3s[networkName]

    // simulate init event
    await walletBalance.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await walletBalance.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        'above-below': above ? '0' : '1',
        threshold: threshold
    };

    // simulate on blocks event
    return walletBalance.onBlocks({
        web3,
        address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    let address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

        console.log(await testWalletBalance(
            'ethereum',
            address,
            true,
            '0.0001'
        ));

        console.log(await testWalletBalance(
            'fantom',
            address,
            true,
            '0.0001'
        ));

        console.log(await testWalletBalance(
            'avalanche',
            address,
            true,
            '0.0001'
        ));

        console.log(await testWalletBalance(
            'arbitrum',
            address,
            true,
            '0.0001'
        ));

        console.log(await testWalletBalance(
            'polygon',
            address,
            true,
            '0.0001'
        ));

        console.log(await testWalletBalance(
            'bsc',
            address,
            true,
            '0.0001'
        ));

    console.log(await testWalletBalance(
        'cronos',
        address,
        true,
        '0.0001'
    ));

}

main();
