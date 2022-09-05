const ABIs = require('./abis.json');

const TWAP_ADDRESS = "0x8358686cf6dE08c89EE48016b6A40BBf1b1F9d3D";

class TwapOrderCompleted {

    static displayName = "TWAP Order Completed";
    static description = "Get notified your TWAP order is complete";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        const web3 = args.web3;

        this.twapContract = new web3.eth.Contract(
            ABIs.twap,
            TWAP_ADDRESS
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

        const events = await this.twapContract.getPastEvents('OrderCompleted', {
            fromBlock: fromBlock,
            toBlock: toBlock
        })

        const notifications = [];

        if (events.length > 0) {

            for (const event of events) {

                if (event.returnValues.id) {

                    const order = await this.twapContract.methods.order(
                        event.returnValues.id
                    ).call();

                    if (order.ask && order.ask.maker.toLowerCase() === args.address.toLowerCase()) {

                        const uniqueId = "order-completed-" + order.id;

                        notifications.push({
                            uniqueId: uniqueId,
                            notification: `Your TWAP order ${order.id} is complete!`
                        });

                    }

                }

            }

        }

        return notifications;

    }

}


module.exports = TwapOrderCompleted;
