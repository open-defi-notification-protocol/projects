const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const GAUGE_PROXY_ADDRESS = "0x420b17f69618610DE18caCd1499460EFb29e1d8f";
const SPIRIT_TOKEN_ADDRESS = "0x5Cc61A78F164885776AA610fb0FE1257df78E59B";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class PendingReward {

    static displayName = "Pending Reward V2";
    static description = "Get notified when enough reward is ready to claim";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.gaugeProxyContract = new args.web3.eth.Contract(
            ABIs.gaugeProxy,
            GAUGE_PROXY_ADDRESS
        );

        const tokens = await this.gaugeProxyContract.methods.tokens().call();

        this.lpTokensGaugesMap = await this._getAllTokensGauges(
            args.web3
        );

        const spiritTokenContract = new args.web3.eth.Contract(
            ABIs.erc20,
            SPIRIT_TOKEN_ADDRESS
        );

        this.spiritDecimals = await spiritTokenContract.methods.decimals().call();

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
                label: "Minimum SPIRIT",
                default: 0,
                description: "Minimum amount of claimable SPIRIT to be notified about"
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

        const lpToken = args.subscription["pair"];
        const minimum = args.subscription["minimum"];

        const gaugeAddress = this.lpTokensGaugesMap[lpToken];

        const gaugeContract = new args.web3.eth.Contract(ABIs.gauge, gaugeAddress);

        const pendingReward = await gaugeContract.methods.earned(args.address).call();

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.spiritDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = lpToken + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} SPIRIT ready to claim`
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

        for (const lpToken in this.lpTokensGaugesMap) {

            const gauge = this.lpTokensGaugesMap[lpToken];

            contractCallContext.push({
                reference: 'gauge-' + gauge,
                contractAddress: gauge,
                abi: ABIs.gauge,
                calls: [{reference: 'userInfoCall', methodName: 'balanceOf', methodParameters: [args.address]}],
                context: {
                    lpToken: lpToken
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const lpToken = result.originalContractCallContext.context.lpToken;

                const poolLabel = await this._getPairLabel(args, lpToken);

                pairs.push({
                    value: lpToken,
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
     * @param lpToken
     * @returns {Promise<string>}
     * @private
     */
    async _getPairLabel(args, lpToken) {

        const lpContract = new args.web3.eth.Contract(ABIs.lp, lpToken);

        const token0 = await lpContract.methods.token0().call();
        const token1 = await lpContract.methods.token1().call();

        const token0Contract = new args.web3.eth.Contract(ABIs.erc20, token0);
        const token1Contract = new args.web3.eth.Contract(ABIs.erc20, token1);

        const token0Symbol = await token0Contract.methods.symbol().call();
        const token1Symbol = await token1Contract.methods.symbol().call();

        return token0Symbol + "-" + token1Symbol;

    }

    async _getAllTokensGauges(web3) {

        const tokensGauges = {};

        const multicall = new EthereumMulticall.Multicall({web3Instance: web3, tryAggregate: true});

        const contractCallContext = [];

        const tokens = await this.gaugeProxyContract.methods.tokens().call();

        for (let i = 0; i < tokens.length; i++) {

            const token = tokens[i];

            contractCallContext.push({
                reference: 'gauge-proxy-token-' + token,
                contractAddress: GAUGE_PROXY_ADDRESS,
                abi: ABIs.gaugeProxy,
                calls: [{reference: 'getGaugeCall', methodName: 'getGauge', methodParameters: [token]}],
                context: {
                    token: token
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const token = result.originalContractCallContext.context.token;

            tokensGauges[token] = result.callsReturnContext[0].returnValues[0];

        }

        return tokensGauges;

    }

}

module.exports = PendingReward;
