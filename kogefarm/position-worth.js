const BigNumber = require("bignumber.js");
const fetch = require("node-fetch");
const ABIs = require('./abis.json');

class PositionWorth {

    static displayName = "Position Worth";
    static description = "Get notified when the USD worth of your position drops below a certain threshold";

    // runs when class is initialized
    async onInit(args) {
    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        const vaults = await this._getAllUserVaults(
            args
        );

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

    // runs when new blocks are added to the mainnet chain - notification scanning happens here
    async onBlocks(args) {

        const vaultAddress = args.subscription["vault"];
        const threshold = args.subscription["threshold"];

        const sharesValueNow = await this._getSharesUSDValue(args, vaultAddress);

        if (new BigNumber(threshold).minus(new BigNumber(sharesValueNow)).isGreaterThan(0)) {

            const vaultLabel = await this._getVaultLabel(args, vaultAddress, sharesValueNow);

            return {notification: `Your shares holdings in ${vaultLabel} has dropped below ${threshold} USD`};

        }

        return [];

    }

    // returns all kogefarm vaults where the user has some shares
    async _getAllUserVaults(args) {

        const vaults = [];

        const response = await fetch("https://raw.githubusercontent.com/kogecoin/vault-contracts/main/vaultaddresses");

        const json = await response.json();

        for (let vid = 0; vid < json.length; vid++) {

            const vault = json[vid];

            const sharesValue = await this._getSharesUSDValue(
                args,
                vault
            );

            if (new BigNumber(sharesValue).isGreaterThan(0)) {

                vaults.push({
                    value: vault,
                    label: await this._getVaultLabel(args, vault, sharesValue)
                });

            }

        }

        return vaults;

    }

    // returns the total value in USD of the user's shares in a vault
    async _getSharesUSDValue(args, vaultAddress) {

        const vaultContract = new args.web3.eth.Contract(ABIs.vault, vaultAddress);

        const userShares = await vaultContract.methods.balanceOf(args.address).call();

        if (parseInt(userShares) > 0) {

            try {

                const vaultToken = await vaultContract.methods.token().call();
                const lpContract = new args.web3.eth.Contract(ABIs.lp, vaultToken);
                const routerContract = new args.web3.eth.Contract(ABIs.router, "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff");

                const token0 = await lpContract.methods.token0().call();
                const lpSupply = await lpContract.methods.totalSupply().call();

                const token0Contract = new args.web3.eth.Contract(ABIs.token, token0);
                const token0Balance = await token0Contract.methods.balanceOf(vaultToken).call();

                const vaultLpBalance = await vaultContract.methods.balance().call();
                const token0Decimals = await token0Contract.methods.decimals().call();

                // get vault usd value
                const singleTokenWorthInUSD = await routerContract.methods.getAmountsOut((new BigNumber("10").pow(token0Decimals)), [token0, "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"]).call();
                const lpWorthInUSD = ((new BigNumber(singleTokenWorthInUSD[2]).div(new BigNumber("10").pow("6"))).multipliedBy(new BigNumber(token0Balance).div(new BigNumber("10").pow(token0Decimals)))).multipliedBy(2);
                const vaultWorthInUSD = (new BigNumber(lpWorthInUSD).multipliedBy(new BigNumber(vaultLpBalance)).div(new BigNumber(lpSupply)));

                // calculate user shares usd value
                const totalShares = await vaultContract.methods.totalSupply().call();

                return new BigNumber(vaultWorthInUSD).multipliedBy(new BigNumber(userShares)).div(new BigNumber(totalShares));

            } catch (error) {
                return 0;
            }

        } else {

            return 0;

        }

    }

    // takes a kogefarm vault address and returns a string label of the underlying deposit tokens (like ETH-USDC)
    async _getVaultLabel(args, vaultAddress, sharesValue) {

        const vaultContract = new args.web3.eth.Contract(ABIs.vault, vaultAddress);

        const lpToken = await vaultContract.methods.token().call();
        const lpContract = new args.web3.eth.Contract(ABIs.lp, lpToken);

        const token0 = await lpContract.methods.token0().call();
        const token1 = await lpContract.methods.token1().call();

        const token0Contract = new args.web3.eth.Contract(ABIs.erc20, token0);
        const token1Contract = new args.web3.eth.Contract(ABIs.erc20, token1);

        const token0Symbol = await token0Contract.methods.symbol().call();
        const token1Symbol = await token1Contract.methods.symbol().call();

        const formatter = Intl.NumberFormat('en', {notation: 'compact'});

        return `${token0Symbol} - ${token1Symbol} (${formatter.format(sharesValue)} USD)`;

    }
}

module.exports = PositionWorth;
