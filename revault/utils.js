const BN = require("bignumber.js");
const EthereumMulticall = require('ethereum-multicall');


async function GetAllUserPools(web3, revaStakingPoolContract, userAddress) {

    const pools = [];

    const poolLength = await revaStakingPoolContract.methods.poolLength().call();

    const multicall = new EthereumMulticall.Multicall({web3Instance: web3, tryAggregate: true});

    let contractCallContext = [];

    let calls = [];

    for (let pid = 0; pid < poolLength; pid++) {

        calls.push({
            reference: 'userIsCompoundingCall',
            methodName: 'userIsCompounding',
            methodParameters: [pid, userAddress]
        });
        calls.push({
            reference: 'userPoolInfoCall',
            methodName: 'userPoolInfo',
            methodParameters: [pid, userAddress]
        });

    }

    contractCallContext.push({
        reference: 'userInfo-pools',
        contractAddress: revaStakingPoolContract.options.address,
        abi: revaStakingPoolContract.options.jsonInterface,
        calls: calls
    });

    let results = (await multicall.call(contractCallContext)).results['userInfo-pools'];

    // Get relevant pools' info
    contractCallContext = [];

    calls = [];

    const extraContext = [];

    const transformedResults = [];

    let transformedResult;

    for (let i = 0; i < results.callsReturnContext.length; i++) {

        if (i % 2 === 0) {
            transformedResult = {};
            transformedResults.push(transformedResult);
        } else {
            transformedResult = transformedResults[transformedResults.length - 1];
        }

        const info = results.callsReturnContext [i];

        if (info.reference === 'userIsCompoundingCall') {
            transformedResult.isCompounding = info.returnValues[0];
        } else {
            transformedResult.stakingAmountBN = info.returnValues[0].hex ? new BN(info.returnValues[0].hex) : 0;
        }

        transformedResult.poolId = info.methodParameters[0];

    }

    for (const transformedResult of transformedResults) {

        if (transformedResult.isCompounding || transformedResult.stakingAmountBN.isGreaterThan(0)) {

            extraContext.push({
                userIsCompounding: transformedResult.isCompounding
            });

            calls.push({
                reference: 'poolInfoCall',
                methodName: 'poolInfo',
                methodParameters: [transformedResult.poolId],
            });

        }

    }

    contractCallContext.push({
        reference: 'user-pools-poolInfo',
        contractAddress: revaStakingPoolContract.options.address,
        abi: revaStakingPoolContract.options.jsonInterface,
        calls: calls,
        context: extraContext,
    });

    const contractCallResults = await multicall.call(contractCallContext);

    if (Object.keys(contractCallResults.results).length > 0) {

        results = contractCallResults.results['user-pools-poolInfo'];

        let i = 0;

        results.callsReturnContext.map(poolInfo => {
            const context = results.originalContractCallContext.context[i];
            const pid = poolInfo.methodParameters[0];
            const vRevaMultiplier = new BN(poolInfo.returnValues[2].hex).toNumber();
            const timeLocked = new BN(poolInfo.returnValues[3].hex).toNumber();

            i++;
            pools.push({
                value: "" + pid,
                label: `X${vRevaMultiplier} ${timeLocked / 24 / 60 / 60} Days Lock${context.userIsCompounding ? ' *' : ''}`,
            });

        });

    }

    return pools;

}


module.exports = GetAllUserPools
