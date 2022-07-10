const Web3 = require('web3');
const web3bsc = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));
const web3fantom = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3fantom));
const CacheService = require('./cache-service');

async function testGetAllUserVaults(web3, notificationModule, address) {
    const PositionHealth = require('../alpaca/' + notificationModule);
    const positionHealth = new PositionHealth();

    // simulate init event
    await positionHealth.onInit({
        web3
    });

    const web3Cache = CacheService.initWeb3Cache();

    return positionHealth._getAllUserVaults({
        web3,
        web3Cache,
        address
    });
}

async function testOnBlocks(web3, notificationModule, address, threshold) {
    const PositionHealth = require('../alpaca/' + notificationModule);
    const positionHealth = new PositionHealth();

    // simulate init event
    await positionHealth.onInit({
        web3
    });

    const web3Cache = CacheService.initWeb3Cache();

    // simulate subscribe form event
    const form = await positionHealth.onSubscribeForm({
        web3,
        web3Cache,
        address
    });

    // simulate user filling in the subscription form in the app
    const subscription = {
        vault: form.find(o => o.id === 'vault').values[0].value,
        threshold: threshold || form.find(o => o.id === 'threshold').default
    };

    return positionHealth.onBlocks({
        web3,
        web3Cache,
        address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    let address = '0xAD9CADe20100B8b945da48e1bCbd805C38d8bE77';

    console.log(await testGetAllUserVaults(web3bsc, 'position-health', address));
    console.log(await testOnBlocks(web3bsc, 'position-health', address, 97));

    address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testGetAllUserVaults(web3fantom, 'position-health_fantom', address));
    console.log(await testOnBlocks(web3fantom, 'position-health_fantom', address, 97));

}

main();
