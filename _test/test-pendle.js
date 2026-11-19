const Web3 = require('web3');

async function testPendle(network, fromBlock, toBlock) {

    const providerUrl = require("./dev-keys.json")[`web3${network}`]

    console.log(providerUrl)
    const web3 = new Web3(
        new Web3.providers.HttpProvider(providerUrl)
    );

    const PendleNotification = require(`../pendle/new-market-${network}`);
    const pendleNotification = new PendleNotification();

    // simulate init event
    await pendleNotification.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await pendleNotification.onSubscribeForm({});

    console.log(form);

    // simulate on blocks event
    return pendleNotification.onBlocks({
        web3,
        fromBlock,
        toBlock
    });

}


async function main() {
    console.log(await testPendle("ethereum", 17364256, 17364258));
    console.log(await testPendle("arbitrum", 103714827, 103714829));
    console.log(await testPendle("bsc", 29485024, 29485026));
}

main().catch(console.error);
