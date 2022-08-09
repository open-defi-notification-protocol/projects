const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3cronos));

async function testPositionStoplossLiquidate(address, positionId, fromBlock, toBlock) {

    const PositionStoplossLiquidate = require('../singlefinance/position-stoploss-liquidate');
    const positionStoplossLiquidate = new PositionStoplossLiquidate();

    // simulate init event
    await positionStoplossLiquidate.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionStoplossLiquidate.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        position:positionId
    };

    // simulate on blocks event
    return positionStoplossLiquidate.onBlocks({
        web3,
        address,
        subscription,
        fromBlock,
        toBlock
    });
}

async function main() {

    console.log('Running manual test:');
    console.log(await testPositionStoplossLiquidate('0x71ab29cd0c55ebc0c7c6140401d0ae81a715aac1', '5001', 2913521, 2913522));
}

main();
