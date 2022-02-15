const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const MINICHEF_TOKEN_ADDRESS = "0x1f806f7C8dED893fd3caE279191ad7Aa3798E928";
const ROUTER_ADDRESS = "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106";
const UST_TOKEN_ADDRESS = "0x260Bbf5698121EB85e7a74f2E45E16Ce762EbE11";
const AVAX_TOKEN_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

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

        this.minichefContract = new args.web3.eth.Contract(
            ABIs.minichef,
            MINICHEF_TOKEN_ADDRESS
        );

        this.routerContract = new args.web3.eth.Contract(
            ABIs.router,
            ROUTER_ADDRESS
        );

        const usdcContract = new args.web3.eth.Contract(ABIs.erc20, UST_TOKEN_ADDRESS);

        this.usdcDecimals = await usdcContract.methods.decimals().call();

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

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]|{notification: string, uniqueId: string}>}
     */
    async onBlocks(args) {

        const selectedPoolId = args.subscription['pair'];
        const threshold = args.subscription['threshold'];

        const lpToken = await this.minichefContract.methods.lpToken(selectedPoolId).call();

        const web3 = args.web3;

        const lpContract = new web3.eth.Contract(ABIs.lp, lpToken);

        const token0Address = await lpContract.methods.token0().call();
        const token0Contract = new web3.eth.Contract(ABIs.lp, token0Address);

        const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
            web3,
            args.address,
            selectedPoolId,
            lpContract,
            token0Address,
            token0Contract
        );

        const uniqueId = lpToken + "-" + threshold;

        if (new BN(threshold).minus(new BN(positionWorthInUsdBN)).isGreaterThan(0)) {

            const token1Address = await lpContract.methods.token1().call();
            const token1Contract = new web3.eth.Contract(ABIs.lp, token1Address);

            const poolLabel =  await this._getPoolLabel(
                web3,
                token0Contract,
                token1Contract,
                positionWorthInUsdBN
            );

            return {
                uniqueId: uniqueId,
                notification: `Your shares holdings in ${poolLabel} has dropped below ${amountFormatter.format(threshold)} USD`
            };

        } else {

            return [];

        }

    }

    /**
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPairs(args) {

        const pairs = [];

        const walletAddress = args.address;

        const web3 = args.web3;

        const multicall = new EthereumMulticall.Multicall({web3Instance: web3, tryAggregate: true});

        const contractCallContext = [];

        const pools = await this.minichefContract.methods.poolLength().call();

        for (let poolId = 0; poolId < pools; poolId++) {

            contractCallContext.push({
                reference: 'minichef-poolId-' + poolId,
                contractAddress: MINICHEF_TOKEN_ADDRESS,
                abi: ABIs.minichef,
                calls: [{reference: 'userInfoCall', methodName: 'userInfo', methodParameters: [poolId, walletAddress]}],
                context: {
                    poolId: poolId
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const poolId = result.originalContractCallContext.context.poolId;

                const lpToken = await this.minichefContract.methods.lpToken(poolId).call();

                const lpContract = new web3.eth.Contract(ABIs.lp, lpToken);

                const token0Address = await lpContract.methods.token0().call();
                const token0Contract = new web3.eth.Contract(ABIs.lp, token0Address);

                const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
                    web3,
                    walletAddress,
                    poolId,
                    lpContract,
                    token0Address,
                    token0Contract,
                    userStakedBalanceBN
                );

                if (positionWorthInUsdBN.isGreaterThan("0")) {

                    const token1Address = await lpContract.methods.token1().call();
                    const token1Contract = new web3.eth.Contract(ABIs.lp, token1Address);

                    pairs.push({
                        value: poolId,
                        label: await this._getPoolLabel(
                            web3,
                            token0Contract,
                            token1Contract,
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
     * @param web3
     * @param token0Contract
     * @param token1Contract
     * @param positionWorthInUSDBN
     * @returns {Promise<string>}
     * @private
     */
    async _getPoolLabel(web3, token0Contract, token1Contract, positionWorthInUSDBN) {

        const token0Symbol = await token0Contract.methods.symbol().call();
        const token1Symbol = await token1Contract.methods.symbol().call();

        return `${token0Symbol}-${token1Symbol} (${amountFormatter.format(positionWorthInUSDBN)} USD)`;

    }

    /**
     *
     * @param web3
     * @param walletAddress
     * @param poolId
     * @param lpContract
     * @param token0Address
     * @param token0Contract
     * @param userStakedBalanceBN
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getPositionWorthInUsdBN(web3, walletAddress, poolId, lpContract, token0Address, token0Contract, userStakedBalanceBN = null) {

        if (userStakedBalanceBN === null) {

            const userInfo = await this.minichefContract.methods.userInfo(poolId, walletAddress).call();

            userStakedBalanceBN = new BN(userInfo.amount);

        }

        if (userStakedBalanceBN.isGreaterThan(0)) {

            const token0Reserve = await this._getToken0Reserve(
                lpContract
            );

            const token0Decimals = await token0Contract.methods.decimals().call();

            const singleTokenWorthInUSD = await this.routerContract.methods.getAmountsOut(
                (new BN("10").pow(token0Decimals)), // single whole unit
                [token0Address, AVAX_TOKEN_ADDRESS, UST_TOKEN_ADDRESS]
            ).call();

            const lpWorthInUsdBN = ((new BN(singleTokenWorthInUSD[2]).div(new BN("10").pow(this.usdcDecimals)))
                .multipliedBy(new BN(token0Reserve).div(new BN("10").pow(token0Decimals)))).multipliedBy(2);

            const sharesBN = await this._getUserSharesBN(
                userStakedBalanceBN,
                lpContract,
            );

            return lpWorthInUsdBN.multipliedBy(sharesBN);


        } else {

            return new BN(0);

        }

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
     * @returns {Promise<*>}
     * @private
     */
    async _getToken0Reserve(poolContract) {

        const reserves = await poolContract.methods.getReserves().call();

        return reserves._reserve0;

    }

}

module.exports = PositionWorth;
