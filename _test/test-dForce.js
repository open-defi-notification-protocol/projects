const Web3 = require('web3');
const networks = require('./api-keys.json');
const address = "0x6e1C24586d0DFEB608E0442a8A1Ce772afEC03a6";

async function testdForce(address, network) {
	const LowHealth = require(`../dForce/low-liquidity_${network}`);
	const lowHealth = new LowHealth();

    const web3 = new Web3(new Web3.providers.HttpProvider(networks[network]));

    // simulate init event
    await lowHealth.onInit({
        web3
    });

    // simulate on blocks event
    const form = await lowHealth.onSubscribeForm({address});

    console.log(form);

    return lowHealth.onBlocks({
        web3,
        subscription: {
            minLiquidity: '10'
        },
        address: address
    });
}

async function main() {
	console.log('Running manual test:');
	console.log(await testdForce(address, "arbitrum"));
	console.log(await testdForce(address, "bsc"));
	console.log(await testdForce(address, "ethereum"));
	console.log(await testdForce(address, "polygon"));
}

main().catch(console.error);
