// Get notified when the unlock cooldown timer reaches zero
const BN = require("bignumber.js");
const ABIs = require('./abis.json');

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class UnlockCooldown {

    static displayName = "Unlock Cooldown";
    static description = "Get notified when the unlock cooldown timer reaches zero";
    static displayIcon = "hand";
    static network = "polygon";

    async onInit(args) {

        this.stakingRewardsContract = new args.web3.eth.Contract(
            ABIs.stakingContract,
            "0xEeAE6791F684117B7028b48Cb5dD21186dF80B9c"
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
            id: 'allow-subscribe',
            label: 'This input makes sure the Subscribe button will be shown',
            type: 'hidden',
            value: true
        }];
    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        const position = await this.stakingRewardsContract.methods.getUnstakeStatus(args.address).call();

        const cooldownEndTimeBN = new BN(position.cooldownEndTime);

        const cooldownAmountBN = new BN(position.cooldownAmount).dividedBy("1e18");

        const todaySeconds = new Date().getTime() / 1000;

        if (cooldownAmountBN.isGreaterThan("0") && cooldownEndTimeBN.isLessThan(todaySeconds.toFixed())) {

            return {
                uniqueId: "orbs-cooldown-polygon",
                notification: `Your ${amountFormatter.format(cooldownAmountBN)} unstaked tokens are available for withdrawal`
            };

        } else {

            return [];

        }
    }

}

module.exports = UnlockCooldown;
