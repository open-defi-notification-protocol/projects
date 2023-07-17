const ABIs = require("./abis.json");
const addresses = require("./addresses.json")
const fetch = require("node-fetch");

class StrategyBase {

    /**
     *
     * @param network
     */
    constructor(network) {
        this.network = network;
        this.portMgrContractAddress = addresses["PortfolioManager"][network];
    }

    async _getStrategies() {
        const result = await (await fetch(`https://api.overnight.fi/${this.network}/usd+/dict/strategies`)).json();
        return result.map(
            x => {return {value: x.address, label: x.fullName}}
        )
    }

    /**
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {
        this.portMgrContract = new args.web3.eth.Contract(ABIs.portMgr, this.portMgrContractAddress);
        this.strategies = await this._getStrategies()
    }

    async onSubscribeForm() {
        return [
            {
                type: "input-select",
                id: "strategy",
                label: "Strategy",
                description: "Select a strategy you wish to get alerts for",
                values: this.strategies
            }
        ];
    }

    async onBlocks(args) {
        const notifications = [];

        const selectedStrategyAddress = args.subscription["strategy"];

        const events = await this.portMgrContract.getPastEvents("StrategyWeightUpdated", {
            fromBlock: args.fromBlock,
            toBlock: args.toBlock,
        });

        if (events.length > 0) {
            for (const event of events) {
                if (event.returnValues.strategy === selectedStrategyAddress) {
                    const selectedStrategyName = this.strategies.find(s => s.value === selectedStrategyAddress).label
                    notifications.push({
                        uniqueId: `${event.transactionHash}${event.returnValues.strategy}`,
                        notification: `Strategy '${selectedStrategyName}' has been updated (${this.network.charAt(0).toUpperCase() + this.network.slice(1)})`
                    })
                }
            }
        }
        return notifications;
    }
}

module.exports = StrategyBase;