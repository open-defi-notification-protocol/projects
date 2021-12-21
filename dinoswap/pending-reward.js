const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const ROUTER_ADDRESS = "0x1948abc5400aa1d72223882958da3bec643fb4e5";

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

        this.contract = new args.web3.eth.Contract(
            ABIs.router,
            "0x1948abc5400aa1d72223882958da3bec643fb4e5"
        );

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
                label: "Minimum DINO",
                default: 0,
                description: "Minimum amount of claimable DINO tokens to be notified about"
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

        const pendingReward = await this.contract.methods.pendingDino(args.subscription["pair"], args.address).call();

        if (new BN(pendingReward).dividedBy("1e18").isGreaterThanOrEqualTo(args.subscription["minimum"])) {

            return {

                notification: "You have lots of DINO ready to be claimed"

            };

        } else {

            return [];

        }
    }

    /**
     * returns all the MasterChef pairs that the user has LPs deposited in
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPairs(args) {

        const pairs = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const poolsLength = await this.contract.methods.poolLength().call();

        const contractCallContext = [];

        for (let pid = 0; pid < poolsLength; pid++) {

            contractCallContext.push({
                reference: 'router-pid-' + pid,
                contractAddress: ROUTER_ADDRESS,
                abi: ABIs.router,
                calls: [{reference: 'userInfoCall', methodName: 'userInfo', methodParameters: [pid, args.address]}],
                context: {
                    pid: pid
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const amount = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (amount.isGreaterThan("0")) {

                const pid = result.originalContractCallContext.context.pid;

                try {

                    pairs.push({
                        value: pid,
                        label: await this._getPairLabel(args, pid)
                    });

                } catch (ignore) {

                    // unsupported farm

                }

            }

        }

        return pairs;
    }

    /**
     * takes a Masterchef pool id and returns a string label of the two underlying tokens (like ETH-USDC)
     *
     * @param args
     * @param pid
     * @returns {Promise<string>}
     * @private
     */
    async _getPairLabel(args, pid) {

        const poolInfo = await this.contract.methods.poolInfo(pid).call();

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
