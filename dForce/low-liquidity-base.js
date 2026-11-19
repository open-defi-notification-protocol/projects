const BN = require("bignumber.js");
const ABIs = require("./abis.json");
const addresses = require("./addresses.json");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

module.exports = class dForceBase {
    static displayIcon = "hand";

	constructor(network) {
        this.network = network;
		this.controllerAddress = addresses[network];
	}

	/**
	 * runs when class is initialized
	 *
	 * @param args
	 * @returns {Promise<void>}
	 */
	async onInit(args) {
		const web3 = args.web3;
		this.controllerContract = new web3.eth.Contract(ABIs.controller, this.controllerAddress);
	}

	/**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{default: string, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const result = await this.controllerContract.methods.calcAccountEquity(args.address).call();

        let liquidity = new BN(result[0]);
        const shortfall = parseInt(result[1]);

        liquidity = liquidity.dividedBy('1e36');

        const comment = shortfall ?
            `CAUTION: you are currently in risk of liquidation on ${this.network}` :
            `Your current excess liquidity is ~${amountFormatter.format(liquidity)} USD on ${this.network}`;

        return [
            {
                type: "input-number",
                id: "minLiquidity",
                label: "Minimum Liquidity",
                default: 0,
                description: "The minimum desired liquidity denominated in USD. " + comment
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

        const minLiquidity = args.subscription['minLiquidity'];

        const thresholdUSD = new BN(minLiquidity).multipliedBy('1e36')

        const result = await this.controllerContract.methods.calcAccountEquity(args.address).call();

        let liquidity = new BN(result[0]);

        const shortfall = parseInt(result[1]);

        if (thresholdUSD.isGreaterThanOrEqualTo(liquidity)) {

            const uniqueId = `liquidity-${this.network}-` + thresholdUSD;

            if (shortfall) {

                return {
                    uniqueId: uniqueId,
                    notification: `Act now! You are under-collateralized and about to be liquidated on ${this.network}`
                }

            } else {

                return {
                    uniqueId: uniqueId,
                    notification: `Excess liquidity (~${amountFormatter.format(liquidity.dividedBy('1e36'))}) dropped below your safe minimum of ${minLiquidity} USD on ${this.network}`
                }

            }
        }

        return [];
    }
}
