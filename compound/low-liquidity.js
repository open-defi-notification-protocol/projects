const BigNumber = require("bignumber.js");
const ABIs = require('./abis.json');


const LENS_ADDRESS = '0xA6c8D1c55951e8AC44a0EaA959Be5Fd21cc07531'
const COMPTROLLER_ADDRESS = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b'

class LowLiquidity {

    static displayName = "Low Liquidity";
    static description = "Get notified when getting close to liquidation";
    static displayIcon = "hand";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.lensContract = new args.web3.eth.Contract(
            ABIs.compoundLens,
            LENS_ADDRESS
        )

    }

    /**
     *
     * @param args
     * @returns {Promise<[{default: string, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {
        const {
            markets,
            liquidity,
            shortfall
        } = await this.lensContract.methods.getAccountLimits(COMPTROLLER_ADDRESS, args.address).call();

        const roughExcess = new BigNumber(liquidity)
            .dividedBy(1e18) // full units
            .dp(2, BigNumber.ROUND_HALF_DOWN)

        const defaultMin = roughExcess
            .dividedBy(10) // suggest 10% of the current liquidity
            .dp(2, BigNumber.ROUND_UP)
            .toString()
        const comment = markets.length > 0 && parseInt(shortfall) ?
            `CAUTION: you are currently in risk of liquidation` :
            `Your current excess liquidity is ~${roughExcess} USD`
        return [
            {
                type: "input-number",
                id: "minLiquidity",
                label: "Minimum Liquidity",
                default: defaultMin,
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

        const threshold = new BigNumber(args.subscription['threshold']).multipliedBy(1e18)

        const {
            markets,
            liquidity,
            shortfall
        } = await this.lensContract.methods.getAccountLimits(COMPTROLLER_ADDRESS, args.address).call();

        console.log(`markets: ${markets}, liquidity: ${liquidity}, shortfall: ${shortfall}`)

        if (markets.length > 0 && threshold.isGreaterThanOrEqualTo(new BigNumber(liquidity))) {

            if (shortfall > 0) {

                return {
                    notification: `Act now! You are under-collateralized and about to be liquidated`
                }

            } else {

                return {
                    notification: `Excess liquidity dropped below your safe minimum`
                }

            }

        }

        return [];
    }
}

module.exports = LowLiquidity;
