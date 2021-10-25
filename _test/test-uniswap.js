const Web3 = require('web3');
require('dotenv').config();
const web3 = new Web3(process.env.ENDPOINT_HTTPS);



async function testUniswapPositionWorth() {
  const PositionWorth = require('../uniswap/position-worth');
  const positionWorth = new PositionWorth();

  // simulate init event
  await positionWorth.onInit({
  });

  // simulate subscribe form event
  const form = await positionWorth.onSubscribeForm({
    web3,
    address: '0xEcaa8f3636270Ee917C5b08D6324722c2C4951c7'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    pair: form.find(o => o.id === 'pair').values[0].value,
    drop: form.find(o => o.id === 'drop').default
  };

  // simulate on blocks event without drop
  positionWorth.onBlocks({
    web3,
    address: '0xEcaa8f3636270Ee917C5b08D6324722c2C4951c7',
    subscription
  });

  // double initial value to simulate drop in price
  subscription.pair = subscription.pair.split('-')[0] + '-' + subscription.pair.split('-')[1] * 2

  // simulate on blocks event with drop
  return positionWorth.onBlocks({
    web3,
    address: '0xEcaa8f3636270Ee917C5b08D6324722c2C4951c7',
    subscription
  });

}


async function main() {
  console.log('Running manual test:');
  console.log(await testUniswapPositionWorth());
}

main();
