const Web3 = require('web3');
const BN = require("bignumber.js");
const web3 = new Web3(new Web3.providers.HttpProvider(require('../_test/dev-keys.json').web3));
const EthereumMulticall = require('ethereum-multicall');
const fetch = require("node-fetch");
const ABIs = require("../uniswap/abis.json");
const fs = require("fs");

const WETH_TOKEN_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

const IGNORE_CONTRACTS = [
    '0x8c8af24921BF86B23D6418C8674E210aC876Cd2E',
    '0x1ADc7DaC48A656552b094eB75D09Fb29b5da9Ade',
    '0x659cDebf48EbA64ab0e7Ed049959Ad516bdd2158',
    '0xE4610c983877480a50eeA0D53E313eDa423eC678',
    '0x6615D8EF7D762878caE51cB18EE647f9c2825536',
    '0x5b95dBc3995F36e85b771720083f216a112306A1',
    '0x6ab01fb2591f158A3E6A838cD45BFb077BD4690c',
    '0xbb41D5F95b45511eD23924144B7348A7Bd50C7ea',
    '0xdE7Ad7F64b8D7d369145FA0e9DC76EDcFcd89d68',
    '0x18C71Cfab8319cB19137B19c2307BE0500E7DF21',
    '0xaEAd6aae17Dfd944513DD60a9809E3941058451E',
    '0x260787332F2Fe51356B7F4172D4097e040699696',
    '0x9969183D576220b31369aB878260e5BB9BC34743',
    '0xe83A969B55cBA46bC84A69DF133Fc539B7278001',
    '0x62BAc0626558023639C6526D6971ca046BD1CB78',
    '0x89817F9b1fb1BC209911E5c77379721CDAF484Fd',
    '0x13Fa9Db82c07eb03dad870f220F23c923CeC89dB',
    '0x8ab4dEcd27334DA8dE04AD1038c4a5FDCEDC5b80'
];

async function main() {

    const wethContract = new web3.eth.Contract(ABIs.erc20, WETH_TOKEN_ADDRESS);

    const wethDecimals = await wethContract.methods.decimals().call();

    const response = await fetch('https://raw.githubusercontent.com/jab416171/uniswap-pairtokens/master/uniswap_pair_tokens.json');

    const poolsInfo = (await response.json()).tokens;

    const processedPools = {};

    const multicall = new EthereumMulticall.Multicall({web3Instance: web3, tryAggregate: true});

    const chunkSize = 3000;

    const allPools = Object.values(poolsInfo)
        // .slice(0, 1000);

    console.log(`fetching all TVLs of ${allPools.length} pools`);

    function sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }

    let chunks = sliceIntoChunks(allPools, chunkSize);

    let i = 0;

    console.log(`get pool info`);

    const ethPools = {};

    try {

        for (const chunk of chunks) {

            const contractCallContext = [];

            for (const poolInfo of chunk) {

                const poolAddress = poolInfo.address;

                if (!poolAddress || poolInfo.chainId !== 1 || IGNORE_CONTRACTS.indexOf(poolAddress) > -1) continue;

                processedPools[poolAddress] = {
                    address: poolAddress,
                    symbol: poolInfo.name.replace('Uniswap V2 - ', '').replace('/', '-'),
                    decimals: poolInfo.decimals
                };

                contractCallContext.push({
                    reference: 'pool-' + poolAddress,
                    contractAddress: poolAddress,
                    abi: ABIs.lp,
                    calls: [
                        {reference: 'getReservesCall', methodName: 'getReserves'},
                        {reference: 'token0Call', methodName: 'token0'},
                        {reference: 'token1Call', methodName: 'token1'}
                    ],
                    context: {
                        poolAddress: poolAddress
                    }
                });

            }

            const results = (await multicall.call(contractCallContext)).results;

            for (const result of Object.values(results)) {

                const callReturnContext = result.callsReturnContext[0];

                const token0 = result.callsReturnContext[1].returnValues[0];
                const token1 = result.callsReturnContext[2].returnValues[0];

                if (token0 === WETH_TOKEN_ADDRESS || token1 === WETH_TOKEN_ADDRESS) {

                    const poolAddress = result.originalContractCallContext.context.poolAddress;

                    const reserve0 = new BN(callReturnContext.returnValues[0].hex).toString(10);
                    const reserve1 = new BN(callReturnContext.returnValues[1].hex).toString(10);

                    const processedPool = processedPools[poolAddress];

                    if (token0 === WETH_TOKEN_ADDRESS) {
                        processedPool.ethReserve = reserve0;
                        processedPool.tokenReserve = reserve1;
                        processedPool.tokenAddress = token1;
                    } else {
                        processedPool.ethReserve = reserve1;
                        processedPool.tokenReserve = reserve0;
                        processedPool.tokenAddress = token0;
                    }

                    processedPool.tvl = new BN(processedPool.ethReserve).dividedBy("1e" + wethDecimals).multipliedBy(2).toString(10);

                    ethPools[poolAddress] = processedPool;

                }

            }

            i += chunk.length;
            console.log(`went over ${i} of ${allPools.length} pools`);

        }

        let allPoolsByTVLs = Object.values(ethPools);

        allPoolsByTVLs.sort((a, b) => {

            return new BN(a.tvl).comparedTo(b.tvl);

        })

        const fs = require('fs');

        fs.writeFile('all-pools-tvl.json', JSON.stringify(allPoolsByTVLs), () => {

            console.log(`done writing info for ${allPoolsByTVLs.length} pools`);

        })


    } catch (e) {
        console.error(e);
        console.log(allPools);
    }


}

main();
