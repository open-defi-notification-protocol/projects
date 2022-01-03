const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./dev-keys.json').web3));

async function testUniPositionWorth(address, threshold) {

    const PositionWorth = require('../uniswap/position-worth');
    const positionWorth = new PositionWorth();

    // simulate init event
    await positionWorth.onInit({
        web3
    });

    // simulate subscribe form event
    const form = await positionWorth.onSubscribeForm({
        web3,
        address: address
    });

    console.log(form);
    console.log(form.find(o => o.id === 'pair'));

    // simulate user filling in the subscription form in the app
    const subscription = {
        pair: form.find(o => o.id === 'pair').values[0].value,
        threshold: threshold
    };

    // simulate on blocks event
    return positionWorth.onBlocks({
        web3,
        address: address,
        subscription
    });
}

async function main() {

    console.log('Running manual test:');

    console.log(await testUniPositionWorth(
        '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005',
        '90'
    ));

}

main();
