const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));

/**
 * testing pending rewards notification
 *
 */
async function testLiquidation(address, closedPositionKey) {

    const Liquidation = require('../level/liquidation');
    const liquidation = new Liquidation();

    // simulate init event
    await liquidation.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await liquidation.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate on blocks event
    return liquidation.onBlocks({
        web3,
        address,
        subscription: {
            position: closedPositionKey
        },
        fromBlock: 28280169,
        toBlock: 28284169
    });

}


async function main() {

    console.log('Running manual test:');

    console.log(
        await testLiquidation(
            '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005',
            '0xb0bfca8fbee0bcc76bce0010264b9826bbfefd1a3684df653c5a5bcb9536546f'
        )
    );

}

main();
