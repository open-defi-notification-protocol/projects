const fetch = require('node-fetch');
const Contracts = require('./contracts');
const BN = require("bignumber.js");
const EthereumMulticall = require('ethereum-multicall');

const REVAULT_CONTRACT_ADDRESS = "0x2642fa04bd1f7250be6539c5bDa36335333d9Ccd";

const Vaults = Object.assign({}, Contracts.Vaults);

for (const key in Vaults) {
    Vaults[key]['vaultKey'] = key;
}

class ChangeStrategy {

    static displayName = "Change Strategy";
    static description = "Get notified when there is a better strategy";

    beefyApyUrl = "https://api.beefy.finance/apy/breakdown";
    autoApyUrl = "https://static.autofarm.network/bsc/farm_data.json";
    bunnyApyUrl = "https://us-central1-pancakebunny-finance.cloudfunctions.net/api-bunnyData";
    acryptosApyUrl = "https://api.unrekt.net/api/v1/acryptos-asset";

    // runs when class is initialized
    async onInit(args) {

        const abi = Contracts.RevaultABI;

        // reset the cached apy data
        this.vaults = Object.assign({}, Vaults);

        this.contract = new args.web3.eth.Contract(abi, REVAULT_CONTRACT_ADDRESS);

    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {
        const strategies = await this._getAllUserStrategies(args);
        return [
            {type: "input-select", id: "strategy", label: "Strategy", values: strategies},
        ];
    }

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const selectedVaultKey = args.subscription["strategy"];

        const userVault = this.vaults[selectedVaultKey];

        const relevantVaults = Object.values(this.vaults).filter(v => v.depositTokenSymbol === userVault.depositTokenSymbol);

        for (const relevantVault of relevantVaults) {

            if (!relevantVault.apy) {

                relevantVault.apy = await this.getApy(relevantVault);

            }

        }

        let nonSelectedRelevantVaults = Object.values(relevantVaults).filter(vault => vault.vaultKey !== selectedVaultKey);

        nonSelectedRelevantVaults = nonSelectedRelevantVaults.sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))

        let highestApiVault = nonSelectedRelevantVaults[0];

        if (parseFloat(userVault.apy) < parseFloat(highestApiVault.apy)) {

            return [
                {
                    notification: `Your ${this.capitalWords(userVault.depositTokenSymbol, "-")} position is currently making ${userVault.apy}% APY, go to app.revault.network, re-balance your position to ${this.capitalWords(highestApiVault.vaultProvider)} and make ${highestApiVault.apy}%`,
                    uniqueId: selectedVaultKey
                }
            ];

        } else {

            return [];

        }

    }

    capitalWords(sentence, delimiter = " ") {
        const arr = sentence.split(delimiter).map(a => a.charAt(0).toUpperCase() + a.slice(1));
        return arr.join(delimiter);
    }

    async _getAllUserStrategies(args) {

        const strategies = [];

        const contractCallContext = [];
        const multicall = new EthereumMulticall.Multicall({web3Instance: args.web3, tryAggregate: true});

        for (const key in this.vaults) {

            const vault = this.vaults[key];

            contractCallContext.push({
                reference: 'revault-vaultId-' + vault.vaultId,
                contractAddress: REVAULT_CONTRACT_ADDRESS,
                abi: Contracts.RevaultABI,
                calls: [{
                    reference: 'userVaultPrincipalCall',
                    methodName: 'userVaultPrincipal',
                    methodParameters: [vault.vaultId, args.address]
                }],
                context: {
                    vaultKey: key
                }
            });

        }


        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const vaultKey = result.originalContractCallContext.context.vaultKey;
            const principalBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (principalBN.isGreaterThan(0)) {

                strategies.push({
                    value: vaultKey,
                    label: this.capitalWords(this.vaults[vaultKey].depositTokenSymbol, "-")
                });

            }

        }

        return strategies;
    }

    async getApy(vault) {

        if (vault.vaultProvider === "autofarm") {

            const apy = await this.getAutofarmApy(vault);
            return (100 * parseFloat(apy)).toFixed(2);

        } else if (vault.vaultProvider === "beefy") {

            const apy = await this.getBeefyApy(vault);
            return (100 * parseFloat(apy)).toFixed(2);

        } else if (vault.vaultProvider === "bunny") {

            const apy = await this.getBunnyApy(vault);
            return parseFloat(apy).toFixed(2);

        } else if (vault.vaultProvider === "acryptos") {

            const apy = await this.getAcryptosApy(vault);
            return apy.toFixed(2);

        }

    }

    async getAutofarmApy(vault) {

        const res = await fetch(this.autoApyUrl, {mode: "cors"});
        const result = await res.json();
        const apyBreakdown = result.pools[vault.additionalData.pid];

        return apyBreakdown["APY_total"];

    }

    async getBeefyApy(vault) {

        const res = await fetch(this.beefyApyUrl, {mode: "cors", headers: {origin: "https://app.revault.network"}});
        const result = await res.json();

        if (vault.depositTokenSymbol === "bnb" || vault.depositTokenSymbol === "busd") {

            const apyBreakdown = result[`venus-${vault.depositTokenSymbol}`];
            return apyBreakdown.totalApy;

        } else if (vault.depositTokenSymbol === "cake") {

            const apyBreakdown = result["cake-cakev2"];
            return apyBreakdown.totalApy;

        } else {

            const apyBreakdown = result[`cakev2-${vault.depositTokenSymbol}`];
            return apyBreakdown.totalApy;

        }
    }

    async getBunnyApy(vault) {

        const res = await fetch(this.bunnyApyUrl, {mode: "cors"});
        const result = await res.json();

        return result.apy[vault.address].apy;

    }

    async getAcryptosApy(vault) {

        const res = await fetch(this.acryptosApyUrl, {mode: "cors"});
        const result = await res.json();
        const info = result.assets[(vault.depositTokenSymbol).toUpperCase()];

        return parseFloat(info.apyvault) + parseFloat(info.aprfarm);

    }

}

module.exports = ChangeStrategy;
