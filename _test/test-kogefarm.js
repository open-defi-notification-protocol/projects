const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testGetSharesUSDValue(address, vaultaddress) {
    const PositionWorth = require('../kogefarm/position-worth');
    const positionWorth = new PositionWorth();

    return positionWorth._getSharesUSDValue({
            web3,
            address: address,
        },
        vaultaddress
    );
}

async function testGetVaultLabel(vaultaddress) {
    const PositionWorth = require('../kogefarm/position-worth');
    const positionWorth = new PositionWorth();

    return positionWorth._getVaultLabel({
            web3
        },
        vaultaddress
    );
}

async function testGetAllUserVaults(address) {
    const PositionWorth = require('../kogefarm/position-worth');
    const positionWorth = new PositionWorth();

    return positionWorth._getAllUserVaultsAndInitialInfoMap({
        web3,
        address: address
    });
}

async function testOnBlocks(address) {
    const PositionWorth = require('../kogefarm/position-worth');
    const positionWorth = new PositionWorth();

    // simulate subscribe form event
    const form = await positionWorth.onSubscribeForm({
        web3,
        address: address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        vault: form.find(o => o.id === 'vault').values[0].value,
        initialInfoMap: form.find(o => o.id === 'initialInfoMap').value,
        drop: "0"
    };

    return positionWorth.onBlocks({
        web3,
        address: address,
        subscription
    });
}

async function main() {

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';
    const vaultAddress = '0x9ea363902D086A4707F71d7AF6Fb91DAf7aE4948';

    console.log('Running manual test:');

    console.log(await testGetSharesUSDValue(address, vaultAddress));
    console.log(await testGetAllUserVaults(address));
    console.log(await testGetVaultLabel(vaultaddress));
    console.log(await testOnBlocks(address));
}

main();
