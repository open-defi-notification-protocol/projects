const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const SYRUP_POOL_INFO = require('./syrup-pools-info-v2.json');
const EthereumMulticall = require('ethereum-multicall');

const MASTERCHEF_ADDRESS = "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652";

const CAKE_POOL_ID = "cake";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class PendingReward {

    static displayName = "Pending Reward (Syrup Pools) V2";
    static description = "Get notified when enough reward on the Syrup Pools is ready to claim";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.masterchefContract = new args.web3.eth.Contract(
            ABIs.masterchefV2,
            MASTERCHEF_ADDRESS
        );

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {
        const pool = await this._getAllUserPools(args);
        return [
            {
                type: "input-select",
                id: "pair",
                label: "Pair",
                values: pool
            },
            {
                type: "input-number",
                id: "minimum",
                label: "Minimum Reward",
                default: 0,
                description: "Minimum amount of claimable reward token to be notified about"
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

        const poolId = args.subscription["pair"];
        const minimum = args.subscription["minimum"];

        const poolInfo = SYRUP_POOL_INFO[poolId];

        let pendingReward;

        if (poolId === CAKE_POOL_ID) {

            pendingReward = await this.masterchefContract.methods.pendingCake(0, args.address).call();


        } else {

            const poolContract = new args.web3.eth.Contract(
                ABIs.syrupPool,
                poolInfo.address
            );

            pendingReward = await poolContract.methods.pendingReward(args.address).call();


        }

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + poolInfo.rewardTokenDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = poolId + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} ${poolInfo.label} ready to claim`
            };

        } else {

            return [];

        }
    }

    /**
     * returns all the masterchef pairs that the user has LPs deposited in
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPools(args) {

        const relevantPools = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        // starting from 1 bcs pool 0 is the cake token and will be called specifically later.
        for (const poolId in SYRUP_POOL_INFO) {

            const poolInfo = SYRUP_POOL_INFO[poolId];

            // cake is a special pool which is staked in the masterchef, so it'll be handled later
            if (poolId !== CAKE_POOL_ID) {

                contractCallContext.push({
                    reference: 'masterchef-poolId-' + poolId,
                    contractAddress: poolInfo.address,
                    abi: ABIs.syrupPool,
                    calls: [{
                        reference: 'userInfoCall',
                        methodName: 'userInfo',
                        methodParameters: [args.address]
                    }],
                    context: {
                        poolId: poolId
                    }
                });

            }

        }

        const results = (await multicall.call(contractCallContext)).results;

        // calling userInfo for pool 0 specifically with web3
        const pool0UserInfo = await this.masterchefContract.methods.userInfo(0, args.address).call();

        results['masterchef-poolId-0'] = {
            "originalContractCallContext": {
                "context": {
                    "poolId": CAKE_POOL_ID
                }
            },
            "callsReturnContext": [
                {
                    "returnValues": [
                        {
                            "type": "BigNumber",
                            "hex": pool0UserInfo[0]
                        },

                    ],
                }
            ]
        };

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const poolId = result.originalContractCallContext.context.poolId;

                relevantPools.push({
                    value: poolId,
                    label: SYRUP_POOL_INFO[poolId].label
                });

            }

        }

        return relevantPools;

    }

}

module.exports = PendingReward;
