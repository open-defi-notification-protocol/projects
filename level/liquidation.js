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

        const {indexTokens, stableTokens} = await this._getTokensList(args.web3);
        this.indexTokens = indexTokens;
        this.stableTokens = stableTokens;

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

        const positionKey = args.subscription["position"];

        const threshold = args.subscription["threshold"];

        if (userLTVBN.isGreaterThan(threshold)) {

            const pairLabel = await this._getPairLabel(args, pairAddress, userLTVBN);

            return {
                uniqueId: positionKey + "-" + threshold,
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

        /*
                const orderIds = (await this.orderManagerContract.methods.getOrders(
                    args.address,
                    0,
                    100
                ).call())[0]
        */

        const positionKeys = {}

        for (const indexToken of this.indexTokens) {

            const longPosKey = args.web3.utils.keccak256(args.web3.eth.abi.encodeParameters(
                ["address", "address", "address", "uint8"],
                [args.address, indexToken, indexToken, 0]));

            positionKeys[longPosKey] = {
                indexToken,
                collateralToken: indexToken,
                side: 0
            };

            for (const stableToken of this.stableTokens) {

                let shortPosKey = args.web3.utils.keccak256(args.web3.eth.abi.encodeParameters(
                    ["address", "address", "address", "uint8"],
                    [args.address, indexToken, stableToken, 1]));

                positionKeys[shortPosKey] = {
                    indexToken,
                    collateralToken: stableToken,
                    side: 1
                };

            }

        }

        const positions = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        // starting from 1 bcs pool 0 is the cake token and will be called specifically later.
        for (const positionKey in positionKeys) {

            contractCallContext.push({
                reference: 'pool-positionKey-' + positionKey,
                contractAddress: POOL_CONTRACT_ADDRESS,
                abi: ABIs.pool,
                calls: [{reference: 'positionsCall', methodName: 'positions', methodParameters: [positionKey]}],
                context: {
                    positionKey: positionKey
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const positionValues = result.callsReturnContext[0].returnValues;

            if (new BN(positionValues[1].hex).isGreaterThan("0")) {

                const positionKey = result.originalContractCallContext.context.positionKey;

                const poolLabel = await this._getPairLabel(
                    args,
                    positionKeys[positionKey],
                    positionValues
                );

                positions.push({
                    value: positionKey,
                    label: poolLabel
                });

            }

        }

        return positions;

    }

    async _getTokensList(web3) {

        const assetCount = parseInt(await web3.eth.getStorageAt(POOL_CONTRACT_ADDRESS, '0xa2')); // read length of assets array

        const indexTokens = [];
        const stableTokens = [];

        for (let i = 0; i < assetCount; i++) {

            const token = await this.poolContract.methods.allAssets(i).call();

            // now you may want to check if this token is stable coin
            const isStable = await this.poolContract.methods.isStableCoin(token).call();

            if (isStable) {
                stableTokens.push(token);
            } else {
                indexTokens.push(token);
            }
        }

        return {indexTokens, stableTokens};

    }

    /**
     *
     */
    async _getPairLabel(args, positionInfo, positionValues) {

        const indexTokenContract = new args.web3.eth.Contract(ABIs.erc20, positionInfo.indexToken);
        const collateralTokenContract = new args.web3.eth.Contract(ABIs.erc20, positionInfo.collateralToken);

        const indexTokenLabel = await indexTokenContract.methods.symbol().call();
        const collateralTokenLabel = await collateralTokenContract.methods.symbol().call();

        const sizeValue = amountFormatter.format(new BN(positionValues[0].hex).dividedBy('1e30').toFixed());
        const collateralValue = amountFormatter.format(new BN(positionValues[1].hex).dividedBy('1e30').toFixed());

        return `${positionInfo.side === 1 ? 'Short' : 'Long'} position, Size: ${sizeValue} ${indexTokenLabel}, Collateral: ${collateralValue} ${collateralTokenLabel}`;

    }
}

module.exports = Liquidation;
