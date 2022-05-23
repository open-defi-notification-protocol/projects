// Get notified when the unlock cooldown timer reaches zero
const BN = require("bignumber.js");
const ABIs = require('./abis.json');

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class UnlockCooldown {

    static displayName = "Unlock Cooldown";
    static description = "Get notified when the unlock cooldown period is over";
    static displayIcon = "hand";

    async onInit(args) {

        this.stakingRewardsContract = new args.web3.eth.Contract(
            ABIs.stakingContract,
            "0x01D59Af68E2dcb44e04C50e05F62E7043F2656C3"
        );

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {id: string, label: string, type: string, value: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        return [{
            type: "input-number",
            id: "daysBefore",
            label: "Days before",
            default: 0,
            description: "Notify me X days before the unlock cooldown period is over"
        }];
    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        const daysBefore = args.subscription["daysBefore"];

        const position = await this.stakingRewardsContract.methods.getUnstakeStatus(args.address).call();

        const cooldownEndTimeBN = new BN(position.cooldownEndTime);

        const cooldownAmountBN = new BN(position.cooldownAmount).dividedBy("1e18");

        const todaySeconds = new Date().getTime() / 1000;

        if (cooldownAmountBN.isGreaterThan("0") && cooldownEndTimeBN.minus(daysBefore * 60 * 60 * 24).isLessThan(todaySeconds.toFixed())) {

            const daysLeft = cooldownEndTimeBN.minus(todaySeconds).dividedBy(60 * 60 * 24).toNumber();

            const message = daysLeft > 0 ? `Your ${amountFormatter.format(cooldownAmountBN)} unstaked tokens will be available for withdrawal in ${amountFormatter.format(daysLeft)} days` : `Your ${amountFormatter.format(cooldownAmountBN)} unstaked tokens are available for withdrawal`;

            return {
                uniqueId: "orbs-cooldown",
                notification: message
            };

        } else {

            return [];

        }
    }

}

module.exports = UnlockCooldown;
