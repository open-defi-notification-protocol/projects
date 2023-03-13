// Get notified when staking rewards tokens have been claimed on Polygon
const BN = require("bignumber.js");
const ABIs = require('./abis.json');
const fetch = require("node-fetch");

const amountFormatter = Intl.NumberFormat('en', {notation: 'compact'});
const StakingRewardsClaimedTopic = "0x5f51e0cd4567b63928e199868f571929625ded3459b724759a0eb8edbf94158b"
let compounders = [];

class AutoCompound {

    static displayName = "Polygon auto compound restake";
    static description = "Get notified when your staking rewards tokens have been auto compounded on Polygon";
    static displayIcon = "hand";
    static network = "polygon";

    async onInit(args) {

        this.stakingRewardsContract = new args.web3.eth.Contract(
            ABIs.stakingRewardContract,
            "0x295d1982b1b20Cc0c02A0Da7285826c69EF71Fac"
        );

        const response = await fetch('http://54.95.108.148/services/management-service/status');
        const json = await response.json();
        compounders = Object.keys(json.Payload.Guardians).map(function(key) {
            return `0x${json.Payload.Guardians[key].OrbsAddress}`;
        });

    }

    async onBlocks(args) {

        const events = await this.stakingRewardsContract.getPastEvents('StakingRewardsClaimed', {
            topics: [StakingRewardsClaimedTopic, '0x000000000000000000000000' + args.address.substring(2).toLowerCase()],
            fromBlock: args.fromBlock,
            toBlock: args.toBlock
        });

        const notifications = [];

        if (events.length > 0) {

            for (const event of events) {
                const tx = await args.web3.eth.getTransaction(event.transactionHash);

                if (compounders.includes(tx.from.toLowerCase())) {

                    const claimedRewards = new BN(event.returnValues.claimedDelegatorRewards).dividedBy("1e18");
                    const uniqueId = 'polygon-auto-compound';

                    notifications.push({
                        uniqueId: uniqueId,
                        notification: `Polygon staking rewards auto compounded - ${amountFormatter.format(claimedRewards)} tokens`
                    });

                }

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

module.exports = AutoCompound;
