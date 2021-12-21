const BN = require("bignumber.js");
const fetch = require("node-fetch");
const ABIs = require('./abis.json');
const EthereumMulticall = require('ethereum-multicall');

const CALCULATOR_ADDRESS = "0xba2dda52741b2ea5b57a118f43cf6ff02d932531";

/**
 * Get notified when the USD worth of your position drops below a certain threshold *
 */
class PositionWorth {

    static displayName = "Position Worth";
    static description = "Get notified when the USD worth of your position drops below a certain threshold";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        const response = await fetch('https://api.dot.finance/farms');

        this.vaultsInfo = await response.json();

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const vaults = await this._getAllUserVaults(args);

        return [
            {
                type: "input-select",
                id: "vault",
                label: "Vault",
                values: vaults
            },
            {
                type: "input-number",
                id: "threshold",
                label: "Threshold price",
                default: 0,
                description: "Notify me when the price of my position goes below this value in USD"
            }
        ];
    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<*[]|{notification: string, uniqueId: string}>}
     */
    async onBlocks(args) {

        const vaultAddress = args.subscription["vault"];
        const threshold = args.subscription["threshold"];

        const uniqueId = vaultAddress + "-" + threshold;

        const sharesValueNow = await this._getSharesUSDValueBN(args, vaultAddress);

        if (new BN(threshold).minus(new BN(sharesValueNow)).isGreaterThan(0)) {

            const vaultLabel = await this._getVaultLabel(args, vaultAddress, sharesValueNow);

            return {
                uniqueId: uniqueId,
                notification: `Your shares holdings in ${vaultLabel} has dropped below ${threshold} USD`
            };

        }

        return [];

    }

    /**
     * returns all kogefarm vaults where the user has some shares
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserVaults(args) {

        const vaults = [];

        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        const contractCallContext = [];

        for (const vaultInfo of this.vaultsInfo) {

            const vaultAddress = vaultInfo.proxyAddress;

            if (!vaultAddress) continue;

            contractCallContext.push({
                reference: 'vault-' + vaultAddress,
                contractAddress: vaultAddress,
                abi: ABIs.vault,
                calls: [{reference: 'balanceOfCall', methodName: 'balanceOf', methodParameters: [args.address]}],
                context: {
                    vaultAddress: vaultAddress
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const sharesValueBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (sharesValueBN.isGreaterThan(0)) {

                const vaultAddress = result.originalContractCallContext.context.vaultAddress;

                const sharesValueUsdBN = await this._getSharesUSDValueBN(
                    args,
                    vaultAddress,
                    sharesValueBN
                );

                try {

                    vaults.push({
                        value: vaultAddress,
                        label: await this._getVaultLabel(
                            args,
                            vaultAddress,
                            sharesValueUsdBN
                        )
                    });

                } catch (ignore) {

                    // unsupported farm

                }

            }

        }

        return vaults;

    }

    /**
     * returns the total value in USD of the user's shares in a vault
     *
     * @param args
     * @param vaultAddress
     * @param userSharesBN
     * @returns {Promise<BigNumber|*>}
     * @private
     */
    async _getSharesUSDValueBN(args, vaultAddress, userSharesBN = null) {

        const vaultContract = new args.web3.eth.Contract(ABIs.vault, vaultAddress);

        if (userSharesBN === null) {

            userSharesBN = new BN(await vaultContract.methods.balanceOf(args.address).call());

        }

        if (userSharesBN.isGreaterThan("0")) {

            const calculatorContract = new args.web3.eth.Contract(ABIs.calculator, CALCULATOR_ADDRESS);

            const lpBalance = await vaultContract.methods.balanceOf(args.address).call();

            const stakingToken = await vaultContract.methods.stakingToken().call();

            const sharesUSDValue = await calculatorContract.methods.valueOfAsset(stakingToken, lpBalance).call();

            return new BN(sharesUSDValue.valueInUSD).dividedBy("1e18");

        } else {


            return new BN("0");

        }

    }

    /**
     * takes a kogefarm vault address and returns a string label of the underlying deposit tokens (like ETH-USDC)
     *
     * @param args
     * @param vaultAddress
     * @param sharesValueUsdBN
     * @returns {Promise<string>}
     * @private
     */
    async _getVaultLabel(args, vaultAddress, sharesValueUsdBN) {

        const vaultContract = new args.web3.eth.Contract(ABIs.vault, vaultAddress);

        const lpToken = await vaultContract.methods.stakingToken().call();
        const lpContract = new args.web3.eth.Contract(ABIs.lp, lpToken);

        const token0 = await lpContract.methods.token0().call();
        const token1 = await lpContract.methods.token1().call();

        const token0Contract = new args.web3.eth.Contract(ABIs.erc20, token0);
        const token1Contract = new args.web3.eth.Contract(ABIs.erc20, token1);

        const token0Symbol = await token0Contract.methods.symbol().call();
        const token1Symbol = await token1Contract.methods.symbol().call();

        const formatter = Intl.NumberFormat('en', {notation: 'compact'});

        return `${token0Symbol} - ${token1Symbol} (${formatter.format(sharesValueUsdBN)} USD)`;

    }
}

module.exports = PositionWorth;
