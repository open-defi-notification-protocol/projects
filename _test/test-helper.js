const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(require('./api-keys').alchemy));

const testAaveLowHealth = async () => {
    const LowHealth = require('../aave/low-health');
    const lowHealth = new LowHealth();

    await lowHealth.onInit(
        {
            web3
        }
    );

    return await lowHealth.onBlocks(
        {
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
        }
    );
};

const testAaveSevereLowHealth = async () => {
    const SevereHealth = require('../aave/severe-health');
    const severeHealth = new SevereHealth();

    await severeHealth.onInit(
        {
            web3
        }
    );

    return await severeHealth.onBlocks(
        {
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
        }
    );
};

const testSushiPendingRewards = async () => {
    const PendingRewards = require('../sushi/pending-reward');
    const pendingRewards = new PendingRewards();

    await pendingRewards.onInit(
        {
            web3
        }
    );

    const form = await pendingRewards.onSubscribeForm(
        {
            web3,
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
        }
    );

    return await pendingRewards.onBlocks(
        {
            web3,
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
            "subscription": {
                "Pair": form.find(o => o.label === "Pair").values[0].value,
                "Minimum Sushi": form.find(o => o.label === "Minimum Sushi").default
            }
        }
    );

};

const testSushiPositionWorth = async () => {
    const PositionWorth = require('../sushi/position-worth');
    const positionWorth = new PositionWorth();

    await positionWorth.onInit(
        {
            web3
        }
    );

    const form = await positionWorth.onSubscribeForm(
        {
            web3,
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
        }
    );

    return await positionWorth.onBlocks(
        {
            web3,
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
            "subscription": {
                "Pair": form.find(o => o.label === "Pair").values[0].value,
                "Percent Drop": form.find(o => o.label === "Percent Drop").default
            }
        }
    );

};

const testSushiTokenAmount = async () => {
    const TokenAmount = require('../sushi/token-amount');
    const tokenAmount = new TokenAmount();

    await tokenAmount.onInit(
        {
            web3
        }
    );

    const form = await tokenAmount.onSubscribeForm(
        {
            web3,
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888'
        }
    );

    return await tokenAmount.onBlocks(
        {
            web3,
            address: '0xC81bD599a66dA6dcc3A64399f8025C19fFC42888',
            "subscription": {
                "Pair": form.find(o => o.label === "Pair").values[0].value,
                "Percent Drop": form.find(o => o.label === "Percent Drop").default
            }
        }
    );

};

(async () => {

    // console.assert((await testAaveLowHealth()) !== undefined);
    // console.assert((await testAaveSevereLowHealth()) !== undefined);
    //console.assert((await testSushiPendingRewards()) !== undefined);
    //console.assert((await testSushiPositionWorth()) !== undefined);
    console.assert((await testSushiTokenAmount()) !== undefined);


})();