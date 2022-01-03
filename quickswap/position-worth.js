const ABIs = require('./abis.json');
const POOLS_INFO = require('./pools-info.json');
const BN = require("bignumber.js");
const EthereumMulticall = require('ethereum-multicall');

const ROUTER_ADDRESS = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';
const USDC_TOKEN_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
const WMATIC_TOKEN_ADDRESS = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';

/**
 *
 */
class PositionWorth {

    static displayName = "Position Worth";
    static description = "Track your position's total worth to protect against loss";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        // cause DDOS response when run on firebase, using cached version for now.
        // const response = await fetch("http://quickswap.exchange/staking.json");

        this.poolsInfo = POOLS_INFO;

        const usdcContract = new args.web3.eth.Contract(ABIs.token, USDC_TOKEN_ADDRESS);

        this.usdcDecimals = await usdcContract.methods.decimals().call();

        this.routerContract = new args.web3.eth.Contract(
            ABIs.router,
            ROUTER_ADDRESS
        );

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {id: string, label: string, type: string, value: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const pairs = await this._getAllUserPairs(args);

        return [
            {
                type: "input-select",
                id: "pair",
                label: "Pool",
                values: pairs
            },
            {
                type: "input-number",
                id: "threshold",
                label: "Threshold price",
                default: 0,
                description: "Notify me when the price of my position goes below this value in USD"
            }
        ];

    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        const selectedPairAddress = args.subscription['pair'];
        const threshold = args.subscription['threshold'];

        const poolInfo = this.poolsInfo.find(_poolInfo => !_poolInfo.ended && _poolInfo.pair === selectedPairAddress);

        const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
            args.web3,
            args.address,
            poolInfo
        );

        const uniqueId = poolInfo.pair + "-" + threshold;

