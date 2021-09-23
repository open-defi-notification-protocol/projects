const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testSushiPendingRewards() {
  const PendingRewards = require('../sushi/pending-reward');
  const pendingRewards = new PendingRewards();

  // simulate init event
  await pendingRewards.onInit({
    web3
  });

  // simulate subscribe form event
  const form = await pendingRewards.onSubscribeForm({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    "Pair": form.find(o => o.label === "Pair").values[0].value,
    "Minimum SUSHI": form.find(o => o.label === "Minimum SUSHI").default
  };

  // simulate on blocks event
  return pendingRewards.onBlocks({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
    subscription
  });
}

async function testSushiPositionWorth() {
  const PositionWorth = require('../sushi/position-worth');
  const positionWorth = new PositionWorth();

  // simulate init event
  await positionWorth.onInit({
    web3
  });

  // simulate subscribe form event
  const form = await positionWorth.onSubscribeForm({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    "Pair": form.find(o => o.label === "Pair").values[0].value,
    "Percent Drop": form.find(o => o.label === "Percent Drop").default
  };
  
  // simulate on blocks event
  return positionWorth.onBlocks({
    web3, 
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
    subscription
  });
}

async function testSushiTokenAmount() {
  const TokenAmount = require('../sushi/token-amount');
  const tokenAmount = new TokenAmount();

  // simulate init event
  await tokenAmount.onInit({
    web3
  });

  // simulate subscribe form event
  const form = await tokenAmount.onSubscribeForm({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    "Pair": form.find(o => o.label === "Pair").values[0].value,
    "Percent Drop": form.find(o => o.label === "Percent Drop").default
  };

  // simulate on blocks event
  return tokenAmount.onBlocks({
    web3,
    address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
    subscription
  });
}

async function main() {
  console.log('Running manual test:');
  console.log(await testSushiPendingRewards());
  console.log(await testSushiPositionWorth());
  console.log(await testSushiTokenAmount());
}

main();
