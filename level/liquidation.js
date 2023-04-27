const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require("ethereum-multicall");

const amountFormatter = Intl.NumberFormat('en');

const POOL_CONTRACT_ADDRESS = "0xA5aBFB56a78D2BD4689b25B8A77fd49Bb0675874";
const ORDER_MANAGER_CONTRACT_ADDRESS = "0xf584A17dF21Afd9de84F47842ECEAF6042b1Bb5b";

class Liquidation {

    static displayName = "Liquidation";
    static description = "Get notified when the your position has been liquidated";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.poolContract = new args.web3.eth.Contract(
            ABIs.pool,
            POOL_CONTRACT_ADDRESS
        );

        this.orderManagerContract = new args.web3.eth.Contract(
            ABIs.orderManager,
            ORDER_MANAGER_CONTRACT_ADDRESS
        );


    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const positions = await this._getAllUserPositions(args);

        return [
            {
                type: "input-select",
                id: "position",
                label: "Position",
                values: positions
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
    async _getAllUserPositions(args) {

        const orderIds = (await this.orderManagerContract.methods.getOrders(
            args.address,
            0,
            100
        ).call())[0]


        const positions = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        const pools = await this.masterchefContract.methods.poolLength().call();

        // starting from 1 bcs pool 0 is the cake token and will be called specifically later.
        for (let poolId = 1; poolId < pools; poolId++) {

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

                positions.push({
                    value: poolId,
                    label: poolLabel
                });

            }

        }

        return positions;

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

module.exports = Liquidation;
