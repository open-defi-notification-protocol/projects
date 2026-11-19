const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3arbitrum));

/**
 * testing pending rewards notification
 *
 */
async function testMarketCreated() {

    const MarketCreated = require('../y2k/market-created');
    const marketCreated = new MarketCreated();

    // simulate init event
    await marketCreated.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await marketCreated.onSubscribeForm({
        web3
    });

    console.log(form);

    // simulate on blocks event
    return marketCreated.onBlocks({
        web3,
        fromBlock:74015797,
        toBlock:76540287
    });
}

/**
 * testing pending rewards notification
 *
 */
async function testEpochCreated() {

    const EpochCreated = require('../y2k/epoch-created');
    const epochCreated = new EpochCreated();

    // simulate init event
    await epochCreated.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await epochCreated.onSubscribeForm({
        web3
    });

    console.log(form);

    // simulate on blocks event
    return epochCreated.onBlocks({
        web3,
        fromBlock:74015797,
        toBlock:76540287
    });
}

async function main() {

    console.log('Running manual test:');

    console.log(
        await testEpochCreated()
    );

    console.log(
        await testMarketCreated()
    );

}

main();
