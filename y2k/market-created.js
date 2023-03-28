const ABIs = require("./abis.json");

const VAULT_FACTORY = "0x984E0EB8fB687aFa53fc8B33E12E04967560E092";

class MarketCreated {

    static displayName = "Market Created";
    static description = "Get notified when a new market has been created";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        const web3 = args.web3;

        this.vaultFactoryContract = new web3.eth.Contract(
            ABIs.vaultFactory,
            VAULT_FACTORY
        );

    }


    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        return [{
            id: 'allow-subscribe',
            label: 'This input makes sure the Subscribe button will be shown',
            type: 'hidden',
            value: true
        }];

    }

    /**
     * runs when endpoint's chain is extended - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        const toBlock = args.toBlock;
        const fromBlock = args.fromBlock;

        // withdrawals
        const events = await this.vaultFactoryContract.getPastEvents('MarketCreated', {
            fromBlock: fromBlock,
            toBlock: toBlock
        })

        const notifications = [];

        if (events.length > 0) {


            for (const event of events) {

                const returnValues = event.returnValues;

                const mIndex = returnValues.mIndex;


                const uniqueId = "mIndex-event-" + mIndex;

                notifications.push({
                    uniqueId: uniqueId,
                    notification: `New Market created [${returnValues.name}]! Go to https://y2k.finance to participate.`
                });

            }

        }

        return notifications;

    }


}

module.exports = MarketCreated;
