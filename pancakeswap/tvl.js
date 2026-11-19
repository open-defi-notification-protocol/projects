const ABIs = require('./abis.json');
const BN = require("bignumber.js");

const ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const WBNB_TOKEN_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const USDC_TOKEN_ADDRESS = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class TVLWorth {

    static displayName = "TVL Worth";
    static description = "Track a pool's total value locked";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        const usdcContract = new args.web3.eth.Contract(ABIs.erc20, USDC_TOKEN_ADDRESS);

        this.usdcDecimals = await usdcContract.methods.decimals().call();

        this.routerContract = new args.web3.eth.Contract(
            ABIs.router,
            ROUTER_ADDRESS
        );

        this.tvlMap = {};

    }


    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        return [
            {
                type: "input-address",
                id: "poolAddress",
                label: "Pool Address",
                default: '',
                description: "The pair pool contract address"
            },
            {
                type: "input-select",
                id: "above-below",
                label: "Above/Below",
                values: [
                    {value: "0", label: "Above"},
                    {value: "1", label: "Below"}
                ]
            },
            {
                type: "input-number",
                id: "threshold",
                label: "Threshold price",
                default: 0,
                description: "Notify me when the TVL goes above/below this value in USD"
            }
        ];

    }

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const web3 = args.web3;
        const subscription = args.subscription;

        const threshold = subscription['threshold'];
        const poolAddress = subscription['poolAddress'];
        const above = subscription["above-below"] === "0";

        let poolInfo = this.tvlMap[poolAddress];

        if (poolInfo === undefined) {

            const {tvl, poolName} = await this._getTVLWorthInUsdBN(
                web3,
                poolAddress
            );

            this.tvlMap[poolAddress] = poolInfo = {
                poolName: poolName,
                tvl: tvl
            };

        }

        const uniqueId = poolAddress + "-" + above + "-" + threshold;

        if ((above && poolInfo.tvl.gt(threshold)) || (!above && poolInfo.tvl.lt(threshold))) {

            return {
                uniqueId: uniqueId,
                notification: `TVL in ${poolInfo.poolName} (${amountFormatter.format(poolInfo.tvl)}) ${above ? 'is above' : 'has dropped below'} ${amountFormatter.format(threshold)} USD`
            };

        } else {

            return [];

        }

    }

    /**
     *
     * @param web3
     * @param poolAddress
     * @returns {Promise<{tvl: *, poolName: string}>}
     * @private
     */
    async _getTVLWorthInUsdBN(web3, poolAddress) {

        const poolContract = new web3.eth.Contract(ABIs.lp, poolAddress);

        const reserves = await poolContract.methods.getReserves().call()

        const token0Address = await poolContract.methods.token0().call()
        const token1Address = await poolContract.methods.token1().call()

        const {tvl: token0TVLInUsdBN, tokenSymbol: token0Symbol} = await this._getUSDValueBN(
            web3,
            token0Address,
            reserves._reserve0
        );

        const {tvl: token1TVLInUsdBN, tokenSymbol: token1Symbol} = await this._getUSDValueBN(
            web3,
            token1Address,
            reserves._reserve1
        );

        return {tvl: token0TVLInUsdBN.plus(token1TVLInUsdBN), poolName: `${token0Symbol}-${token1Symbol}`}

    }

    /**
     *
     * @returns {Promise<*>}
     * @private
     */
    async _getUSDValueBN(web3, tokenAddress, reserve) {

        const reserveBN = new BN(reserve);

        const tokenContract = new web3.eth.Contract(ABIs.lp, tokenAddress);
        const tokenSymbol = await tokenContract.methods.symbol().call()

        if (reserveBN.isGreaterThan(0)) {

            const tokenDecimals = await tokenContract.methods.decimals().call()

            const singleTokenWorthInUSD = await this.routerContract.methods.getAmountsOut(
                (new BN("10").pow(tokenDecimals)), // single whole unit
                tokenAddress === WBNB_TOKEN_ADDRESS ? [WBNB_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS] : [tokenAddress, WBNB_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS]
            ).call();

            return {
                tvl: new BN(singleTokenWorthInUSD[[tokenAddress === WBNB_TOKEN_ADDRESS ? 1 : 2]]).dividedBy('1e' + this.usdcDecimals)
                    .multipliedBy(reserveBN).dividedBy('1e' + tokenDecimals),
                tokenSymbol: tokenSymbol
            };

        } else {

            return {tvl: new BN(0), tokenSymbol: tokenSymbol};

        }
    }
}

module.exports = TVLWorth;
