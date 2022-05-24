// Get notified when staking rewards tokens have been claimed on Polygon
const BN = require("bignumber.js");
const ABIs = require('./abis.json');

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class PendingReward {
    static displayName = "Polygon staking rewards claim";
    static description = "Get notified when your staking rewards tokens have been claimed on Polygon";
    static displayIcon = "hand";
    static network = "polygon";

    async onInit(args) {
        this.stakingRewardsContract = new args.web3.eth.Contract(
            ABIs.stakingRewardContract,
            "0x295d1982b1b20Cc0c02A0Da7285826c69EF71Fac"
        );
    }

    async onBlocks(args) {
        const events = await this.stakingRewardsContract.getPastEvents('StakingRewardsClaimed', {
            fromBlock: args.fromBlock,
            toBlock: args.toBlock
        })
        const notifications = [];
        if (events.length > 0) {
            for (const event of events) {
                const claimedRewards = new BN(event.returnValues.claimedDelegatorRewards).dividedBy("1e18");
                const uniqueId = `rewards-claim-${event.returnValues.addr}-${Date.now()}`;
                notifications.push({
                    uniqueId: uniqueId,
                    notification: `Polygon staking rewards claimed - ${amountFormatter.format(claimedRewards)} tokens`
                });
            }
        }
        return notifications;
    }

    async onSubscribeForm(args) {
        return [{
            id: 'allow-subscribe',
            label: 'This input makes sure the Subscribe button will be shown',
            type: 'hidden',
            value: true
        }];
    }
}

module.exports = PendingReward;


