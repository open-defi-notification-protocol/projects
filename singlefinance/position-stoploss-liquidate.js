const ABIs = require("./abis.json");
const BN = require("bignumber.js");
const fetch = require("node-fetch");

const BANK = "0x70f699f902628Af04dc5323C37CfA69e22140741";

class PositionStoplossLiquidate {

    static displayName = "Position Stoploss/Liquidate";
    static description = "Get notified when Position triggered stoploss/liquidation";
    static network = "cronos";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {
        const web3 = args.web3;

        this.bankContract = new web3.eth.Contract(
            ABIs.bank,
            BANK
        );
    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        const positions = await this._getAllUserPositions(args);

        return [
            {
                type: "input-select",
                id: "position",
                label: "Position",
                values: positions
            }
        ];
    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {
        let sN = await this.generateNotificationForEvents(args, 'StopLoss');
        let lN = await this.generateNotificationForEvents(args, 'Liquidate')
        return sN.concat(lN);
    }

    async generateNotificationForEvents(args, eventName)
    {
        const toBlock = args.toBlock;
        const fromBlock = args.fromBlock;

        const positionId = args.subscription["position"];

        const events = await this.bankContract.getPastEvents(eventName, {
            fromBlock: fromBlock,
            toBlock: toBlock
        })

        const notifications = [];

        if (events.length > 0) {


            for (const event of events) {

                const eventPositionId = event.returnValues.positionId;
                if(eventPositionId==positionId)
                {
                    notifications.push({
                        notification: `Position #${positionId} is ${eventName} !!`
                    });
                }
            }

        }
        return notifications;
    }

    /**
     *
     * @param args
     * @returns {Promise<*[]>}
     * @private
     */
    async _getAllUserPositions(args) {

        const positions = [];

        const response = await fetch(`https://defi-notify.singlefinance.io/api/positions?chainid=25&owner=${args.address}`);

        const json = await response.json();

        for (let pid = 0; pid < json.data.length; pid++) {
            const position = json.data[pid];
            if(position.closedAt==null)
            {
                const positionId = position.id;
                positions.push({
                    value: positionId,
                    label: `Positions #${positionId}`
                });
            }
        }

        return positions;
    }
}


module.exports = PositionStoplossLiquidate;
