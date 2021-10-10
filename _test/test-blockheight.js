const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testBlockHeightMatch() {
  const BlockHeight = require('../compound/block-height');
  const blockHeight = new BlockHeight();

  // simulate subscribe form event
  const form = await blockHeight.onSubscribeForm({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    height: form.find(o => o.id === 'height').default.toString()
  };

  // simulate on blocks event
  return blockHeight.onBlocks({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
    fromBlock: parseInt(subscription['height']) - 10,
    toBlock: parseInt(subscription['height']) + 10,
    subscription
  });
}

async function testBlockHeightNoMatch() {
  const BlockHeight = require('../compound/block-height');
  const blockHeight = new BlockHeight();

  // simulate subscribe form event
  const form = await blockHeight.onSubscribeForm({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    height: form.find(o => o.id === 'height').default.toString()
  };

  // simulate on blocks event
  return blockHeight.onBlocks({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
    fromBlock: parseInt(subscription['height']) - 20,
    toBlock: parseInt(subscription['height']) - 10,
    subscription
  });
}

async function main() {
  console.log('Running manual test:');
  console.log(await testBlockHeightMatch());
  console.log(await testBlockHeightNoMatch());
}

main();
