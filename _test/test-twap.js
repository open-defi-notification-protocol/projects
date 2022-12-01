const Web3 = require('web3');
const web3 = new Web3("");
const address = '';

async function testTwap(address, network, type) {

	const TwapNotification = require(`../twap/twap-${network}-${type}`);
	const twapNotification = new TwapNotification();

	// simulate init event
	await twapNotification.onInit({
		web3
	});

	// simulate subscribe form event
	const form = await twapNotification.onSubscribeForm({
		web3,
		address
	});

	console.log(form);

	// simulate on blocks event
	return twapNotification.onBlocks({
		web3,
		address,
		subscription: {},
		fromBlock: 51345045,
		toBlock: 51623000
	});

}

async function main() {
	console.log('Running manual test:');
	console.log(await testTwap(address, "fantom", "all"));
	console.log(await testTwap(address, "polygon", "all"));
	console.log(await testTwap(address, "avalanche", "all"));
	console.log(await testTwap(address, "fantom", "completed"));
	console.log(await testTwap(address, "polygon", "completed"));
	console.log(await testTwap(address, "avalanche", "completed"));
}

main().catch(console.error);


