const BN = require("bignumber.js");
const POOLS_INFO = require('./pools-info.json');
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const REWARD_TOKEN_ADDRESS = "0xf28164A485B0B2C90639E47b0f377b4a438a16B1";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

/**
 *
 */
class PendingReward {

    static displayName = "Pending Reward";
    static description = "Get notified when enough reward is ready to claim";

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
                id: "minimum",
                label: "Minimum QUICK",
                default: 0,
                description: "Minimum amount of claimable QUICK tokens to be notified about"
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
        const minimumTokens = args.subscription["minimum"];

        const poolInfo = this.poolsInfo.find(_poolInfo => _poolInfo.pair === selectedPairAddress)

        const lpRewardContract = new args.web3.eth.Contract(ABIs.rewards, poolInfo.stakingRewardAddress);
        const userPendingRewards = new BN(await lpRewardContract.methods.earned(args.address).call());

        const rewardTokenContract = new args.web3.eth.Contract(ABIs.token, REWARD_TOKEN_ADDRESS);
        const rewardTokenDecimals = await rewardTokenContract.methods.decimals().call();

        const pendingReward = userPendingRewards.dividedBy("1e" + rewardTokenDecimals);

        if (pendingReward.isGreaterThanOrEqualTo(minimumTokens)) {

            return {notification: `You have ${amountFormatter.format(pendingReward)} dQUICK ready to claim`};

        } else {

            return [];

        }

    }

    /**
     * returns all the pairs that the user has LPs deposited in or staked on rewards contract
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPairs(args) {

        const pairs = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        for (const poolInfo of this.poolsInfo) {

            if (this._validateAddress(poolInfo.pair) && this._validateAddress(poolInfo.stakingRewardAddress)) {

                contractCallContext.push({
                    reference: 'router-pid-' + poolInfo.stakingRewardAddress,
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

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const poolInfo = result.originalContractCallContext.context.poolInfo;

                pairs.push({
                    value: poolInfo.pair,
                    label: this._getPoolLabel(poolInfo)
                });

            }

        }

        return pairs;
    }

    /**
     *
     * @param address
     * @returns {boolean}
     * @private
     */
    _validateAddress(address) {

        return address && address !== "0x0000000000000000000000000000000000000000"

    }

    /**
     *
     * @param poolInfo
     * @returns {string}
     * @private
     */
    _getPoolLabel(poolInfo) {

        const tokens = poolInfo.tokens;

        return `${tokens[0].symbol} - ${tokens[1].symbol}`;

    }

}


module.exports = PendingReward;
