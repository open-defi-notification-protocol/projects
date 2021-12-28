const BigNumber = require("bignumber.js");
const {RevaStakingPoolInfo, RevaAutoCompoundPoolInfo} = require("./contracts.js");
const GetAllUserPools = require("./utils.js");

class PendingReward {

    static displayName = "Pending Reward";
    static description = "Get notified when your pending REVA rewards surpass a certain threshold";


    // runs when class is initialized
    async onInit(args) {

        this.revaStakingPoolContract = new args.web3.eth.Contract(RevaStakingPoolInfo.abi, RevaStakingPoolInfo.address);

        this.revaAutoCompoundPoolContract = new args.web3.eth.Contract(RevaAutoCompoundPoolInfo.abi, RevaAutoCompoundPoolInfo.address);
    }



    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        const pools = await GetAllUserPools(
            args.web3,
            this.revaStakingPoolContract,
            args.address
        );

        return [
            {
                type: "input-select",
                id: "pool",
                label: "Pool",
                values: pools
            },
            {
                type: "input-number",
                id: "threshold",
                label: "Threshold amount",
                default: "0",
                description: "Notify me when the amount of REVA exceeds this value"
            }
        ];

    }

    async onBlocks(args) {

        const pid = args.subscription["pool"];

        const userIsCompounding = await this.revaStakingPoolContract.methods.userIsCompounding(pid, args.address).call();

        let pendingReward = 0;

        if (userIsCompounding) {

            pendingReward = await this.revaAutoCompoundPoolContract.methods.pendingReva(pid, args.address).call();

        } else {

            pendingReward = await this.revaStakingPoolContract.methods.pendingReva(pid, args.address).call();

        }

        const normalizedPendingRewards = new BigNumber(pendingReward).dividedBy("1e18").toNumber();

        const threshold = args.subscription["threshold"];

        if (normalizedPendingRewards > threshold) {

            const uniqueId = pid + "-" + threshold;

            const formatter = Intl.NumberFormat('en', {notation: 'compact'});

            return {
                uniqueId: uniqueId,
                notification: `Your pending REVA amount ${formatter.format(normalizedPendingRewards)} surpassed the threshold ${threshold}.  Note: ${userIsCompounding===true? 'Entered autoCompounding.':''} Go to app.revault.network to claim it`,
            };

        }

        return [];

    }
}

module.exports = PendingReward;
