const ABIs = require("./abis.json");
const addresses = require("./addresses.json")

class NewMarketBase {

    /**
     *
     * @param network
     */
    constructor(network) {
        this.network = network;
        this.factoryContractAddress = addresses[network];
    }

    /**
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {
        this.factoryContract = new args.web3.eth.Contract(ABIs.factoryContract, this.factoryContractAddress);
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
        const notifications = [];

        const events = await this.factoryContract.getPastEvents("CreateNewMarket", {
            fromBlock: args.fromBlock,
            toBlock: args.toBlock,
        });

        for (const e of events) {
            const poolAddress = e.returnValues.market;
            const poolContract = new args.web3.eth.Contract(ABIs.poolContract, poolAddress);
            const poolTokens = await poolContract.methods.readTokens().call();
            const ptTokenContract = new args.web3.eth.Contract(ABIs.tokenContract, poolTokens._PT);
            const syTokenContract = new args.web3.eth.Contract(ABIs.tokenContract, poolTokens._SY);
            const ptTokenName = await ptTokenContract.methods.symbol().call();
            const syTokenName = await syTokenContract.methods.symbol().call();
            notifications.push({
                uniqueId: poolAddress,
                notification: `New Pendle market created on ${this.network.charAt(0).toUpperCase() + this.network.slice(1)}! "${ptTokenName}/${syTokenName}". Go to https://app.pendle.finance to participate.`
            });
        }
        return notifications;
    }
}

module.exports = NewMarketBase;