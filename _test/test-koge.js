const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testGetSharesUSDValue() {
  const PositionWorth = require('../koge/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getSharesUSDValue({
      web3,
      address: '0xa64b93801560c2b47a4e318417e26cdaf08254f7',
    },
    '0x92F42e22D812C0C8ADFC30190faC42919032E19B'
  );
}

async function testGetVaultLabel() {
  const PositionWorth = require('../koge/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getVaultLabel({
      web3
    },
    '0x92F42e22D812C0C8ADFC30190faC42919032E19B'
  );
}

async function testGetAllUserVaults() {
  const PositionWorth = require('../koge/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getAllUserVaults({
      web3,
      address: '0xa64b93801560c2b47a4e318417e26cdaf08254f7'
  });
}

async function testOnBlocks() {
  const PositionWorth = require('../koge/position-worth');
  const positionWorth = new PositionWorth();

  // simulate subscribe form event
  const form = await positionWorth.onSubscribeForm({
    web3,
    address: '0xa64b93801560c2b47a4e318417e26cdaf08254f7'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    "Vault": form.find(o => o.label === "Vault").values[3].value,
    "Percent Drop": form.find(o => o.label === "Percent Drop").default
  };

  return positionWorth.onBlocks({
      web3,
      address: '0xa64b93801560c2b47a4e318417e26cdaf08254f7',
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
