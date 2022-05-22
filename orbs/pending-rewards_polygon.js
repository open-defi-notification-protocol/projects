// Get notified when pending rewards reach certain value
const BN = require("bignumber.js");
const ABIs = require('./abis.json');

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class PendingReward {

    static displayName = "Pending Reward";
    static description = "Get notified when enough pending rewards have accumulated";
    static displayIcon = "hand";
    static network = "polygon";

    async onInit(args) {

        this.stakingRewardsContract = new args.web3.eth.Contract(
            ABIs.stakingRewardContract,
            "0x295d1982b1b20Cc0c02A0Da7285826c69EF71Fac"
        );

    }

    async onBlocks(args) {

        const minimum = args.subscription["minimum"];

        const position = await this.stakingRewardsContract.methods.getStakingRewardsBalance(args.address).call();

        const delegatorStakingRewardsBalanceBN = new BN(position.delegatorStakingRewardsBalance);

        let pendingRewardBN = delegatorStakingRewardsBalanceBN.dividedBy("1e18");

        if (pendingRewardBN.isGreaterThanOrEqualTo(minimum)) {

            return {
                uniqueId: "orbs-rewards-polygon" + minimum,
                notification: `You have ${amountFormatter.format(pendingRewardBN)} ORBS ready to claim`
            };

        } else {

            return [];

        }
    }

    async onSubscribeForm(args) {
        return [
            {
                type: "input-number",
                id: "minimum",
                label: "Minimum ORBS",
                default: 0,
                description: "Minimum amount of claimable ORBS to be notified about"
            }
        ];
    }


}

module.exports = PendingReward;


