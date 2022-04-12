async function testWowswapAPY(address) {

    const APY = require('../wowswap/apy');

    const apy = new APY();

    // simulate init event
    await apy.onInit();

    // simulate subscribe form event
    const form = await apy.onSubscribeForm();

    console.log(form);

    // simulate on blocks event
    return apy.onBlocks({
        address
    });
}

async function main() {

    console.log('Running manual test:');

    const address = '0x3dacC571356e7D5dFB3b475d6922442Ec06B9005';

    console.log(await testWowswapAPY(address));

}

main();


