const BigNumber = require("bignumber.js");
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
    results.callsReturnContext.map(info => {
        const userIsCompounding = info.returnValues[0];
        const userStakingAmount = info.returnValues[0].hex? new BigNumber(info.returnValues[0].hex).toNumber(): 0;
        const pid = info.methodParameters[0];
        if (userIsCompounding === true || userStakingAmount > 0) {
            extraContext.push({
                userIsCompounding: userIsCompounding
            });
            calls.push({
                reference: 'poolInfoCall',
                methodName: 'poolInfo',
                methodParameters: [pid],
            });
        }
    });

    console.log(calls);
    contractCallContext.push({
        reference: 'user-pools-poolInfo',
        contractAddress: revaStakingPoolContract.options.address,
        abi: revaStakingPoolContract.options.jsonInterface,
        calls: calls,
        context: extraContext,
    });

    results = (await multicall.call(contractCallContext)).results['user-pools-poolInfo'];
    results.callsReturnContext.map(poolInfo => {
        const pid = poolInfo.methodParameters[0];
        const vRevaMultiplier = new BigNumber(poolInfo.returnValues[2].hex).toNumber();
        const timeLocked = new BigNumber(poolInfo.returnValues[3].hex).toNumber();
        let userIsCompounding = false;
        if (results.originalContractCallContext.context[pid]) {
            userIsCompounding = results.originalContractCallContext.context[pid]['userIsCompounding'];
        }
        pools.push({
            value: pid,
            label: `X${vRevaMultiplier} ${timeLocked / 24 / 60 / 60} Days Lock. ${userIsCompounding===true? 'Entered autoCompounding.':''}`,
        });
    });

    console.log(pools);

    return pools;
}



module.exports = GetAllUserPools