        if (new BN(threshold).minus(new BN(positionWorthInUsdBN)).isGreaterThan(0)) {

            const poolLabel = await this._getPoolLabel(poolInfo, positionWorthInUsdBN);

            return {
                uniqueId: uniqueId,
                notification: `Your shares holdings in ${poolLabel} has dropped below ${threshold} USD`
            };

        } else {

            return [];

        }

    }

    /**
     *
     * @param poolInfo
     * @param positionWorthInUSDBN
     * @returns {string}
     * @private
     */
    _getPoolLabel(poolInfo, positionWorthInUSDBN) {

        const tokens = poolInfo.tokens;

        const formatter = Intl.NumberFormat('en', {notation: 'compact'});

        return `${tokens[0].symbol} - ${tokens[1].symbol} (${formatter.format(positionWorthInUSDBN)} USD)`;

    }

    /**
     * returns
     *          all the pairs that the user has LPs deposited in or staked on rewards contract
     *          all initial liquidities of token 0 of relevant pools
     * @param args
     * @returns {Promise<{initialInfoMap: {}, pairs: *[]}>}
     * @private
     */
    async _getAllUserPairs(args) {

        const pairs = [];

        const walletAddress = args.address;

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        for (const poolInfo of this.poolsInfo) {

            const pairAddress = poolInfo.pair;

            if (pairAddress) {

                contractCallContext.push({
                    reference: JSON.stringify({stakingRewardAddress: poolInfo.stakingRewardAddress, isReward: false}),
                    contractAddress: pairAddress,
                    abi: ABIs.lp,
                    calls: [{reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [args.address]}],
                    context: {
                        poolInfo: poolInfo
                    }
                });

                contractCallContext.push({
                    reference: JSON.stringify({stakingRewardAddress: poolInfo.stakingRewardAddress, isReward: true}),
                    contractAddress: poolInfo.stakingRewardAddress,
                    abi: ABIs.rewards,
                    calls: [{reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [args.address]}],
                    context: {
                        poolInfo: poolInfo
                    }
                });

            }

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const reference in results) {

            const rewardResult = results[reference];

            const poolInfo = rewardResult.originalContractCallContext.context.poolInfo;

            const key = JSON.parse(reference);

            // going over active reward contracts and finding their respective pair
            if (!poolInfo.ended && key.isReward) {

                const pairKey = JSON.parse(reference)

                pairKey.isReward = false;

                const pairResult = results[JSON.stringify(pairKey)];

                const userStakedBalanceBN = new BN(rewardResult.callsReturnContext[0].returnValues[0].hex);

                const userUnstakedBalanceBN = new BN(pairResult.callsReturnContext[0].returnValues[0].hex);

                const walletTotalLpBalanceBN = userUnstakedBalanceBN.plus(userStakedBalanceBN);

                if (walletTotalLpBalanceBN.isGreaterThan("0")) {

                    const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
                        args.web3,
                        walletAddress,
                        poolInfo,
                        walletTotalLpBalanceBN
                    );

                    if (positionWorthInUsdBN.isGreaterThan("0")) {

                        pairs.push({
                            value: poolInfo.pair,
                            label: this._getPoolLabel(
                                poolInfo,
                                positionWorthInUsdBN
                            )
                        });

                    }

                }

            }

        }

        return pairs;

    }

    /**
     *
     * @param web3
     * @param walletAddress
     * @param poolInfo
     * @param walletTotalLpBalanceBN
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getPositionWorthInUsdBN(web3, walletAddress, poolInfo, walletTotalLpBalanceBN = null) {

        const poolContract = new web3.eth.Contract(ABIs.lp, poolInfo.pair);

        if (walletTotalLpBalanceBN === null) {

            let stakingRewardContract = null;

            if (poolInfo.stakingRewardAddress) {
                stakingRewardContract = new web3.eth.Contract(ABIs.rewards, poolInfo.stakingRewardAddress);
            }

            walletTotalLpBalanceBN = await this._getWalletTotalLpBalanceBN(
                walletAddress,
                poolContract,
                stakingRewardContract
            );

        }

        if (walletTotalLpBalanceBN.isGreaterThan(0)) {

            const token0Info = poolInfo.tokens[0];

            const token0Reserve = await this._getToken0Reserve(
                poolContract,
                token0Info
            );

            const singleTokenWorthInUSD = await this.routerContract.methods.getAmountsOut(
                (new BN("10").pow(token0Info.decimals)), // single whole unit
                [token0Info.address, WMATIC_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS]
            ).call();

            const lpWorthInUsdBN = ((new BN(singleTokenWorthInUSD[2]).div(new BN("10").pow(this.usdcDecimals)))
                .multipliedBy(new BN(token0Reserve).div(new BN("10").pow(token0Info.decimals)))).multipliedBy(2);

            const sharesBN = await this._getUserSharesBN(
                walletTotalLpBalanceBN,
                poolContract,
            );

            return lpWorthInUsdBN.multipliedBy(sharesBN);


        } else {

            return new BN(0);

        }

    }

    /**
     *
     * @param walletAddress
     * @param poolContract
     * @param stakingRewardContract
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getWalletTotalLpBalanceBN(walletAddress, poolContract, stakingRewardContract) {

        const walletUnstakedBalance = await poolContract.methods.balanceOf(walletAddress).call();

        let walletTotalLpBalanceBN = new BN(walletUnstakedBalance);

        if (stakingRewardContract) {

            const walletStakedBalanceBN = new BN(await stakingRewardContract.methods.balanceOf(walletAddress).call());

            walletTotalLpBalanceBN = walletTotalLpBalanceBN.plus(walletStakedBalanceBN);

        }

        return walletTotalLpBalanceBN;

    }

    /**
     *
     * @param totalWalletLpBalanceBN
     * @param poolContract
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getUserSharesBN(totalWalletLpBalanceBN, poolContract) {

        const poolLpTotalSupplyBN = new BN(await poolContract.methods.totalSupply().call());

        return totalWalletLpBalanceBN.dividedBy(poolLpTotalSupplyBN);

    }

    /**
     *
     * @param poolContract
     * @param token0Info
     * @returns {Promise<*>}
     * @private
     */
    async _getToken0Reserve(poolContract, token0Info) {

        const reserves = await poolContract.methods.getReserves().call();
        const token0Address = await poolContract.methods.token0().call();

        return token0Address === token0Info.address ? reserves._reserve0 : reserves._reserve1;

    }

}

module.exports = PositionWorth;
