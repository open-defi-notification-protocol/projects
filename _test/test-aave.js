const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testAaveLowHealth() {
  const LowHealth = require('../aave/low-health');
  const lowHealth = new LowHealth();

  // simulate init event
  await lowHealth.onInit({
    web3
  });

  // simulate on blocks event
  return lowHealth.onBlocks({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });
}

async function testAaveSevereLowHealth() {
  const SevereHealth = require('../aave/severe-health');
  const severeHealth = new SevereHealth();

  // simulate init event
  await severeHealth.onInit({
    web3
  });
  
  // simulate on blocks event
  return severeHealth.onBlocks({
    web3, 
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });
}

async function main() {
  console.log('Running manual test:');
  console.log(await testAaveLowHealth());
  console.log(await testAaveSevereLowHealth());
}

main();
