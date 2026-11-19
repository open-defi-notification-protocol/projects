const BN = require("bignumber.js");
const ABIs = require("./abis.json");
const EthereumMulticall = require("ethereum-multicall");

const amountFormatter = Intl.NumberFormat("en");
const priceFormatter = Intl.NumberFormat("en");

const ORDER_MANAGER_CONTRACT_ADDRESS = "0xf584A17dF21Afd9de84F47842ECEAF6042b1Bb5b";
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
class LimitOrderExecuted {
  static displayName = "Limit Order Executed";
  static description = "Get notified when the your limit order has been executed";

  /**
   * runs when class is initialized
   *
   * @param args
   * @returns {Promise<void>}
   */
  async onInit(args) {
    this.orderManagerContract = new args.web3.eth.Contract(ABIs.orderManager, ORDER_MANAGER_CONTRACT_ADDRESS);
  }

  /**
   * runs right before user subscribes to new notifications and populates subscription form
   *
   * @param args
   * @returns {Promise<[{values: *[], id: string, label: string, type: string},{default: number, description: string, id: string, label: string, type: string}]>}
   */
  async onSubscribeForm(args) {
    const positions = await this._getAllUserOrders(args);

    return [
      {
        type: "input-select",
        id: "order",
        label: "Order",
        values: positions,
      },
    ];
  }

  /**
   * runs when new blocks are added to the mainnet chain - notification scanning happens here
   *
   * @param args
   * @returns {Promise<{notification: string}|*[]>}
   */
  async onBlocks(args) {
    const orderKey = args.subscription["order"];
    const events = await this.orderManagerContract.getPastEvents("OrderExecuted", {
      fromBlock: args.fromBlock,
      toBlock: args.toBlock,
      filter: { key: orderKey },
    });
    if (events.length && events[0].returnValues) {
      const { order, request } = events[0].returnValues;

      const positionLabel = await this._getOrderLabel(args, order.indexToken, order.collateralToken, order.payToken, order.triggerAboveThreshold, order.price);

      return {
        notification: `${positionLabel} has been executed! Order Size: ${amountFormatter.format(new BN(request.sizeChange).dividedBy("1e30"))}$`,
      };
    } else {
      return [];
    }
  }

  /**
   *
   * @param args
   * @returns {Promise<*[]>}
   * @private
   */
  async _getAllUserOrders(args) {
    const orders = await this.orderManagerContract.methods.getOrders(args.address, 0, 10_000).call();
    const orderIds = orders.orderIds;
    const multicall = new EthereumMulticall.Multicall({ web3Instance: args.web3, tryAggregate: true });

    const contractCallContext = [];

    for (const orderId of orderIds) {
      contractCallContext.push({
        reference: `orderId-${orderId}`,
        contractAddress: ORDER_MANAGER_CONTRACT_ADDRESS,
        abi: ABIs.orderManager,
        calls: [{ methodName: "orders", methodParameters: [orderId] }],
        context: {
          orderId,
        },
      });
    }

    const results = (await multicall.call(contractCallContext)).results;
    const openOrders = [];
    for (const result of Object.values(results)) {
      const returnValues = result.callsReturnContext[0].returnValues;
      if (EMPTY_ADDRESS !== result.callsReturnContext[0].returnValues[0]) {
        const orderId = result.originalContractCallContext.context.orderId;

        const indexToken = returnValues[2];
        const collateralToken = returnValues[3];
        const payToken = returnValues[4];
        const triggerAboveThreshold = returnValues[8];
        const price = returnValues[7].hex;

        const label = await this._getOrderLabel(args, indexToken, collateralToken, payToken, triggerAboveThreshold, price);
        openOrders.push({
          value: orderId,
          label,
        });
      }
    }

    return openOrders;
  }

  /**
   *
   */
  async _getOrderLabel(args, indexToken, collateralToken, payToken, triggerAboveThreshold, limitPrice) {
    const indexTokenContract = new args.web3.eth.Contract(ABIs.erc20, indexToken);
    const collateralTokenContract = new args.web3.eth.Contract(ABIs.erc20, collateralToken);
    const payTokenContract = new args.web3.eth.Contract(ABIs.erc20, payToken);

    const indexTokenLabel = await indexTokenContract.methods.symbol().call();
    const collateralTokenLabel = await collateralTokenContract.methods.symbol().call();
    const payTokenLabel = await payTokenContract.methods.symbol().call();
    const indexTokenDecimals = await indexTokenContract.methods.decimals().call();

    const priceText = amountFormatter.format(new BN(limitPrice).dividedBy("1e" + (30 - indexTokenDecimals)).toFixed());

    return `${!triggerAboveThreshold ? "Short" : "Long"} order (${indexTokenLabel}/${collateralTokenLabel}), pay token ${payTokenLabel}, price: ${priceText}$`;
  }
}

module.exports = LimitOrderExecuted;
