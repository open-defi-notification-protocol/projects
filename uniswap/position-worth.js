const ABIs = require('./abis.json');
const POOLS_INFO = require('./all-pools-tvl.json');
const BN = require("bignumber.js");
const EthereumMulticall = require('ethereum-multicall');

const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const WETH_TOKEN_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const USDC_TOKEN_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

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

        this.poolsInfo = POOLS_INFO.slice(POOLS_INFO.length - 1001, POOLS_INFO.length);

        const usdcContract = new args.web3.eth.Contract(ABIs.erc20, USDC_TOKEN_ADDRESS);

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
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const pairs = await this._getAllUserPairs(args);

        return [
            {
                type: "input-select",
                id: "pair",
                label: "Pair",
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

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const selectedPairAddress = args.subscription['pair'];

        const threshold = args.subscription['threshold'];

        const poolInfo = this.poolsInfo.find(_poolInfo => _poolInfo.address === selectedPairAddress);

        const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
            args.web3,
            args.address,
            poolInfo
        );

        const uniqueId = poolInfo.address + "-" + threshold;

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

        const formatter = Intl.NumberFormat('en', {notation: 'compact'});

        return `${poolInfo.symbol} (${formatter.format(positionWorthInUSDBN)} USD)`;

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

            const poolAddress = poolInfo.address;

            contractCallContext.push({
                reference: 'pool-' + poolAddress,
                contractAddress: poolAddress,
                abi: ABIs.lp,
                calls: [{reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [walletAddress]}],
                context: {
                    poolInfo: poolInfo
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const walletLpBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (walletLpBalanceBN.isGreaterThan(0)) {

                const poolInfo = result.originalContractCallContext.context.poolInfo;

                const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
                    args.web3,
                    walletAddress,
                    poolInfo,
                    walletLpBalanceBN
                );

                if (positionWorthInUsdBN.isGreaterThan("0")) {

                    pairs.push({
                        value: poolInfo.address,
                        label: this._getPoolLabel(
                            poolInfo,
                            positionWorthInUsdBN
                        )
                    });

                }

            }

        }

        return pairs;

    }

    /**
     *
     * @param walletAddress
     * @param poolContract
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getWalletTotalLpBalanceBN(walletAddress, poolContract) {

        const walletUnstakedBalance = await poolContract.methods.balanceOf(walletAddress).call();

        return new BN(walletUnstakedBalance);

    }

    /**
     *
     * @param poolContract
     * @param tokenAddress
     * @returns {Promise<*>}
     * @private
     */
    async _getTokenReserve(poolContract, tokenAddress) {

        const reserves = await poolContract.methods.getReserves().call();
        const token0Address = await poolContract.methods.token0().call();

        return token0Address === tokenAddress ? reserves._reserve0 : reserves._reserve1;

    }

    /**
     *
     * @param web3
     * @param tokenAddress
     * @returns {Promise<*>}
     * @private
     */
    async _getTokenDecimals(web3, tokenAddress) {

        const tokenContract = new web3.eth.Contract(ABIs.erc20, tokenAddress);

        return await tokenContract.methods.decimals().call();

    }

    /**
     *
     * @param walletLpBalanceBN
     * @param poolContract
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getUserSharesBN(walletLpBalanceBN, poolContract) {

        const poolLpTotalSupplyBN = new BN(await poolContract.methods.totalSupply().call());

        return walletLpBalanceBN.dividedBy(poolLpTotalSupplyBN);

    }

    /**
     *
     * @param web3
     * @param walletAddress
     * @param poolInfo
     * @param walletLpBalanceBN
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getPositionWorthInUsdBN(web3, walletAddress, poolInfo, walletLpBalanceBN = null) {

        const poolContract = new web3.eth.Contract(ABIs.lp, poolInfo.address);

        if (walletLpBalanceBN === null) {

            walletLpBalanceBN = await this._getWalletTotalLpBalanceBN(
                walletAddress,
                poolContract
            );

        }

        if (walletLpBalanceBN.isGreaterThan(0)) {

            const tokenReserve = await this._getTokenReserve(
                poolContract,
                poolInfo.tokenAddress
            );

            const tokenDecimals = await this._getTokenDecimals(
                web3,
                poolInfo.tokenAddress
            );

            const singleTokenWorthInUSD = await this.routerContract.methods.getAmountsOut(
                (new BN("10").pow(tokenDecimals)), // single whole unit
                [poolInfo.tokenAddress, WETH_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS]
            ).call();

            const lpWorthInUsdBN = ((new BN(singleTokenWorthInUSD[2]).div(new BN("10").pow(this.usdcDecimals)))
                .multipliedBy(new BN(tokenReserve).div(new BN("10").pow(tokenDecimals)))).multipliedBy(2);

            const sharesBN = await this._getUserSharesBN(
                walletLpBalanceBN,
                poolContract,
            );

            return lpWorthInUsdBN.multipliedBy(sharesBN);


        } else {

            return new BN(0);

        }

    }


}

module.exports = PositionWorth;
