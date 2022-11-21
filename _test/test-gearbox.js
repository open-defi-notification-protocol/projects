const Web3 = require('web3');
const web3 = new Web3(
  new Web3.providers.HttpProvider(require('./dev-keys.json').web3avalanche)
);

/**
 *
 * @param address
 * @returns {Promise<{notification: string}|*[]>}
 */
async function testGearboxLowHealth(address) {
  const MaxTapRewards = require('../gearbox/position-health');
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
    await testGearboxLowHealth(
      '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005'
    )
  );
}

main();
