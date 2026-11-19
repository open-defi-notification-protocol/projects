const BN = require("bignumber.js");
const ABIs = require('./abis.json');

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

const YIELD_DISTRIBUTOR = '0xc6764e58b36e26b08Fd1d2AeD4538c02171fA872'

class PendingReward {

    static displayName = "Pending Reward";
    static description = "Get notified when enough reward in FXS in veFXS pool is ready to claim";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.rewardPoolContract = new args.web3.eth.Contract(
            ABIs.yieldDistributor,
            YIELD_DISTRIBUTOR
        );

        this.fxsDecimals = 18;

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        return [{
            type: "input-number",
            id: "minimum",
            label: "Minimum FXS",
            default: 0,
            description: "Minimum amount of claimable FXS to be notified about"
        }];

    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        const minimum = args.subscription["minimum"];

        const pendingReward = await this.rewardPoolContract.methods.earned(args.address).call();

        const pendingRewardBN = new BN(pendingReward).dividedBy('1e' + this.fxsDecimals);

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            const uniqueId = "fxs-rewards-" + minimum;

            return {
                uniqueId: uniqueId,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} FXS ready to claim`
            };

        } else {

            return [];

        }
    }

}

module.exports = PendingReward;
