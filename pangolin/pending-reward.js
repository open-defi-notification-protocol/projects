const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const MINICHEF_ADDRESS = "0x1f806f7C8dED893fd3caE279191ad7Aa3798E928";
const PANGOLIN_TOKEN_ADDRESS = "0x60781C2586D68229fde47564546784ab3fACA982";

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

        this.minichefContract = new args.web3.eth.Contract(
            ABIs.minichef,
            MINICHEF_ADDRESS
        );

        const pangolinContract = new args.web3.eth.Contract(
            ABIs.erc20,
            PANGOLIN_TOKEN_ADDRESS
        );

        this.pangolinDecimals = await pangolinContract.methods.decimals().call();

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
                label: "Minimum PNG",
                default: 0,
                description: "Minimum amount of claimable PNG to be notified about"
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

        const pid = args.subscription["pair"];
        const minimum = args.subscription["minimum"];

        const pendingReward = await this.minichefContract.methods.pendingReward(pid, args.address).call();

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.pangolinDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = pid + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} PNG ready to claim`
            };

        } else {

            return [];

        }
    }

    /**
     * returns all the minichef pairs that the user has LPs deposited in
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPairs(args) {

        const pairs = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        const pools = await this.minichefContract.methods.poolLength().call();

        for (let poolId = 0; poolId < pools; poolId++) {

            contractCallContext.push({
                reference: 'minichef-poolId-' + poolId,
                contractAddress: MINICHEF_ADDRESS,
                abi: ABIs.minichef,
                calls: [{reference: 'userInfoCall', methodName: 'userInfo', methodParameters: [poolId, args.address]}],
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

                pairs.push({
                    value: poolId,
                    label: await this._getPairLabel(args, poolId)
                });

            }

        }

        return pairs;

    }

    /**
     * takes a minichef pool id and returns a string label of the two underlying tokens (like ETH-USDC)
     *
     * @param args
     * @param pid
     * @returns {Promise<string>}
     * @private
     */
    async _getPairLabel(args, pid) {

        const lpToken = await this.minichefContract.methods.lpToken(pid).call();

        const lpContract = new args.web3.eth.Contract(ABIs.lp, lpToken);

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
