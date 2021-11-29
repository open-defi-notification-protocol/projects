const ABIs = require('./abis.json');
const POOLS_INFO = require('./pools-info.json');
const BN = require("bignumber.js");

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

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {id: string, label: string, type: string, value: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const {pairs, initialInfoMap} = await this._getAllUserPairsAndInitialInfoMap(args);

        return [
            {
                type: "input-select",
                id: "pair",
                label: "Pair",
                values: pairs
            },
            {
                type: "input-select",
                id: "baseToken",
                label: "Base Token",
                description: "Will be used to calculate the position worth",
                values: [
                    {
                        value: "token0",
                        label: "Token A"
                    },
                    {
                        value: "token1",
                        label: "Token B"
                    }
                ]
            },
            {
                type: "hidden",
                id: "initialInfoMap",
                label: "",
                value: JSON.stringify(initialInfoMap)
            },
            {
                type: "input-number",
                id: "drop",
                label: "Percent Drop",
                default: 0,
                description: "Percent change in position worth"
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

        const poolInfo = this.poolsInfo.find(_poolInfo => _poolInfo.pair === selectedPairAddress)

        const poolContract = new args.web3.eth.Contract(ABIs.lp, poolInfo.pair);

        const baseToken = args.subscription['baseToken'];

        const currentReserves = await this._getReserves(
            poolContract
        );

        const currentBaseTokenReserves = currentReserves[baseToken];

        const initialInfoMap = JSON.parse(args.subscription['initialInfoMap']);

        const initialInfo = initialInfoMap[poolInfo.pair];

        const initialBaseTokenReserves = initialInfo.reserves[baseToken];

        const thresholdPercentage = 1 - (parseInt(args.subscription["drop"]) / 100);

        const initialPositionWorth = new BN(initialBaseTokenReserves).multipliedBy(initialInfo.shares);

        const currentPositionWorth = new BN(currentBaseTokenReserves).multipliedBy(initialInfo.shares);

        const positionWorthDroppedBelowThreshold = currentPositionWorth.isLessThan(initialPositionWorth.multipliedBy(thresholdPercentage));

        if (positionWorthDroppedBelowThreshold) {

            return {notification: `Your original holdings of Token ${baseToken === 'token0' ? 'A' : 'B'} of pair ${this._getPoolLabel(poolInfo)} has dropped by more than ${args.subscription["drop"]}%`}

        } else {

            return [];

        }

    }

    /**
     *
     * @param poolInfo
     * @returns {string}
     * @private
     */
    _getPoolLabel(poolInfo) {

        const tokens = poolInfo.tokens;

        return tokens[0].symbol + '-' + tokens[1].symbol;

    }

    /**
     * returns
     *          all the pairs that the user has LPs deposited in or staked on rewards contract
     *          all initial liquidities of token 0 of relevant pools
     * @param args
     * @returns {Promise<{initialInfoMap: {}, pairs: *[]}>}
     * @private
     */
    async _getAllUserPairsAndInitialInfoMap(args) {

        const pairs = [];

        const walletAddress = args.address;

        const initialInfoMap = {};

        for (const poolInfo of this.poolsInfo) {

            if (poolInfo.pair) {

                const poolContract = new args.web3.eth.Contract(ABIs.lp, poolInfo.pair);

                let stakingRewardContract = null;

                if (poolInfo.stakingRewardAddress) {
                    stakingRewardContract = new args.web3.eth.Contract(ABIs.rewards, poolInfo.stakingRewardAddress);
                }

                const walletTotalLpBalanceBN = await this._getWalletTotalLpBalanceBN(
                    walletAddress,
                    poolContract,
                    stakingRewardContract
                );

                if (walletTotalLpBalanceBN.isGreaterThan(0)) {

                    pairs.push({
                        value: poolInfo.pair,
                        label: this._getPoolLabel(poolInfo)
                    });

                    const reserves = await this._getReserves(
                        poolContract
                    );

                    const sharesBN = await this._getUserSharesBN(
                        walletTotalLpBalanceBN,
                        poolContract,
                    );

                    initialInfoMap[poolInfo.pair] = {
                        shares: sharesBN.toString(),
                        reserves: reserves
                    };

                }

            }

        }

        return {pairs, initialInfoMap};
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
     * @returns {Promise<{token0: *, token1: *}>}
     * @private
     */
    async _getReserves(poolContract) {

        const reserves = await poolContract.methods.getReserves().call();

        return {
            token0: reserves._reserve0,
            token1: reserves._reserve1
        }

    }

}

module.exports = PositionWorth;
