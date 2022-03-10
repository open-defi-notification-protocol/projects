const BN = require("bignumber.js");
const ABIs = require('./abis-fantom.json');
const EthereumMulticall = require('ethereum-multicall');

const REVAULT_ADDRESS = "0x2B207c61B989b4998b29705Ba26d394552EDBCee";
const REVACHEF_ADDRESS = "0x2207cBE84AabcE3092ADe51820495198d5602711";
const REVA_TOKEN_ADDRESS = "0xbdd2739AE69A054895Be33A22b2D2ed71a1DE778";

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class VaultPendingReward {

    static displayName = "Vault Pending Reward";
    static description = "Get notified when enough REVA reward is ready to claim";
    static network = "fantom";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.revachefContract = new args.web3.eth.Contract(
            ABIs.revachef,
            REVACHEF_ADDRESS
        );

        this.revaultContract = new args.web3.eth.Contract(
            ABIs.revault,
            REVAULT_ADDRESS
        );

        const revaContract = new args.web3.eth.Contract(
            ABIs.erc20,
            REVA_TOKEN_ADDRESS
        );

        this.revaDecimals = await revaContract.methods.decimals().call();

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
                id: "vault-deposit-token",
                label: "Vault",
                values: vaults
            },
            {
                type: "input-number",
                id: "minimum",
                label: "Minimum REVA",
                default: 0,
                description: "Minimum amount of claimable REVA to be notified about"
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

        const depositTokenAddress = args.subscription["vault-deposit-token"];
        const minimum = args.subscription["minimum"];

        const pendingReward = await this.revachefContract.methods.pendingReva(depositTokenAddress, args.address).call();

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.revaDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = depositTokenAddress + "-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} REVA on ${await this._getPairLabel(args.web3, depositTokenAddress)} vault ready to claim`
            };

        } else {

            return [];

        }
    }

    /**
     * returns all the minichef pairs that the user has LPs deposited in
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserVaults(args) {

        const pairs = [];

        const web3 = args.web3;

        const multicall = new EthereumMulticall.Multicall({web3Instance: web3, tryAggregate: true});

        const contractCallContext = [];

        const vaultLength = await this.revaultContract.methods.vaultLength().call();

        for (let vaultId = 0; vaultId < vaultLength; vaultId++) {

            contractCallContext.push({
                reference: 'minichef-poolId-' + vaultId,
                contractAddress: REVAULT_ADDRESS,
                abi: ABIs.revault,
                calls: [{
                    reference: 'userVaultPrincipalCall',
                    methodName: 'userVaultPrincipal',
                    methodParameters: [vaultId, args.address]
                }],
                context: {
                    vaultId: vaultId
                }
            });

        }

        const results = (await multicall.call(contractCallContext)).results;

        for (const result of Object.values(results)) {

            const userStakedBalanceBN = new BN(result.callsReturnContext[0].returnValues[0].hex);

            if (userStakedBalanceBN.isGreaterThan("0")) {

                const vaultId = result.originalContractCallContext.context.vaultId;

                const depositTokenAddress = (await this.revaultContract.methods.vaults(vaultId).call())[1];

                pairs.push({
                    value: depositTokenAddress,
                    label: await this._getPairLabel(web3, depositTokenAddress)
                });

            }

        }

        return pairs;

    }

    /**
     * takes a minichef pool id and returns a string label of the two underlying tokens (like ETH-USDC)
     *
     * @param web3
     * @param depositTokenAddress
     * @returns {Promise<string>}
     * @private
     */
    async _getPairLabel(web3, depositTokenAddress) {

        const depositTokenContract = new web3.eth.Contract(ABIs.erc20, depositTokenAddress);

        const label = await depositTokenContract.methods.symbol().call();

        return label === 'WFTM' ? 'FTM' : label;

    }

}

module.exports = VaultPendingReward;
