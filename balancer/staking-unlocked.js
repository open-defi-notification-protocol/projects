const ABIs = require('./abis.json');
const BN = require("bignumber.js");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});

class StakingUnlock {

    static displayName = "Staking Unlocked";
    static description = "Get notified when your veBAL locked staking has finished";

    // runs when class is initialized
    async onInit(args) {

        this.voteEscrowContract = new args.web3.eth.Contract(ABIs.voteEscrow, "0xC128a9954e6c874eA3d62ce62B468bA073093F25");

        this.veBALDecimals = await this.voteEscrowContract.methods.decimals().call();

    }

    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        const balanceBN = new BN(await this.voteEscrowContract.methods.balanceOf(args.address).call());

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

        const dateUnlocked = await this.voteEscrowContract.methods.locked__end(args.address).call()

        if (new Date().getTime() > (parseInt(dateUnlocked) * 1000)) {

            const balanceBN = new BN(await this.voteEscrowContract.methods.balanceOf(args.address).call());

            return [{
                notification: `Your staking position of ${amountFormatter.format(balanceBN.dividedBy("1e" + this.veBALDecimals))} veBAL is unlocked, go to app.balancer.fi to claim it`
            }];


        } else {
            return [];
        }

    }

}

module.exports = StakingUnlock;
