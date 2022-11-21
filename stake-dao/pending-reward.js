const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const GAUGE_CONTROLLER_ADDRESS = "0x75f8f7fa4b6DA6De9F4fE972c811b778cefce882";
const SDT_TOKEN_ADDRESS = "0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class PendingReward {

    static displayName = "Pending Reward";
    static description = "Get notified when enough SDT reward is ready to claim";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.gaugeControllerContract = new args.web3.eth.Contract(
            ABIs.gaugeController,
            GAUGE_CONTROLLER_ADDRESS
        );

        const sdtTokenContract = new args.web3.eth.Contract(
            ABIs.erc20,
            SDT_TOKEN_ADDRESS
        );

        this.sdtDecimals = await sdtTokenContract.methods.decimals().call();

        this.gaugesContracts = {}

    }


    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const gauges = await this._getAllUserGauges(args);

        return [
            {
                type: "input-select",
                id: "gauge",
                label: "Gauge",
                values: gauges
            },
            {
                type: "input-number",
                id: "minimum",
                label: "Minimum SDT",
                default: 0,
                description: "Minimum amount of claimable SDT to be notified about"
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

        const gauge = args.subscription["gauge"];

        const minimum = args.subscription["minimum"];

        const gaugeContract = this._getGaugeContract(args.web3, gauge);

        const pendingReward = await gaugeContract.methods.claimable_reward(args.address, SDT_TOKEN_ADDRESS).call();

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.sdtDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = gauge + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} SDT ready to claim`
            };

        } else {

            return [];

        }
    }

    /**
     * returns all the masterchef gauges that the user has LPs deposited in
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserGauges(args) {

        const gauges = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        let contractCallContext = [];

        const nGauges = await this.gaugeControllerContract.methods.n_gauges().call();

        for (let gaugeId = 0; gaugeId < nGauges; gaugeId++) {

            contractCallContext.push({
                reference: 'gaugeId-' + gaugeId,
                contractAddress: GAUGE_CONTROLLER_ADDRESS,
                abi: ABIs.gaugeController,
                calls: [{reference: 'gaugesCall', methodName: 'gauges', methodParameters: [gaugeId]}]
            });

        }

        let results = (await multicall.call(contractCallContext)).results;

        contractCallContext = [];

        for (const result of Object.values(results)) {

            const gaugeAddress = result.callsReturnContext[0].returnValues[0];

            contractCallContext.push({
                reference: 'gauge-' + gaugeAddress,
                contractAddress: gaugeAddress,
                abi: ABIs.gauge,
                calls: [{reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [args.address]}],
                context: {
                    gaugeAddress: gaugeAddress
                }
            });

        }

        results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const gaugeAddress = result.originalContractCallContext.context.gaugeAddress;

                const gaugeContract = this._getGaugeContract(args.web3, gaugeAddress);

                const gaugeLabel = await gaugeContract.methods.name().call()

                gauges.push({
                    value: gaugeAddress,
                    label: gaugeLabel
                });

            }

        }

        return gauges;

    }

    /**
     *
     */
    _getGaugeContract(web3, address) {

        return this.gaugesContracts[address] = this.gaugesContracts[address] || new web3.eth.Contract(
            ABIs.gauge,
            address
        );

    }

}

module.exports = PendingReward;
