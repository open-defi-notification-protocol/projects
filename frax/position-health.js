const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require("ethereum-multicall");

const amountFormatter = Intl.NumberFormat('en');

const DEPLOYER_CONTRACT_ADDRESS = "0x5d6e79Bcf90140585CE88c7119b7E43CAaA67044";
const FRAXLEND_PAIR_HELPER_ADDRESS = "0x26fa88b783cE712a2Fa10E91296Caf3daAE0AB37";

class PositionHealth {

    static displayName = "Position Health";
    static description = "Get notified when the LTV (Loan-To-Value) of your position is above a certain threshold";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.deployerContract = new args.web3.eth.Contract(
            ABIs.deployer,
            DEPLOYER_CONTRACT_ADDRESS
        );


    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const pairs = await this._getAllUserPairs(args);

        return [
            {
                type: "input-select",
                id: "pair",
                label: "Pair (Current Position LTV)",
                values: pairs
            },
            {
                type: "input-number",
                id: "threshold",
                label: "LTV Threshold",
                suffix: '',
                default: 70,
                description: "Notify me when the LTV of my position goes above this threshold."
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

        const pairAddress = args.subscription["pair"];

        const userLTVBN = await this._getUserLTVBN(args, pairAddress);

        const threshold = args.subscription["threshold"];

        if (userLTVBN.isGreaterThan(threshold)) {

            const pairLabel = await this._getPairLabel(args, pairAddress, userLTVBN);

            return {
                uniqueId: pairAddress + "-" + threshold,
                notification: `The LTV of your position in ${pairLabel} is above the threshold of ${args.subscription["threshold"]}`
            };

        } else {
            return [];
        }
    }

    /**
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPairs(args) {

        const pairs = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        const allPairsAddresses = await this.deployerContract.methods.getAllPairAddresses().call();

        for (let pairAddress of allPairsAddresses) {

            contractCallContext.push({
                reference: 'poolId-' + pairAddress,
                contractAddress: pairAddress,
                abi: ABIs.pair,
                calls: [{
                    reference: 'userBorrowSharesCall',
                    methodName: 'userBorrowShares',
                    methodParameters: [args.address]
                }],
                context: {
                    pairAddress: pairAddress
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userBorrowShares = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userBorrowShares.isGreaterThan("0")) {

                const pairAddress = result.originalContractCallContext.context.pairAddress;

                const userLTV = (await this._getUserLTVBN(args, pairAddress)).toString();

                const poolLabel = await this._getPairLabel(
                    args,
                    pairAddress,
                    userLTV
                );

                pairs.push({
                    value: pairAddress,
                    label: poolLabel,
                });

            }

        }

        return pairs;
    }

    /**
     *
     * @param args
     * @param pairAddress
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getUserLTVBN(args, pairAddress) {

        const fraxlendPairHelperContract = new args.web3.eth.Contract(ABIs.pairHelperAbi, FRAXLEND_PAIR_HELPER_ADDRESS);

        const collateral_1usd_rate = await fraxlendPairHelperContract.methods.previewUpdateExchangeRate(pairAddress).call();

        // Get some user accounting information

        let result = await fraxlendPairHelperContract.methods.getUserSnapshot(pairAddress, args.address).call();

        const borrowSharesBN = new BN(result[1])
        const collateralBalance = result[2]

        result = await fraxlendPairHelperContract.methods.getPairAccounting(pairAddress).call();
        const totalBorrowAmount = result[2]
        const totalBorrowShares = result[3]

        // Calculate LTV

        const userBorrowAmountBN = borrowSharesBN.multipliedBy(totalBorrowAmount).dividedBy(totalBorrowShares);

        // taken from the frax liquidator bot code (https://github.com/FraxFinance/fraxlend/blob/2541696d98441afafed7a380e0b7a46c638a5c00/src/liquidatorBot/bot.mjs)
        return userBorrowAmountBN.multipliedBy(collateral_1usd_rate).dividedBy('1e18').multipliedBy('1e5').dividedBy(collateralBalance).dividedBy('1e3');

    }

    /**
     *
     */
    async _getPairLabel(args, pairAddress, userLTV) {

        const pairContract = new args.web3.eth.Contract(ABIs.pair, pairAddress);

        let pairLabel = await pairContract.methods.symbol().call();

        pairLabel = pairLabel.replace('FraxlendV1 - ', '')

        return `${pairLabel} (${amountFormatter.format(userLTV)})`;

    }
}

module.exports = PositionHealth;
