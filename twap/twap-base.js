const ABIs = require("./abis.json");
const addresses = require("./addresses.json")

module.exports = class TwapAllBase {
	constructor(network, onlyEvent) {
		this.twapAddress = addresses[network];
		this.onlyEvent = onlyEvent;
	}

	/**
	 * runs when class is initialized
	 *
	 * @param args
	 * @returns {Promise<void>}
	 */
	async onInit(args) {
		const web3 = args.web3;
		this.twapContract = new web3.eth.Contract(ABIs.twap, this.twapAddress);
	}

	/**
	 * runs right before user subscribes to new notifications and populates subscription form
	 *
	 * @param args
	 * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
	 */
	async onSubscribeForm(args) {
		return [
			{
				id: "allow-subscribe",
				label: "This input makes sure the Subscribe button will be shown",
				type: "hidden",
				value: true,
			},
		];
	}

	/**
	 * runs when endpoint's chain is extended - notification scanning happens here
	 *
	 * @param args
	 * @returns {Promise<{notification: string}|*[]>}
	 */
	async onBlocks(args) {
		const events = await this.twapContract.getPastEvents(this.onlyEvent, {
			fromBlock: args.fromBlock,
			toBlock: args.toBlock,
			filter: {maker: args.address},
		});

		return events.filter(e => e &&
				(!this.onlyEvent || this.onlyEvent === e.event) &&
				e.returnValues &&
				e.returnValues.id &&
				e.returnValues.maker &&
				e.returnValues.maker.toLowerCase() === args.address.toLowerCase()
		).map((e) => {
			return ({
				uniqueId: `order-${args.address}-${e.returnValues.id}-${e.event}`,
				notification: this._getMessageForEvent(e.event, e.returnValues.id),
			});
		});
	}

	_getMessageForEvent(eventName, orderId) {
		switch (eventName) {
			case "OrderCompleted":
				return `Your dTWAP order #${orderId} was completely filled`;
			case "OrderFilled":
				return `A trade of your dTWAP order #${orderId} was filled`;
			case "OrderBid":
				return `Your dTWAP order #${orderId} received a bid`;
			case "OrderCanceled":
				return `Your dTWAP order #${orderId} was canceled`;
		}
	}
}
