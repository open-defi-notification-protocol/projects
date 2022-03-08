const {RevaStakingPoolInfo} = require("./contracts.js");
const GetAllUserPools = require("./utils.js");
const {RevaAutoCompoundPoolInfo} = require("./contracts");

class StakingUnlock {

    static displayName = "Staking Unlocked";
    static description = "Get notified when your staking position unlocked";

    // runs when class is initialized
    async onInit(args) {

        this.revaStakingPoolContract = new args.web3.eth.Contract(RevaStakingPoolInfo.abi, RevaStakingPoolInfo.address);

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
                description:"* means this is an Auto-compounding pool and will not unlock as the unlock period keep resetting each reentry.",
                values: pools
            }];
    }


    async onBlocks(args) {

        const pid = args.subscription["pool"];

        const poolInfo = await this.revaStakingPoolContract.methods.poolInfo(pid).call();

        const userIsCompounding = await this.revaStakingPoolContract.methods.userIsCompounding(pid, args.address).call();

        const notifications = [];

        if (!userIsCompounding) {

            const userInfo = await this.revaStakingPoolContract.methods.userPoolInfo(args.subscription["pool"], args.address).call();

            const unlockWithinDays = Math.max(0, Math.ceil((parseInt(userInfo.timeDeposited) + parseInt(poolInfo.timeLocked) - (new Date().getTime() / 1000)) / 24 / 60 / 60));

            if (unlockWithinDays <= 0) {

                notifications.push({
                    notification: `Your X${poolInfo.vRevaMultiplier} staking position is unlocked, go to app.revault.network to restake`
                });

            }

        }

        return notifications;


    }

}

module.exports = StakingUnlock;
