const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./api-keys.json').bsc));

async function testVenusLowHealth() {
  const LowHealth = require('../venus/low-liquidity');
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
    address: '0x66ccdb83c2b1ed8378956cabe668b60c9c05d9f9' // a random guy with balance
  });
}


async function main() {
  console.log('Running manual test:');
  console.log(await testVenusLowHealth());
}

main();
