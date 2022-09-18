const Web3 = require('web3');
const web3 = new Web3(
  new Web3.providers.HttpProvider(require('./api-keys.json').avalanche)
);

/**
 *
 * @param address
 * @param minimum
 * @returns {Promise<{notification: string}|*[]>}
 */
async function testSplassiveMaxTapRewards(address) {
  const MaxTapRewards = require('../splassive/the-tap-max-rewards');
  const maxTapRewards = new MaxTapRewards();

  // simulate init event
  await maxTapRewards.onInit({
    web3,
  });

  // simulate subscribe form event
  const form = await maxTapRewards.onSubscribeForm({
    web3,
    address,
  });

  console.log(form);

  // simulate user filling in the subscription form in the app
  const subscription = {
    // pair: form.find((o) => o.id === 'pair').values[0].value,
    // minimum: minimum,
  };

  // simulate on blocks event
  return maxTapRewards.onBlocks({
    web3,
    address,
    subscription,
  });
}

async function main() {
  console.log('Running manual test:');

  console.log(
    await testSplassiveMaxTapRewards(
      '0xF8ac28024CcE1C780dEbEc00d10F5F0376F651DB'
    )
  );
}

main();
