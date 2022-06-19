const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3bsc));

/**
 *
 * @param address
 * @param tokenAddress
 * @param threshold
 * @param above
 * @returns {Promise<{notification: string, uniqueId: string}|[]>}
 */
async function testTokensWorth(address, tokenAddress, threshold, above) {
    const TokensWorth = require('../pancakeswap/tokens-worth');
    const worth = new TokensWorth();

    // simulate init event
    await worth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await worth.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        'above-below': above ? '0' : '1',
        tokenAddress: tokenAddress,
        threshold: threshold
    };

    // simulate on blocks event
    return worth.onBlocks({
        web3,
        address,
        subscription
    });
}

/**
 *
 * @param address
 * @param minimum
 * @param v2
 * @returns {Promise<*>}
 */
async function testPancakeswapPendingRewards(address, minimum, v2) {

    const PendingRewards = require('../pancakeswap/pending-reward' + (v2 ? '-v2' : ''));
    const pendingRewards = new PendingRewards();

    // simulate init event
    await pendingRewards.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await pendingRewards.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        minimum: minimum
    };

    // simulate on blocks event
    return pendingRewards.onBlocks({
        web3,
        address,
        subscription
    });
}

/**
 *
 * @param address
 * @param minimum
 * @param v2
 * @returns {Promise<*>}
 */
async function testPancakeswapSyrupPendingRewards(address, minimum, v2) {

    const SyrupPendingRewards = require('../pancakeswap/syrup-pending-reward' + (v2 ? '-v2' : ''));
    const syrupPendingRewards = new SyrupPendingRewards();

    // simulate init event
    await syrupPendingRewards.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await syrupPendingRewards.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        minimum: minimum
    };

    // simulate on blocks event
    return syrupPendingRewards.onBlocks({
        web3,
        address,
        subscription
    });
}

/**
 *
 * @param address
 * @param threshold
 * @param v2
 * @returns {Promise<*>}
 */
async function testPancakeswapPositionWorth(address, threshold, v2) {

    const PositionWorth = require('../pancakeswap/position-worth' + (v2 ? '-v2' : ''));
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionWorth.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        threshold: threshold
    };

    // simulate on blocks event
    return positionWorth.onBlocks({
        web3,
        address,
        subscription
    });
}

/**
 *
 * @param address
 * @param poolAddress
 * @param above
 * @param threshold
 * @returns {Promise<*>}
 */
async function testPancakeswapTVLWorth(address, poolAddress, above, threshold) {

    const TVLWorth = require('../pancakeswap/tvl');
    const tvlWorth = new TVLWorth();

    // simulate init event
    await tvlWorth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await tvlWorth.onSubscribeForm({
        web3,
        address
    });

    console.log(form);

    // simulate user filling in the subscription form in the app
    const subscription = {
        poolAddress: poolAddress,
        'above-below': above ? '0' : '1',
        threshold: threshold
    };

    // simulate on blocks event
    return tvlWorth.onBlocks({
        web3,
        address,
        subscription
    });
}

/**
 *
 * @returns {Promise<void>}
 */
async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';
    const tokenAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';

    /* console.log(await testTokensWorth(
         address,
         tokenAddress,
         "20500",
         false
     ));

     */

    /*console.log(await testPancakeswapPendingRewards(
        address,
        '0.0'
    ));

    console.log(await testPancakeswapPendingRewards(
        address,
        '0.0',
        true
    ));

    console.log(await testPancakeswapSyrupPendingRewards(
        address,
        '0.0000000001'
    ));

    console.log(await testPancakeswapSyrupPendingRewards(
        address,
        '0.0000000001',
        true
    ));

      console.log(await testPancakeswapPositionWorth(
          address,
          '10000'
      ));

      console.log(await testPancakeswapPositionWorth(
          address,
          '10000',
          true
      ));

       */

    console.log(await testPancakeswapTVLWorth(
        address,
        '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
        true,
        '10000'
    ));

}

main();


