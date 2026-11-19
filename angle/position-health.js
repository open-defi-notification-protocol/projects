const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');
const fetch = require("node-fetch");

const amountFormatter = Intl.NumberFormat('en',{
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

class PositionHealth {

    static displayName = "Position Health";
    static description = "Get notified when Health Factor is getting below a certain threshold";

    static vaultsCollateralFactorsMap = {};

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        const response = await fetch('https://api.angle.money/v1/vaultManagers?chainId=1');

        const json = await response.json();

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        for (const vaultManager of Object.keys(json)) {

            contractCallContext.push({
                reference: 'vaultManager-' + vaultManager,
                contractAddress: vaultManager,
                abi: ABIs.vaultManager,
                calls: [{
                    reference: 'collateralFactorCall',
                    methodName: 'collateralFactor'
                }],
                context: {
                    vaultManager: vaultManager
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const collateralFactor = new BN(result.callsReturnContext[0].returnValues[0].hex);

            const vaultAddress = result.originalContractCallContext.context.vaultManager;

            PositionHealth.vaultsCollateralFactorsMap[vaultAddress] = collateralFactor;

        }

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const vaults = await this._getAllUserValuts(args);

        return [
            {
                type: "input-select",
                id: "vault",
                label: "Vault (Current Health Factor)",
                values: vaults
            },
            {
                type: "input-number",
                id: "threshold",
                label: "Health Factor Threshold",
                default: 10,
                description: "Notify me when the Health Factor of my position goes below this threshold."
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

        const parts = args.subscription["vault"].split("*");

        const vaultAddress = parts[0];
        const positionId = parts[1];

        const response = await fetch('https://api.angle.money/v1/vaults?chainId=1&user=' + args.address);

        const json = await response.json();

        let position = Object.values(json).find(_position => _position.address === vaultAddress);

        const healthFactor = this._calcHealthFactor(
            vaultAddress,
            position.collateralRatio
        );

        const threshold = args.subscription["threshold"];

        if (new BN(healthFactor).isLessThan(threshold)) {

            const vaultLabel = this._getVaultLabel(position.symbol, healthFactor);

            return {
                notification: `The Health Factor of your position in ${vaultLabel} is at or below ${args.subscription["threshold"]}. (Position id: ${positionId})`
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
    async _getAllUserValuts(args) {

        const vaults = [];

        const response = await fetch('https://api.angle.money/v1/vaults?chainId=1&user=' + args.address);

        const json = await response.json();

        for (const position of Object.values(json)) {

            const vaultAddress = position.address;
            const positionId = position.id;

            const healthFactor = this._calcHealthFactor(
                vaultAddress,
                position.collateralRatio
            );

            vaults.push({
                value: vaultAddress + "*" + positionId,
                label: this._getVaultLabel(position.symbol, healthFactor)
            });

        }

        return vaults;

    }

    /**
     * takes a minichef pool id and returns a string label of the two underlying tokens (like ETH-USDC)
     *
     * @returns {string}
     * @private
     * @param vaultAddress
     * @param collateralRatio
     */
    _calcHealthFactor(vaultAddress, collateralRatio) {

        const collateralFactor = new BN(PositionHealth.vaultsCollateralFactorsMap[vaultAddress]).dividedBy('1e9')

        const minCollateralRatio = new BN(100).dividedBy(collateralFactor)

        return new BN(collateralRatio).dividedBy(minCollateralRatio).toString()

    }

    /**
     *
     * @param symbol
     * @param healthFactor
     * @returns {string}
     * @private
     */
    _getVaultLabel(symbol, healthFactor) {

        return `${symbol.replace('-vault', '')} (${amountFormatter.format(healthFactor)})`;

    }

}

module.exports = PositionHealth;
