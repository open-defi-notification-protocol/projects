const ABIs = require('./abis.json');
const BN = require("bignumber.js");

const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const WETH_TOKEN_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const USDC_TOKEN_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class TokensWorth {

    static displayName = "Tokens Worth";
    static description = "Track your tokens total value";

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
                id: "tokenAddress",
                label: "Token Address",
                default: '',
                description: "The token contract address"
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
                description: "Notify me when the value of my tokens goes above/below this value in USD"
            }
        ];

    }

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const web3 = args.web3;
        const subscription = args.subscription;

        const threshold = subscription['threshold'];
        const tokenAddress = subscription['tokenAddress'];
        const above = subscription["above-below"] === "0";

        const tokenContract = new web3.eth.Contract(ABIs.erc20, tokenAddress);

        const walletTokensWorthInUsdBN = await this._getPositionWorthInUsdBN(
            web3,
            args.address,
            tokenAddress,
            tokenContract
        );

        const uniqueId = tokenAddress + "-" + above + "-" + threshold;

        if ((above && walletTokensWorthInUsdBN.gt(threshold)) || (!above && walletTokensWorthInUsdBN.lt(threshold))) {

            const tokenSymbol = await tokenContract.methods.symbol().call();

            return {
                uniqueId: uniqueId,
                notification: `Your holdings in ${tokenSymbol} (${amountFormatter.format(walletTokensWorthInUsdBN)}) ${above ? 'are above' : 'has dropped below'} ${amountFormatter.format(threshold)} USD`
            };

        } else {

            return [];

        }

    }

    /**
     *
     * @param walletAddress
     * @param tokenContract
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getWalletTotalTokenBalanceBN(walletAddress, tokenContract) {

        const walletUnstakedBalance = await tokenContract.methods.balanceOf(walletAddress).call();

        return new BN(walletUnstakedBalance);

    }

    /**
     * get the usd value of the wallet tokens balance
     *
     * @param web3
     * @param walletAddress
     * @param tokenAddress
     * @param tokenContract
     * @returns {Promise<BigNumber>}
     * @private
     */
    async _getPositionWorthInUsdBN(web3, walletAddress, tokenAddress, tokenContract) {

        const walletLpBalanceBN = await this._getWalletTotalTokenBalanceBN(
            walletAddress,
            tokenContract
        );

        if (walletLpBalanceBN.isGreaterThan(0)) {

            const tokenDecimals = await tokenContract.methods.decimals().call()

            const singleTokenWorthInUSD = await this.routerContract.methods.getAmountsOut(
                (new BN("10").pow(tokenDecimals)), // single whole unit
                tokenAddress === WETH_TOKEN_ADDRESS ? [WETH_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS] : [tokenAddress, WETH_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS]
            ).call();

            return new BN(singleTokenWorthInUSD[tokenAddress === WETH_TOKEN_ADDRESS ? 1 : 2]).dividedBy('1e' + this.usdcDecimals)
                .multipliedBy(walletLpBalanceBN).dividedBy('1e' + tokenDecimals)

        } else {

            return new BN(0);

        }

    }


}

module.exports = TokensWorth;
