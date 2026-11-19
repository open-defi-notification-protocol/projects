const Web3 = require("web3");
const web3 = new Web3(require("./dev-keys.json").web3);

async function testSushiPendingRewards(address, minimum) {
  const PendingRewards = require("../sushi/pending-reward");
  const pendingRewards = new PendingRewards();

  // simulate init event
  await pendingRewards.onInit({
    web3,
  });

  // simulate subscribe form event
  const form = await pendingRewards.onSubscribeForm({
    web3,
    address,
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    pair: form.find((o) => o.id === "pair").values[0].value,
    minimum: minimum,
  };

  // simulate on blocks event
  return pendingRewards.onBlocks({
    web3,
    address,
    subscription,
  });
}

async function testSushiPositionWorth(address, threshold) {
  const PositionWorth = require("../sushi/position-worth");
  const positionWorth = new PositionWorth();

  // simulate init event
  await positionWorth.onInit({
    web3,
  });

  // simulate subscribe form event
  const form = await positionWorth.onSubscribeForm({
    web3,
    address,
  });

  // simulate user filling in the subscription form in the app
  const subscription = {
    pair: form.find((o) => o.id === "pair").values[0].value,
    threshold: threshold,
  };

  // simulate on blocks event
  return positionWorth.onBlocks({
    web3,
    address,
    subscription,
  });
}

async function testSushiTVL(poolAddress, threshold, isAbove) {
  const TVL = require("../sushi/tvl-ethereum");
  const tvl = new TVL();

  await tvl.onInit({ web3 });
  const subscription = {
    poolAddress,
    threshold,
    "above-below": isAbove ? "0" : "1",
  };

  return tvl.onBlocks({ web3, poolAddress, subscription });
}

async function main() {
  console.log("Running manual test:");

  console.log(await testSushiTVL("0x397FF1542f962076d0BFE58eA045FfA2d347ACa0", "10000", true));
  console.log(await testSushiTVL("0x06da0fd433c1a5d7a4faa01111c044910a184553", "10000", true));
  console.log(await testSushiTVL("0xceff51756c56ceffca006cd410b03ffc46dd3a58", "10000", true));
  console.log(await testSushiTVL("0xdbb69ea87507525fffbd1c4f1ad6f7d30a9a402e", "100000000", false));

  console.log(await testSushiPendingRewards("0x3dacC571356e7D5dFB3b475d6922442Ec06B9005", "0.01"));
  console.log(await testSushiPositionWorth("0x3dacC571356e7D5dFB3b475d6922442Ec06B9005", "10000"));
}
main();
