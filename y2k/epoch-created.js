const ABIs = require("./abis.json");
const BN = require("bignumber.js");

const VAULT_FACTORY = "0x984E0EB8fB687aFa53fc8B33E12E04967560E092";

const amountFormatter = Intl.NumberFormat('en');
const dateFormatter = Intl.DateTimeFormat('en', {dateStyle: 'medium', timeStyle: 'medium'});

class EpochCreated {

    static displayName = "Epoch Created";
    static description = "Get notified when a new epoch has been created";

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
        const events = await this.vaultFactoryContract.getPastEvents('EpochCreated', {
            fromBlock: fromBlock,
            toBlock: toBlock
        })

        const notifications = [];

        if (events.length > 0) {


            for (const event of events) {

                const returnValues = event.returnValues;

                const mIndex = returnValues.mIndex;

                try {

                    const {decimals, symbol} = await this._fetchTokenDetails(args.web3, returnValues.token);

                    const strikePrice = new BN(returnValues.strikePrice).dividedBy('1e' + decimals);
                    const startEpoch = new Date(returnValues.startEpoch * 1000)

                    const uniqueId = "mIndex-event-" + mIndex;

                    notifications.push({
                        uniqueId: uniqueId,
                        notification: `New Epoch created - ${symbol} (strike price: ${amountFormatter.format(strikePrice)})! Epoch starts at ${dateFormatter.format(startEpoch)}, Go to https://y2k.finance to participate.`
                    });

                } catch (e) {

                    console.log('y2k-epochcreated - ' + returnValues.token + ' is not a token')

                }

            }

        }

        return notifications;

    }

    /**
     *
     * @param web3
     * @param address
     * @returns {Promise<{symbol: *, decimals: *}>}
     * @private
     */
    async _fetchTokenDetails(web3, address) {

        const tokenContract = new web3.eth.Contract(ABIs.erc20, address);

        const decimals = await tokenContract.methods.decimals().call();
        const symbol = await tokenContract.methods.symbol().call();

        return {decimals, symbol}

    }

}

module.exports = EpochCreated;
