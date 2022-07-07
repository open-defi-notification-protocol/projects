const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const MASTERCHEF_TOKEN_ADDRESS = "0x2b2929E785374c651a81A63878Ab22742656DcDd";
const ROUTER_ADDRESS = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";
const USDC_TOKEN_ADDRESS = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";
const WFTM_TOKEN_ADDRESS = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class PositionWorth {

    static displayName = "Position Worth";
    static description = "Track your staked position's total worth to protect against loss";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.masterchefContract = new args.web3.eth.Contract(
            ABIs.masterchef,
            MASTERCHEF_TOKEN_ADDRESS
        );

        this.routerContract = new args.web3.eth.Contract(
            ABIs.router,
            ROUTER_ADDRESS
        );

        const usdcContract = new args.web3.eth.Contract(ABIs.erc20, USDC_TOKEN_ADDRESS);

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

        const poolInfo = await this.masterchefContract.methods.poolInfo(selectedPoolId).call();

        const web3 = args.web3;

        const lpContract = new web3.eth.Contract(ABIs.lp, poolInfo.lpToken);

        const token0Address = await lpContract.methods.token0().call();
        const token0Contract = new web3.eth.Contract(ABIs.lp, token0Address);
        const token1Address = await lpContract.methods.token1().call();
        const token1Contract = new web3.eth.Contract(ABIs.lp, token1Address);

        const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
            web3,
            args.web3Cache,
            args.address,
            selectedPoolId,
            lpContract,
            token0Address,
            token0Contract,
            token1Address,
            token1Contract
        );

        const uniqueId = poolInfo.lpToken + "-" + threshold;

        if (new BN(threshold).minus(new BN(positionWorthInUsdBN)).isGreaterThan(0)) {


            const poolLabel = await this._getPoolLabel(
                web3,
                args.web3Cache,
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

        let walletAddress = args.address;

        const web3 = args.web3;

        const multicall = new EthereumMulticall.Multicall({web3Instance: web3, tryAggregate: true});

        const contractCallContext = [];

        const pools = await this.masterchefContract.methods.poolLength().call();

        for (let poolId = 0; poolId < pools; poolId++) {

            contractCallContext.push({
                reference: 'masterchef-poolId-' + poolId,
                contractAddress: MASTERCHEF_TOKEN_ADDRESS,
                abi: ABIs.masterchef,
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

                const poolInfo = await this.masterchefContract.methods.poolInfo(poolId).call();

                const lpContract = new web3.eth.Contract(ABIs.lp, poolInfo.lpToken);

                const token0Address = await lpContract.methods.token0().call();
                const token0Contract = new web3.eth.Contract(ABIs.lp, token0Address);
                const token1Address = await lpContract.methods.token1().call();
                const token1Contract = new web3.eth.Contract(ABIs.lp, token1Address);

                const positionWorthInUsdBN = await this._getPositionWorthInUsdBN(
                    web3,
                    null,
                    walletAddress,
                    poolId,
                    lpContract,
                    token0Address,
                    token0Contract,
                    token1Address,
                    token1Contract,
                    userStakedBalanceBN
                );

                if (positionWorthInUsdBN.isGreaterThan("0")) {

                    pairs.push({
                        value: poolId,
                        label: await this._getPoolLabel(
                            web3,
                            null,
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
     * @param web3Cache
     * @param token0Contract
     * @param token1Contract
     * @param positionWorthInUSDBN
     * @returns {Promise<string>}
     * @private
     */
    async _getPoolLabel(web3, web3Cache, token0Contract, token1Contract, positionWorthInUSDBN) {

        let token0Symbol
        let token1Symbol

        if (web3Cache) {

            token0Symbol = await web3Cache.get(
                token0Contract,
                'symbol'
            );

            token1Symbol = await web3Cache.get(
                token1Contract,
                'symbol'
            );

        } else {

            token0Symbol = await token0Contract.methods.symbol().call();
            token1Symbol = await token1Contract.methods.symbol().call();

        }

        return `${token0Symbol}-${token1Symbol} (${amountFormatter.format(positionWorthInUSDBN)} USD)`;

    }

    /**
     *
     * @param web3
     * @param web3Cache
     * @param walletAddress
     * @param poolId
     * @param lpContract
     * @param token0Address
     * @param token0Contract
     * @param token1Address
     * @param token1Contract
     * @param userStakedBalanceBN
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getPositionWorthInUsdBN(web3, web3Cache, walletAddress, poolId, lpContract, token0Address, token0Contract, token1Address, token1Contract, userStakedBalanceBN = null) {

        if (userStakedBalanceBN === null) {

            const userInfo = await this.masterchefContract.methods.userInfo(poolId, walletAddress).call();

            userStakedBalanceBN = new BN(userInfo.amount);

        }

        if (userStakedBalanceBN.isGreaterThan(0)) {

            let tokenAddress = token0Address;
            let tokenContract = token0Contract;

            if (token0Address.toLowerCase() === WFTM_TOKEN_ADDRESS.toLowerCase()) {
                tokenAddress = token1Address;
                tokenContract = token1Contract;
            }

            const tokenReserve = await this._getTokenReserve(
                lpContract,
                tokenAddress
            );

            let tokenDecimals

            if (web3Cache) {

                tokenDecimals = await web3Cache.get(
                    tokenContract,
                    'decimals'
                );

            } else {
                tokenDecimals = await tokenContract.methods.decimals().call();
            }

            const singleTokenWorthInUSD = await this.routerContract.methods.getAmountsOut(
                (new BN("10").pow(tokenDecimals)), // single whole unit
                [tokenAddress, WFTM_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS]
            ).call();

            if (singleTokenWorthInUSD === "0") {

                amountsOut = await this.routerContract.methods.getAmountsOut(
                    (new BN("10").pow(tokenDecimals)), // single whole unit
                    [tokenAddress, USDC_TOKEN_ADDRESS]
                ).call()

                singleTokenWorthInUSD = amountsOut[1]

            }

            const lpWorthInUsdBN = ((new BN(singleTokenWorthInUSD[2]).div(new BN("10").pow(this.usdcDecimals)))
                .multipliedBy(new BN(tokenReserve).div(new BN("10").pow(tokenDecimals)))).multipliedBy(2);

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
     * @param tokenAddress
     * @returns {Promise<*>}
     * @private
     */
    async _getTokenReserve(poolContract, tokenAddress) {

        const reserves = await poolContract.methods.getReserves().call();
        const token0Address = await poolContract.methods.token0().call();

        return token0Address.toLowerCase() === tokenAddress.toLowerCase() ? reserves._reserve0 : reserves._reserve1;

    }

}

module.exports = PositionWorth;
