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

        const response = await fetch("https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges", {
            "body": "{\"query\":\"query { liquidityGauges (first: 999) { id symbol poolId totalSupply factory { id } } }\"}",
            "method": "POST"
        });

        this.gauges = (await response.json()).data.liquidityGauges;

        this.balDecimals = 18;

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
                id: "gauge",
                label: "Liquidity Pool",
                values: pairs
            },
            {
                type: "input-number",
                id: "minimum",
                label: "Minimum BAL",
                default: 0,
                description: "Minimum amount of claimable BAL to be notified about"
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

        const gauge = args.subscription["pool"];
        const minimum = args.subscription["minimum"];

        const gaugeContract = new args.web3.eth.Contract(
            ABIs.gauge,
            gauge
        );

        const pendingReward = await gaugeContract.methods.claimable_tokens(args.address).call()

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.balDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = gauge + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} BAL ready to claim`
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

        for (let gauge of this.gauges) {

            const gaugeId = gauge.id;

            contractCallContext.push({
                reference: 'gauge-' + gaugeId,
                contractAddress: gaugeId,
                abi: ABIs.gauge,
                calls: [{
                    reference: 'balanceOfCall',
                    methodName: 'balanceOf',
                    methodParameters: [args.address]
                }],
                context: {
                    gaugeId: gaugeId,
                    poolSymbol: gauge.symbol.replace('-gauge', '')
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const poolSymbol = result.originalContractCallContext.context.poolSymbol;
                const gaugeId = result.originalContractCallContext.context.gaugeId;

                relevantRewardPools.push({
                    value: gaugeId,
                    label: poolSymbol
                });

            }

        }

        return relevantRewardPools;

    }

}

module.exports = PendingReward;
