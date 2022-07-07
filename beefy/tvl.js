const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');
const fetch = require("node-fetch");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class Tvl {

    static displayName = "TVL Worth";
    static description = "Track a vault's total value locked";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        let res = await fetch("https://api.beefy.finance/vaults", {
            mode: "cors",
            headers: {origin: "https://api.beefy.finance"}
        });

        this.vaults = {};

        const result = await res.json();

        for (const vaultInfo of Object.values(result)) {

            if (vaultInfo.network === 'arbitrum' && vaultInfo.status === 'active') {

                this.vaults[vaultInfo.earnContractAddress] = vaultInfo;

            }

        }

        res = await fetch("https://api.beefy.finance/prices", {
            mode: "cors",
            headers: {origin: "https://api.beefy.finance"}
        });

        const prices = await res.json();

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const relevantVaults = await this._getAllUserVaults(args);

        return [
            {
                type: "input-select",
                id: "vault",
                label: "Vault",
                values: relevantVaults
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
        const vaultAddress = subscription['vault'];
        const above = subscription["above-below"] === "0";

        let vaultInfo = this.vaults[vaultAddress];

        if (vaultInfo.tlv === undefined) {

            vaultInfo.tlv = await this._getTVLWorthInUsdBN(
                web3,
                vaultAddress
            );

        }

        const uniqueId = vaultAddress + "-" + above + "-" + threshold;

        if ((above && vaultInfo.tlv.gt(threshold)) || (!above && vaultInfo.tlv.lt(threshold))) {

            return {
                uniqueId: uniqueId,
                notification: `TVL in ${vaultInfo.name} (${amountFormatter.format(vaultInfo.tlv)}) ${above ? 'is above' : 'has dropped below'} ${amountFormatter.format(threshold)} USD`
            };

        } else {

            return [];

        }

    }

    /**
     * returns all relevant vaults for user wallet
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserVaults(args) {

        const relevantVaults = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        for (const vaultInfo of Object.values(this.vaults)) {

            if (vaultInfo.status === 'active') {

                const earnContractAddress = vaultInfo.earnContractAddress

                contractCallContext.push({
                    reference: 'vault-' + vaultInfo.id,
                    contractAddress: earnContractAddress,
                    abi: ABIs.vault,
                    calls: [{reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [args.address]}],
                    context: {
                        vaultInfo: vaultInfo
                    }
                });

            }

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const vaultInfo = result.originalContractCallContext.context.vaultInfo;

                relevantVaults.push({
                    value: vaultInfo.earnContractAddress,
                    label: vaultInfo.name
                });

            }

        }

        return relevantVaults;

    }


    /**
     *
     * @param web3
     * @param poolAddress
     * @returns {Promise<{tvl: *, poolName: string}>}
     * @private
     */
    async _getTVLWorthInUsdBN(web3, vaultAddress) {

        let vaultContract = new web3.eth.Contract(
            ABIs.vault,
            vaultAddress
        );

        const pricePerFullShare = await vaultContract.methods.getPricePerFullShare().call()
        const totalSupply = await vaultContract.methods.totalSupply().call()
        const decimals = await vaultContract.methods.decimals().call()

        return new BN(pricePerFullShare).dividedBy('1e18').multipliedBy(new BN(totalSupply).dividedBy('1e' + decimals))

    }

}

module.exports = Tvl;
