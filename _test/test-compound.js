const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./api-keys.json').ethereum));

async function testVenusLowHealth() {
  const LowHealth = require('../compound/low-liquidity');
  const lowHealth = new LowHealth();

  // simulate init event
  await lowHealth.onInit({
    web3
  });

  // simulate on blocks event
  let toBlock = await web3.eth.getBlockNumber();
  return lowHealth.onBlocks({
    web3,
    toBlock: toBlock,
    fromBlock: toBlock - 20,
    subscription: {
      minLiquidity: '600'
    },
    address: '0xde98e2e11cbb85486a844ed593fb0110f694d99a' // a random guy with balance
  });
}


async function main() {
  console.log('Running manual test:');
  console.log(await testVenusLowHealth());
}

main();
