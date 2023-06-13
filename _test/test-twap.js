const Web3 = require('web3');

const address = '';

async function testTwap(address, network, type, fromBlock, toBlock) {

    const providerUrl = require("./dev-keys.json")[`web3${network}`]

    console.log(providerUrl)
    const web3 = new Web3(
        new Web3.providers.HttpProvider(providerUrl)
    );

    const TwapNotification = require(`../twap/twap-${network}-${type}`);
    const twapNotification = new TwapNotification();

    // simulate init event
    await twapNotification.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await twapNotification.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate on blocks event
    return twapNotification.onBlocks({
        web3,
        address,
        subscription: {},
        fromBlock: fromBlock,
        toBlock: toBlock
    });

}

async function main() {
    console.log('Running manual test:');
    console.log(await testTwap(address, "fantom", "all", 51345045, 51623000));
    console.log(await testTwap(address, "polygon", "all", 51345045, 51623000));
    console.log(await testTwap(address, "avalanche", "all", 31278769, 31278770));
    console.log(await testTwap(address, "arbitrum", "all"));
    console.log(await testTwap(address, "bsc", "all"));
    console.log(await testTwap(address, "fantom", "completed"));
    console.log(await testTwap(address, "polygon", "completed"));
    console.log(await testTwap(address, "avalanche", "completed"));
    console.log(await testTwap(address, "arbitrum", "completed"));
    console.log(await testTwap(address, "bsc", "completed"));
}

main().catch(console.error);


