const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const MASTERCHEF_ADDRESS = "0x2b2929E785374c651a81A63878Ab22742656DcDd";
const SPOOKY_TOKEN_ADDRESS = "0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE";

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

        this.masterchefContract = new args.web3.eth.Contract(
            ABIs.masterchef,
            MASTERCHEF_ADDRESS
        );

        const spookyTokenContract = new args.web3.eth.Contract(
            ABIs.erc20,
            SPOOKY_TOKEN_ADDRESS
        );

        this.spookyDecimals = await spookyTokenContract.methods.decimals().call();

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

        const pid = args.subscription["pair"];
        const minimum = args.subscription["minimum"];

        const pendingReward = await this.masterchefContract.methods.pendingBOO(pid, args.address).call();

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.spookyDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = pid + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} BOO ready to claim`
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

        const pools = await this.masterchefContract.methods.poolLength().call();

        for (let poolId = 0; poolId < pools; poolId++) {

            contractCallContext.push({
                reference: 'masterchef-poolId-' + poolId,
                contractAddress: MASTERCHEF_ADDRESS,
                abi: ABIs.masterchef,
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

                const poolLabel = await this._getPairLabel(args, poolId);

                pairs.push({
                    value: poolId,
                    label: poolLabel
                });

            }

        }

        return pairs;

    }

    /**
     * takes a masterchef pool id and returns a string label of the two underlying tokens (like ETH-USDC)
     *
     * @param args
     * @param pid
     * @returns {Promise<string>}
     * @private
     */
    async _getPairLabel(args, pid) {

        const poolInfo = await this.masterchefContract.methods.poolInfo(pid).call();

        const lpContract = new args.web3.eth.Contract(ABIs.lp, poolInfo.lpToken);

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
