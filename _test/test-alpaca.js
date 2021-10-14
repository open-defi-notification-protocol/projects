const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testGetHealthFactor() {
  const PositionHealth = require('../alpaca/position-health');
  const positionHealth = new PositionHealth();

  return positionHealth._getHealthFactor({
      web3
    },
    '0x08fc9ba2cac74742177e0afc3dc8aed6961c24e7',
    3000
  );
}

async function testGetVaultLabel() {
  const PositionHealth = require('../alpaca/position-health');
  const positionHealth = new PositionHealth();

  return positionHealth._getVaultLabel({
      web3
    },
    '0x08fc9ba2cac74742177e0afc3dc8aed6961c24e7'
  );
}

async function testGetAllUserVaults() {
  const PositionHealth = require('../alpaca/position-health');
  const positionHealth = new PositionHealth();

  return positionHealth._getAllUserVaults({
      web3,
      address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });
}

async function testOnBlocks() {
  const PositionHealth = require('../alpaca/position-health');
  const positionHealth = new PositionHealth();
  // simulate subscribe form event
  const form = await positionHealth.onSubscribeForm({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    vault: form.find(o => o.id === 'vault').values[0].value,
    health: form.find(o => o.id === 'health').default
  };

  return positionHealth.onBlocks({
      web3,
      address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
      subscription
  });
}

async function main() {
  console.log('Running manual test:');
  console.log(await testGetHealthFactor());
  console.log(await testGetAllUserVaults());
  console.log(await testGetVaultLabel());
  console.log(await testOnBlocks());
}

main();
