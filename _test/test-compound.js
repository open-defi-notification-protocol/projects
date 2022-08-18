const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testVenusLowHealth(address) {
    const LowHealth = require('../compound/low-liquidity');
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

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testVenusLowHealth(
        address
    ));

}

main();
