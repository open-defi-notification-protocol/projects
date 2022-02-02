const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testGetSharesUSDValue(address, vaultaddress) {
    const PositionWorth = require('../kogefarm/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    return positionWorth._getSharesUSDValueBN({
            web3,
            address,
        },
        vaultaddress
    );
}

async function testGetVaultLabel(vaultaddress) {
    const PositionWorth = require('../kogefarm/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    return positionWorth._getVaultLabel({
            web3
        },
        vaultaddress,
        "20"
    );
}

async function testGetAllUserVaults(address) {
    const PositionWorth = require('../kogefarm/position-worth');
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
    const PositionWorth = require('../kogefarm/position-worth');
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
    const vaultAddress = '0x9ea363902D086A4707F71d7AF6Fb91DAf7aE4948';

    console.log('Running manual test:');

    // console.log(await testGetSharesUSDValue(address, vaultAddress));
    console.log(await testGetAllUserVaults('0x16c686a511BdbC697860a4A3284fED9612D21c27'));
    // console.log(await testGetVaultLabel(vaultaddress));
    console.log(await testOnBlocks(address, "86"));
}

main();
