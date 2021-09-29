const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testGetSharesUSDValue() {
  const PositionWorth = require('../dot-finance/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getSharesUSDValue({
      web3,
      address: '0x975bd5f5de010d385709b8ff8fc439a588ed4bca',
    },
    '0x70466feb234e3c95b6b63157e2f0ccdcec1253f9'
  );
}

async function testGetVaultLabel() {
  const PositionWorth = require('../dot-finance/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getVaultLabel({
      web3
    },
    '0x70466feb234e3c95b6b63157e2f0ccdcec1253f9'
  );
}

async function testGetAllUserVaults() {
  const PositionWorth = require('../dot-finance/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getAllUserVaults({
      web3,
      address: '0x975bd5f5de010d385709b8ff8fc439a588ed4bca'
  });
}

async function testOnBlocks() {
  const PositionWorth = require('../dot-finance/position-worth');
  const positionWorth = new PositionWorth();

  // simulate subscribe form event
  const form = await positionWorth.onSubscribeForm({
    web3,
    address: '0x975bd5f5de010d385709b8ff8fc439a588ed4bca'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    vault: form.find(o => o.id === 'vault').values[0].value,
    drop: form.find(o => o.id === 'drop').default
  };

  return positionWorth.onBlocks({
      web3,
      address: '0x975bd5f5de010d385709b8ff8fc439a588ed4bca',
      subscription
  });
}

async function main() {
  console.log('Running manual test:');
  console.log(await testGetSharesUSDValue());
  console.log(await testGetAllUserVaults());
  console.log(await testGetVaultLabel());
  console.log(await testOnBlocks());
}

main();
