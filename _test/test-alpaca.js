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
        address
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
        address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        vault: form.find(o => o.id === 'vault').values[0].value,
        threshold: form.find(o => o.id === 'threshold').default
    };

    return positionHealth.onBlocks({
        web3,
        address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0xAD9CADe20100B8b945da48e1bCbd805C38d8bE77';

    console.log(await testGetAllUserVaults(address));

    console.log(await testOnBlocks(address));

}

main();
