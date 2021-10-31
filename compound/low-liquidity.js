const BigNumber = require("bignumber.js");
const contracts = require('./contracts');
const Contract = require('web3-eth-contract');

class LowLiquidity {

    static displayName = "Low Liquidity";
    static description = "Get notified when getting close to liquidation";
    static displayIcon = "hand";

    // runs when class is initialized
    async onInit(args) {
        const abi = contracts.lens.abi
        const addr = contracts.lens.addr
        this.contract = _createContract(args.web3, addr, abi)
    }

    async onSubscribeForm(args) {
        const {markets, liquidity, shortfall} = await this.contract.methods.getAccountLimits(contracts.comptroller.addr, args.address).call();

        const roughExcess = new BigNumber(liquidity)
            .dividedBy(1e18) // full units
            .dp(2, BigNumber.ROUND_HALF_DOWN)

        const defaultMin = roughExcess
            .dividedBy(10) // suggest 10% of the current liquidity
            .dp(2, BigNumber.ROUND_UP)
            .toString()
        const comment = markets.length > 0 && parseInt(shortfall) ?
            `CAUTION: you are currently in risk of liquidation` :
            `Your current excess liquidity is ~${roughExcess} ETH`
        return [
            {
                type: "input-number",
                id: "minLiquidity",
                label: "Minimum Liquidity",
                default: defaultMin,
                description: "The minimum desired liquidity denominated in ETH. " + comment
            }
        ];
    }

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {
        const minBnB = new BigNumber(args.subscription['minLiquidity']).multipliedBy(1e18)
        const {markets, liquidity, shortfall} = await this.contract.methods.getAccountLimits(contracts.comptroller.addr, args.address).call();

        console.log(`markets: ${markets}, liquidity: ${liquidity}, shortfall: ${shortfall}`)

        if (markets.length > 0 && minBnB.isGreaterThanOrEqualTo(new BigNumber(liquidity))) {
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

function _createContract(web3, address, abi) {
    const contract = new Contract(abi, address)
    contract.setProvider(web3.currentProvider)
    return contract
}

module.exports = LowLiquidity;
