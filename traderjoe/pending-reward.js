const EthereumMulticall = require("ethereum-multicall");
const ABIs = require("./abis.json");
const BN = require("bignumber.js");

const MASTERCHEF_ADDRESS = "0xd6a4F121CA35509aF06A0Be99093d08462f53052";
const JOE_TOKEN_ADDRESS = "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class AccountHealth {

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

        const joeContract = new args.web3.eth.Contract(
            ABIs.erc20,
            JOE_TOKEN_ADDRESS
        );

        this.joeDecimals = await joeContract.methods.decimals().call();

    }


    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const pools = await this._getAllUserPools(args);

        return [
            {
                type: "input-select",
                id: "pool",
                label: "Pool",
                values: pools
            },
            {
                type: "input-number",
                id: "minimum",
                label: "Minimum JOE",
                default: 0,
                description: "Minimum amount of claimable JOE tokens to be notified about"
            }
        ];


    }

    /**
     * returns all the pairs that the user has LPs deposited in or staked on rewards contract
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPools(args) {

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

                pairs.push({
                    value: poolId,
                    label: await this._getPairLabel(args, poolId)
                });

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

    /**
     * runs when endpoint's chain is extended - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        let pool = args.subscription["pool"];

        const pendingReward = await this.masterchefContract.methods.pendingTokens(pool, args.address).call();

        const pendingRewardBN = new BN(pendingReward['pendingJoe']).dividedBy('1e' + this.joeDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(args.subscription["minimum"])) {

            return {

                notification: `You have ${amountFormatter.format(pendingRewardBN)} JOE ready to claim`

            };

        } else {

            return [];

        }
    }


}


module.exports = AccountHealth
