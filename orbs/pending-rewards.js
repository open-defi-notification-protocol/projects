// Get notified when pending rewards reach certain value
const BN = require("bignumber.js");
const ABIs = require('./abis.json');

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class PendingReward {

    static displayName = "Pending Reward";
    static description = "Get notified when enough pending rewards have accumulated";
    static displayIcon = "hand";

    async onInit(args) {

        this.stakingRewardsContract = new args.web3.eth.Contract(
            ABIs.stakingRewardContract,
            "0xB5303c22396333D9D27Dc45bDcC8E7Fc502b4B32"
        );

    }

    async onBlocks(args) {

        const position = await this.stakingRewardsContract.methods.getStakingRewardsBalance(args.address).call();

        const delegatorStakingRewardsBalanceBN = new BN(position.delegatorStakingRewardsBalance);

        let pendingRewardBN = delegatorStakingRewardsBalanceBN.dividedBy("1e18");

        if (pendingRewardBN.isGreaterThanOrEqualTo(args.subscription["minimum"])) {

            return {
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


