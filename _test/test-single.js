const Web3 = require('web3');
const ABIs = require("../sushi/abis.json");
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3cronos));

async function testOnBlocks(web3, notificationModule, address, threshold) {

    const contract = new web3.eth.Contract(ABIs.erc20, "0x0804702a4E749d39A35FDe73d1DF0B1f1D6b8347");

    for (let i = 0; i < 1; i++) {
        const x = await contract.methods.decimals().call()
        console.log(x)

    }

}

async function main() {

    console.log('Running manual test:');

    let address = '0xAD9CADe20100B8b945da48e1bCbd805C38d8bE77';

    console.log(await testOnBlocks(web3, 'position-health', address, 17));

}

main();
