const BN = require("bignumber.js");
const fetch = require("node-fetch");
const ABIs = require('./abis.json');

class PositionHealth {

    static displayName = "Position Health";
    static description = "Get notified when Safety Buffer is getting low";
    static network = "bsc";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {
    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const vaults = await this._getAllUserVaults(args);

        return [
            {
                type: "input-select",
                id: "vault",
                label: "Vault (Current Safety Buffer)",
                values: vaults
            },
            {
                type: "input-number",
                id: "threshold",
                label: "Safety Buffer Threshold",
                suffix: '%',
                default: 10,
                description: "Notify me when the Safety Buffer of my position goes below this threshold."
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
        const healthFactorNow = await this._getHealthFactor(args, vaultAddress, positionId);

        const threshold = args.subscription["threshold"];

        if (new BN(healthFactorNow).isLessThan(threshold)) {

            const vaultLabel = await this._getVaultLabel(args, vaultAddress, healthFactorNow, positionId);

            return {
                notification: `The Safety Buffer of your position in ${vaultLabel} is at or below ${args.subscription["threshold"]}%`
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
    async _getAllUserVaults(args) {

        const vaults = [];

        const response = await fetch('https://api.alpacafinance.org/v1/positions?owner=' + args.address);

        const json = await response.json();

        for (let vid = 0; vid < json.data.positions.length; vid++) {
            const position = json.data.positions[vid];
            const vaultAddress = position.vault;
            const positionId = position.positionId;
            const healthFactor = await this._getHealthFactor(args, vaultAddress, positionId);

            if (healthFactor !== null) {

                vaults.push({
                    value: vaultAddress + "*" + positionId,
                    label: await this._getVaultLabel(args, vaultAddress, healthFactor, positionId)
                });

            }

        }

        return vaults;
    }

    /**
     *
     * @param args
     * @param vaultAddress
     * @param positionId
     * @returns {Promise<number>}
     * @private
     */
    async _getHealthFactor(args, vaultAddress, positionId) {

        const vaultContract = new args.web3.eth.Contract(ABIs.vault, vaultAddress);
        const configAddress = await vaultContract.methods.config().call();

        const configContract = new args.web3.eth.Contract(ABIs.config, configAddress);

        const position = await vaultContract.methods.positions(positionId).call();

        const positionInfo = await vaultContract.methods.positionInfo(positionId).call();

        if (position.debtShare > 0 && positionInfo[0] !== 0) {

            const killFactor = (await configContract.methods.killFactor(position.worker, position.debtShare).call()) / 10000;

            const debtRatio = positionInfo[1] / positionInfo[0];

            return (killFactor - debtRatio) * 100;


        } else {

            return null;

        }

    }

    /**
     *
     * @param args
     * @param vaultAddress
     * @param healthFactor
     * @param positionId
     * @returns {Promise<string>}
     * @private
     */
    async _getVaultLabel(args, vaultAddress, healthFactor, positionId) {

        const vaultContract = new args.web3.eth.Contract(ABIs.vault, vaultAddress);

        let vaultLabel = await vaultContract.methods.name().call();

        vaultLabel = vaultLabel.replace('Interest Bearing', 'LYF')

        return `${vaultLabel} #${positionId} (${Math.round(healthFactor)}%)`;

    }
}

module.exports = PositionHealth;
