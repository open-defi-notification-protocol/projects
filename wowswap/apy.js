const fetch = require("node-fetch");

/**
 *
 */
class APY {

    static displayName = "APY";
    static description = "Track your position's APY";

    /**
     * runs when class is initialized
     *
     * @param args
     * @returns {Promise<void>}
     */
    async onInit(args) {

        this.apiEndpoint = 'https://notifications.wowswap.io/notifications';

    }

    /**
     * runs right before user subscribes to new notifications and populates subscription form
     *
     * @param args
     * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {id: string, label: string, type: string, value: string}, {default: number, description: string, id: string, label: string, type: string}]>}
     */
    async onSubscribeForm(args) {

        return [{
            id: 'allow-subscribe',
            label:'This input makes sure the Subscribe button will be shown',
            type: 'hidden',
            value: true
        }];

    }

    /**
     * runs when new blocks are added to the mainnet chain - notification scanning happens here
     *
     *  wowswap api return object:
     *  [
     *    {
     *      "id": "string",
     *       "message": "string",
     *       "createdAt": 0,
     *       "type": "apy",
     *       "symbol": "string",
     *       "value": 0,
     *       "read": true
     *     }
     *  ]
     *
     * @param args
     * @returns {Promise<{notification: string}|*[]>}
     */
    async onBlocks(args) {

        const response = await fetch(this.apiEndpoint + '?address=' + args.address);
        const wowswapApyNotifications = await response.json();

        const notifications = [];

        if (wowswapApyNotifications && wowswapApyNotifications.length > 0) {

            for (const wowswapApyNotification of wowswapApyNotifications) {

                notifications.push({
                    uniqueId: wowswapApyNotification.createdAt,
                    notification: wowswapApyNotification.message
                });

            }

        }

        return notifications;

    }

}

module.exports = APY;
