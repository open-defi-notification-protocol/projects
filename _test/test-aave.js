const Web3 = require("web3");

async function testV2(network, fromBlock, toBlock, address, threshold) {
  const providerUrl = require("./dev-keys.json")[`web3${network}`];

  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

  const V2Notification = require(`../aave/hf-aave-v2-${network}`);
  const v2Notification = new V2Notification();

  // simulate init event
  await v2Notification.onInit({
    web3,
  });

  // simulate subscribe form event
  const form = await v2Notification.onSubscribeForm({ address, subscription: { threshold } });

  console.log(form);

  // simulate on blocks event
  return v2Notification.onBlocks({
    web3,
    fromBlock,
    toBlock,
    address,
    subscription: { threshold },
  });
}

async function testV3(network, fromBlock, toBlock, address, threshold) {
  const providerUrl = require("./dev-keys.json")[`web3${network}`];

  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

  const V3Notification = require(`../aave/hf-aave-v3-${network}`);
  const v3Notification = new V3Notification();

  // simulate init event
  await v3Notification.onInit({
    web3,
  });

  // simulate subscribe form event
  const form = await v3Notification.onSubscribeForm({ address, subscription: { threshold } });

  console.log(form);

  // simulate on blocks event
  return v3Notification.onBlocks({
    web3,
    fromBlock,
    toBlock,
    address,
    subscription: { threshold },
  });
}

async function main() {
  console.log(await testV2("ethereum", 19757062, 19758062, "0xc94680947CF2114ec8eE43725898EAA7269a98c5", 2));
  console.log(await testV2("polygon", 56371996, 56372996, "0x91746d6f9DF58B9807a5BB0e54e4EA86600c2DBa", 2));
  console.log(await testV2("avalanche", 44797808, 44798808, "0xfA36b06e5198F07FC1F57B8424273c41390628E4", 6));

  console.log(await testV3("ethereum", 19757062, 19758062, "0xe40d278afD00E6187Db21ff8C96D572359Ef03bf", 2));
  console.log(await testV3("polygon", 56371996, 56372996, "0x7FccD22712c2E593de30a9806D3b72B2aD9eab15", 2));
  console.log(await testV3("avalanche", 44797808, 44797808, "0xCc5B1feF95f632c4A25f95ad88bFe12f928D04cB", 2));
  console.log(await testV3("optimism", 119382333, 119383333, "0x790c9422839FD93a3A4E31e531f96cC87F397c00", 3));
  console.log(await testV3("metis", 16844265, 16845265, "0xa7bf267a672E3cd2664E73a1A882DE33CDFe49d9", 2));
  console.log(await testV3("bnb", 38273370, 38274370, "0x349cFcBd653A124821D6Ada36887d38309A7B6eB", 2));
  console.log(await testV3("base", 13786893, 13787893, "0xaf7274d75217ca23d986f2aea6ad9d74a8fd00d5", 2));
}

main().catch(console.error);
