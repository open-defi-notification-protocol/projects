const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const MESH_TOKEN_ADDRESS = "0x82362Ec182Db3Cf7829014Bc61E9BE8a2E82868a";
const MESH_VIEW_CONTRACT_ADDRESS = "0xF61e4ede9128A9FA9a128cB7D161F4e73bd464Da";
const MESH_FACTORY_CONTRACT_ADDRESS = "0x9F3044f7F9FC8bC9eD615d54845b4577B833282d";

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

        this.meshFactoryContract = new args.web3.eth.Contract(
            ABIs.factory,
            MESH_FACTORY_CONTRACT_ADDRESS
        );

        const meshTokenContract = new args.web3.eth.Contract(
            ABIs.erc20,
            MESH_TOKEN_ADDRESS
        );

        this.meshDecimals = await meshTokenContract.methods.decimals().call();

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
                label: "Minimum MESH",
                default: 0,
                description: "Minimum amount of claimable MESH to be notified about"
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

        const minimum = args.subscription["minimum"];
        const pair = args.subscription["pair"];

        const viewContract = new args.web3.eth.Contract(
            ABIs.view,
            MESH_VIEW_CONTRACT_ADDRESS
        );

        const result = await viewContract.methods.getPendingReward(
            pair,
            args.address
        ).call();

        const pendingReward = result.meshReward;

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.meshDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = pair + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} MESH ready to claim`
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

        const pairs = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        const poolsAddresses = [];

        const poolsLength = await this.meshFactoryContract.methods.allPairsLength().call();

        for (let poolId = 0; poolId < poolsLength; poolId++) {

            contractCallContext.push({
                reference: 'factory-poolId-' + poolId,
                contractAddress: MESH_FACTORY_CONTRACT_ADDRESS,
                abi: ABIs.factory,
                calls: [{reference: 'allPairsCall', methodName: 'allPairs', methodParameters: [poolId]}],
                context: {
                    poolId: poolId
                }
            });

        }

        let results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            poolsAddresses.push(
                result.callsReturnContext[0].returnValues[0]
            );

        }

        for (const poolsAddress of poolsAddresses) {

            contractCallContext.push({
                reference: 'pool-' + poolsAddress,
                contractAddress: poolsAddress,
                abi: ABIs.lp,
                calls: [{reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [args.address]}],
                context: {
                    poolsAddress: poolsAddress
                }
            });

        }

        results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const poolsAddress = result.originalContractCallContext.context.poolsAddress;

                const poolLabel = await this._getPairLabel(args, poolsAddress);

                pairs.push({
                    value: poolsAddress,
                    label: poolLabel
                });

            }

        }

        return pairs;

    }

    /**
     * takes pool address and returns a string label of the two underlying tokens (like ETH-USDC)
     *
     * @param args
     * @param poolsAddress
     * @returns {Promise<string>}
     * @private
     */
    async _getPairLabel(args, poolsAddress) {

        const lpContract = new args.web3.eth.Contract(ABIs.lp, poolsAddress);

        const token0 = await lpContract.methods.token0().call();
        const token1 = await lpContract.methods.token1().call();

        const token0Contract = new args.web3.eth.Contract(ABIs.erc20, token0);
        const token1Contract = new args.web3.eth.Contract(ABIs.erc20, token1);

        const token0Symbol = await token0Contract.methods.symbol().call();
        const token1Symbol = await token1Contract.methods.symbol().call();

        return token0Symbol + "-" + token1Symbol;

    }

}

module.exports = PendingReward;
