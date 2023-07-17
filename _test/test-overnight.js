const Web3 = require('web3');

async function testPayout(network, fromBlock, toBlock) {

    const providerUrl = require("./dev-keys.json")[`web3${network}`]

    console.log(providerUrl)
    const web3 = new Web3(
        new Web3.providers.HttpProvider(providerUrl)
    );

    const PayoutNotification = require(`../overnight/payout-${network}`);
    const payoutNotification = new PayoutNotification();

    // simulate init event
    await payoutNotification.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await payoutNotification.onSubscribeForm({});

    console.log(form);

    // simulate on blocks event
    return payoutNotification.onBlocks({
        web3,
        fromBlock,
        toBlock
    });

}

async function testStrategy(network, fromBlock, toBlock) {

    const providerUrl = require("./dev-keys.json")[`web3${network}`]

    console.log(providerUrl)
    const web3 = new Web3(
        new Web3.providers.HttpProvider(providerUrl)
    );

    const StrategyNotification = require(`../overnight/strategy-${network}`);
    const strategyNotification = new StrategyNotification();

    // simulate init event
    await strategyNotification.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await strategyNotification.onSubscribeForm({});

    const subscription = {
        strategy: form.find(o => o.id === 'strategy').values[0].value,
    };

    console.log(form);

    // simulate on blocks event
    return strategyNotification.onBlocks({
        web3,
        fromBlock,
        toBlock,
        subscription
    });

}

async function main() {
    console.log(await testPayout("polygon", 44310537, 44310539));
    console.log(await testPayout("arbitrum", 105599013, 105599015));
    console.log(await testPayout("bsc", 29481287, 29481289));
    console.log(await testPayout("optimism", 106155876, 106155878));
    // console.log(await testPayout("zksync", 730251, 730253));

    console.log(await testStrategy("polygon", 44512809, 44512809));
    console.log(await testStrategy("arbitrum", 110392139, 110392141));
    console.log(await testStrategy("bsc", 29875608, 29875608));
    console.log(await testStrategy("optimism", 106777666, 106777666));
    // console.log(await testStrategy("zksync", 2279899, 2279899));
}


main().catch(console.error);


