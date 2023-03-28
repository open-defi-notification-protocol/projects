const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./api-keys.json').bsc));

async function testdForceLowHealth(address) {
    const LowHealth = require('../dForce/low-liquidity_bsc');
    const lowHealth = new LowHealth();

    // simulate init event
    await lowHealth.onInit({
        web3
    });

    // simulate on blocks event
    const form = await lowHealth.onSubscribeForm({address});

    console.log(form);

    return lowHealth.onBlocks({
        web3,
        subscription: {
            minLiquidity: '10'
        },
        address: address
    });
}


async function main() {

    console.log('Running manual test:');

    const address = '0x6e1C24586d0DFEB608E0442a8A1Ce772afEC03a6';

    console.log(await testdForceLowHealth(
        address
    ));

}

main();
