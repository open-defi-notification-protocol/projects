const ABIs = require("./abis.json");
const addresses = require("./addresses.json")

class PayoutBase {

    /**
     *
     * @param network
     */
    constructor(network) {
        this.network = network;
        this.exchangeContractAddress = addresses["Exchange"][network];
    }

    /**
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {
        this.exchangeContract = new args.web3.eth.Contract(ABIs.exchange, this.exchangeContractAddress);
    }

    async onSubscribeForm() {
        return [{
            id: 'allow-subscribe',
            label: 'This input makes sure the Subscribe button will be shown',
            type: 'hidden',
            value: true
        }];
    }

    async onBlocks(args) {
        const events = await this.exchangeContract.getPastEvents("PayoutEvent", {
            fromBlock: args.fromBlock,
            toBlock: args.toBlock,
        });

        if (events.length) {
            return {
                uniqueId: events[0].transactionHash,
                notification: `New payout event on ${this.network.charAt(0).toUpperCase() + this.network.slice(1)}`
            }
        }
    }
}

module.exports = PayoutBase;