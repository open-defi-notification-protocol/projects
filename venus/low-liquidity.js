const BN = require("bignumber.js");
const ABIs = require("./abis.json");

const COMPTROLLER_ADDRESS = '0xfD36E2c2a6789Db23113685031d7F16329158384';

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class LowLiquidity {

    static displayName = "Low Liquidity";
    static description = "Get notified when getting close to liquidation";
    static displayIcon = "hand";

    // runs when class is initialized
    async onInit(args) {

        this.comptrollerContract = new args.web3.eth.Contract(
            ABIs.comptroller,
            COMPTROLLER_ADDRESS
        );

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{default: string, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const result = await this.comptrollerContract.methods.getAccountLiquidity(args.address).call();

        let liquidity = new BN(result[1]);
        const shortfall = parseInt(result[2]);

        liquidity = liquidity.dividedBy('1e18');

        const comment = shortfall ?
            `CAUTION: you are currently in risk of liquidation` :
            `Your current excess liquidity is ~${amountFormatter.format(liquidity)} USD`;

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

        const thresholdUSD = new BN(minLiquidity).multipliedBy('1e18')

        const result = await this.comptrollerContract.methods.getAccountLiquidity(args.address).call();

        let liquidity = new BN(result[1]);

        const shortfall = parseInt(result[2]);

        if (thresholdUSD.isGreaterThanOrEqualTo(liquidity)) {

            const uniqueId = "liquidity-" + thresholdUSD;

            if (shortfall) {

                return {
                    uniqueId: uniqueId,
                    notification: `Act now! You are under-collateralized and about to be liquidated`
                }

            } else {

                return {
                    uniqueId: uniqueId,
                    notification: `Excess liquidity (~${amountFormatter.format(liquidity.dividedBy('1e18'))}) dropped below your safe minimum of ${minLiquidity} USD`
                }

            }
        }

        return [];
    }
}

module.exports = LowLiquidity;
