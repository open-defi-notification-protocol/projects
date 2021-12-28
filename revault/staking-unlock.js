const {RevaStakingPoolInfo} = require("./contracts.js");
const GetAllUserPools = require("./utils.js");

class StakingUnlock {

    static displayName = "Staking unlock";
    static description = "Get notified when your staking position unlocked";


    // runs when class is initialized
    async onInit(args) {
        this.revaStakingPoolContract = new args.web3.eth.Contract(RevaStakingPoolInfo.abi, RevaStakingPoolInfo.address);
    }


    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {
        const pools = await GetAllUserPools(args.web3, this.revaStakingPoolContract, args.address);
        return [
            {
                type: "input-select",
                id: "pool",
                label: "Pool",
                values: pools
            }];
    }


    async onBlocks(args) {
        const poolInfo = await this.revaStakingPoolContract.methods.poolInfo(args.subscription["pool"]).call();
        const userInfo = await this.revaStakingPoolContract.methods.userPoolInfo(args.subscription["pool"], args.address).call();

        const unlockWithinDays = Math.max(0, Math.ceil((parseInt(userInfo.timeDeposited) + parseInt(poolInfo.timeLocked) - (new Date().getTime() / 1000)) / 24 / 60 / 60));

            if (unlockWithinDays > 0) {
            return [
                {
                    notification: `Your X${poolInfo.vRevaMultiplier} staking position will be unlock in ${unlockWithinDays} ${unlockWithinDays === 1 ? 'day' : 'days'}`
                }
            ];
        } else {
            return [
                {
                    notification: `Your X${poolInfo.vRevaMultiplier} staking position is unlocked, go to app.revault.network to restake`
                }
            ];
        }

    }

}

module.exports = StakingUnlock;
