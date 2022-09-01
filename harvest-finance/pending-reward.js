const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');
const fetch = require("node-fetch");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

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

        // const response = await fetch("https://raw.githubusercontent.com/kogecoin/vault-contracts/main/vaultaddresses");
        const response = await fetch("https://api-ui.harvest.finance/pools?key=41e90ced-d559-4433-b390-af424fdc76d6");

        this.pools = await response.json();

        this.farmDecimals = 18

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
                id: "pool",
                label: "Vault (Pool)",
                values: pairs
            },
            {
                type: "input-number",
                id: "minimum",
                label: "Minimum BOO",
                default: 0,
                description: "Minimum amount of claimable BOO to be notified about"
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

        const pool = args.subscription["pool"];
        const minimum = args.subscription["minimum"];

        this.rewardPoolContract = new args.web3.eth.Contract(
            ABIs.rewardPool,
            pool
        );

        const pendingReward = await this.rewardPoolContract.methods.earned(args.address).call();

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.farmDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = pool + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} FARM ready to claim`
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
    async _getAllUserPairs(args) {

        const relevantRewardPools = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];


        for (let pool of this.pools.eth) {

            const poolId = pool.id;

            contractCallContext.push({
                reference: 'reward-pool-' + poolId,
                contractAddress: pool.contractAddress,
                abi: ABIs.rewardPool,
                calls: [{
                    reference: 'balanceOfCall',
                    methodName: 'balanceOf',
                    methodParameters: [args.address]
                }],
                context: {
                    poolId: poolId,
                    poolAddress: pool.contractAddress
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const poolAddress = result.originalContractCallContext.context.poolAddress;
                const poolId = result.originalContractCallContext.context.poolId;

                relevantRewardPools.push({
                    value: poolAddress,
                    label: poolId
                });

            }

        }

        return relevantRewardPools;

    }

}

module.exports = PendingReward;
