const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testMintyardLowHealth(address, threshold) {
    const LowHealth = require('../lootbridge/low-health');
    const lowHealth = new LowHealth();

    // simulate init event
    await lowHealth.onInit({
        web3
    });

    const subscription = {
        threshold: threshold || form.find(o => o.id === 'threshold').default
    };

    return lowHealth.onBlocks({
        web3,
        address,
        subscription
    });
}

async function main() {
    const address = '0x5f2973680508Ec74f4D83DB2d402De67640768Ce';

    console.log('test low health');
    console.log(await testMintyardLowHealth(
        address,
        "1.1"
    ));

}

main();
