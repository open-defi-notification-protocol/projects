const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));

async function testGetAllUserVaults(address) {
    const PositionHealth = require('../alpaca/position-health');
    const positionHealth = new PositionHealth();

    // simulate init event
    await positionHealth.onInit({
        web3
    });

    return positionHealth._getAllUserVaults({
        web3,
        address: address
    });
}

async function testOnBlocks(address) {
    const PositionHealth = require('../alpaca/position-health');
    const positionHealth = new PositionHealth();

    // simulate init event
    await positionHealth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionHealth.onSubscribeForm({
        web3,
        address: address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        vault: form.find(o => o.id === 'vault').values[0].value,
        threshold: form.find(o => o.id === 'threshold').default
    };

    return positionHealth.onBlocks({
        web3,
        address: address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x98C3fC24A4A1DCB6010685115d6B5F8EF3F0Cc19';

    console.log(await testGetAllUserVaults(address));

    console.log(await testOnBlocks(address));

}

main();
