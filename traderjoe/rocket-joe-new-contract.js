const ABIs = require("./abis.json");
const BN = require("bignumber.js");

const FACTORY = "0x37551bc793175DA03012bFD10b285A033b62247E";

class RocketJoeContract {

    static displayName = "Rocket Joe Launch";
    static description = "Get notified when new Rocket Joe launch event has been created";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        const web3 = args.web3;

        this.factoryContract = new web3.eth.Contract(
            ABIs.rocketJoeFactory,
            FACTORY
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
        const events = await this.factoryContract.getPastEvents('RJLaunchEventCreated', {
            fromBlock: fromBlock,
            toBlock: toBlock
        })

        const notifications = [];

        if (events.length > 0) {


            for (const event of events) {

                const launchEvent = event.returnValues.launchEvent;

                const eventTokenSymbol = await this.getEventTokenSymbol(
                    args.web3,
                    launchEvent
                );

                const uniqueId = "num-launch-event-" + launchEvent;

                const phase1Date = new Date(event.returnValues.phaseOneStartTime * 1000).toLocaleString('en-us', {month: 'short'});

                notifications.push({
                    uniqueId: uniqueId,
                    notification: `New Rocket Joe launch for token ${eventTokenSymbol} was listed! Phase 1 starts on ${phase1Date}`
                });

            }

        }

        return notifications;

    }


    async getEventTokenSymbol(web3, launchEventAddress) {

        const launchEventContract = new web3.eth.Contract(
            ABIs.rocketJoeLaunchEvent,
            launchEventAddress
        );

        const tokenAddress = await launchEventContract.methods.token().call();

        const tokenContract = new web3.eth.Contract(
            ABIs.erc20,
            tokenAddress
        );

        return tokenContract.methods.symbol().call()

    }

}


module.exports = RocketJoeContract;
