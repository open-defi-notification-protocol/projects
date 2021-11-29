const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3Polygon));

async function testGetSharesUSDValue() {
  const PositionWorth = require('../kogefarm/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getSharesUSDValue({
      web3,
      address: '0xa64b93801560c2b47a4e318417e26cdaf08254f7',
    },
    '0x92F42e22D812C0C8ADFC30190faC42919032E19B'
  );
}

async function testGetVaultLabel() {
  const PositionWorth = require('../kogefarm/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getVaultLabel({
      web3
    },
    '0x9ea363902D086A4707F71d7AF6Fb91DAf7aE4948'
  );
}

async function testGetAllUserVaults() {
  const PositionWorth = require('../kogefarm/position-worth');
  const positionWorth = new PositionWorth();

  return positionWorth._getAllUserVaults({
    web3,
    address: '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005'
  });
}

async function testOnBlocks() {
  const PositionWorth = require('../kogefarm/position-worth');
  const positionWorth = new PositionWorth();

  // simulate subscribe form event
  const form = await positionWorth.onSubscribeForm({
    web3,
    address: '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    vault: form.find(o => o.id === 'vault').values[0].value,
    drop: "0"
  };

  return positionWorth.onBlocks({
    web3,
    address: '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005',
    subscription
  });
}

async function main() {
  console.log('Running manual test:');
  // console.log(await testGetSharesUSDValue());
  console.log(await testGetAllUserVaults());
  // console.log(await testGetVaultLabel());
  console.log(await testOnBlocks());
}

main();
