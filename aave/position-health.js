const BN = require("bignumber.js");
const ABIs = require('./abis.json');

const amountFormatter = Intl.NumberFormat('en');


class PositionHealth {

    static displayName = "Position Health";
    static description = "Get notified when Health Factor is getting below a certain threshold";

    /**
     * runs when class is initialized
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.contract = new args.web3.eth.Contract(
            ABIs.lendingPool,
            "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"
        );

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const healthFactorBN = await this._getPositionHealth(args);


        if (healthFactorBN !== 'no-position') {

            return [
                {
                    type: "input-number",
                    id: "threshold",
                    label: `Health Factor Threshold (current is ${amountFormatter.format(healthFactorBN.toString())})`,
                    default: "1.1",
                    description: "Notify me when the Health Factor of my position goes below this threshold."
                }
            ];

        } else {

            return [];

        }
    }


    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {


        const threshold = args.subscription["threshold"];

        const uniqueId = "aave-health-" + threshold;

        const healthFactorBN = await this._getPositionHealth(args);

        if (healthFactorBN !== 'no-position' && healthFactorBN.isLessThan(threshold)) return {
            uniqueId: uniqueId,
            notification: `Current Health Factor (${amountFormatter.format(healthFactorBN.toString())}) is below the threshold of ${threshold}!`
        };

        return [];
    }

    async _getPositionHealth(args) {

        const position = await this.contract.methods.getUserAccountData(args.address).call();

        return new BN(position.totalDebtETH).isGreaterThan(0) ? new BN(position.healthFactor).dividedBy("1e18") : 'no-position';

    }

}

module.exports = PositionHealth;
