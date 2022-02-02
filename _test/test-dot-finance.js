const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));

async function testGetSharesUSDValue(address, vault) {
    const PositionWorth = require('../dot-finance/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    return positionWorth._getSharesUSDValueBN({
            web3,
            address
        },
        vault
    );
}

async function testGetVaultLabel(vault) {
    const PositionWorth = require('../dot-finance/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    return positionWorth._getVaultLabel({
            web3
        },
        vault
    );
}

async function testGetAllUserVaults(address) {
    const PositionWorth = require('../dot-finance/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    return positionWorth._getAllUserVaults({
        web3,
        address
    });
}

async function testOnBlocks(address, threshold) {
    const PositionWorth = require('../dot-finance/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionWorth.onSubscribeForm({
        web3,
        address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        vault: form.find(o => o.id === 'vault').values[0].value,
        threshold: threshold
    };

    return positionWorth.onBlocks({
        web3,
        address,
        subscription
    });
}

async function main() {

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';
    const vaultAddress = '0x70466feb234e3c95b6b63157e2f0ccdcec1253f9';

    console.log('Running manual test:');

    // console.log(await testGetSharesUSDValue(address, vaultAddress));
    console.log(await testGetAllUserVaults(address));
    // console.log(await testGetVaultLabel(vaultaddress));
    console.log(await testOnBlocks(address, "96"));

}

main();
