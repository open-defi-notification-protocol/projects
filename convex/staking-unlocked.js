const ABIs = require('./abis.json');
const BN = require("bignumber.js");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class StakingUnlock {

    static displayName = "Staking Unlocked";
    static description = "Get notified when your vlCVX locked staking has finished";

    // runs when class is initialized
    async onInit(args) {

        this.voteEscrowContract = new args.web3.eth.Contract(ABIs.voteEscrow, "0x72a19342e8F1838460eBFCCEf09F6585e32db86E");

        this.vlCVXDecimals = await this.voteEscrowContract.methods.decimals().call();

    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        const balanceBN = new BN(await this.voteEscrowContract.methods.lockedBalanceOf(args.address).call());

        const form = [];

        if (balanceBN.isGreaterThan(0)) {

            form.push({
                id: 'allow-subscribe',
                label: 'This input makes sure the Subscribe button will be shown',
                type: 'hidden',
                value: true
            })

        }

        return form;

    }


    async onBlocks(args) {

        let lockedParameters = await this.voteEscrowContract.methods.lockedBalances(args.address).call();

        const dateUnlocked = lockedParameters.lockData[0].unlockTime;

        if (new Date().getTime() > (parseInt(dateUnlocked) * 1000)) {

            const balanceBN = new BN(await this.voteEscrowContract.methods.lockedBalanceOf(args.address).call());

            return [{
                notification: `Your staking position of ${amountFormatter.format(balanceBN.dividedBy("1e" + this.vlCVXDecimals))} vlCVX is unlocked, go to convexfinance.com to claim it`
            }];


        } else {
            return [];
        }

    }

}

module.exports = StakingUnlock;
