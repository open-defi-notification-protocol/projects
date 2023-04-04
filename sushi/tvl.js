// @ts-nocheck
const ABIs = require("./abis.json");
const configs = require("./configs.json");
const BN = require("bignumber.js").default;
const { Multicall } = require("ethereum-multicall");

const amountFormatter = Intl.NumberFormat("en", { notation: "compact" });

module.exports = class TVL {
  constructor(network) {
    this.config = configs[network];
    this.tvls = {};
    this.bases = Object.values(this.config.bases);
  }

  async onInit(args) {
    this.tvls = {};
  }

  async onSubscribeForm(args) {
    return [
      {
        type: "input-address",
        id: "poolAddress",
        label: "Pool Address",
        default: "",
        description: "The pool contract address",
      },
      {
        type: "input-select",
        id: "above-below",
        label: "Above/Below",
        values: [
          { value: "0", label: "Above" },
          { value: "1", label: "Below" },
        ],
      },
      {
        type: "input-number",
        id: "threshold",
        label: "Threshold price",
        default: 0,
        description: "Notify me when the TVL goes above/below this value in $USD",
      },
    ];
  }

  async onBlocks(args) {
    const web3 = args.web3;
    const subscription = args.subscription;

    const threshold = subscription["threshold"];
    const poolAddress = subscription["poolAddress"];
    const above = subscription["above-below"] === "0";

    const poolInfo = await this._getPoolInfoCached(web3, poolAddress);

    if ((above && poolInfo.tvl.gt(threshold)) || (!above && poolInfo.tvl.lt(threshold))) {
      return {
        uniqueId: poolAddress + "-" + above + "-" + threshold,
        notification: `The TVL of ${poolInfo.name} ${amountFormatter.format(poolInfo.tvl)}$ ${above ? "is above" : "has dropped below"} ${amountFormatter.format(threshold)} USD`,
      };
    } else {
      return [];
    }
  }

  async _getPoolInfoCached(web3, poolAddress) {
    if (!this.tvls[poolAddress]) {
      this.tvls[poolAddress] = await this._getPoolInfo(web3, poolAddress);
    }
    return this.tvls[poolAddress];
  }

  async _getPoolInfo(web3, poolAddress) {
    console.log("Getting pool info for " + poolAddress);
    const router = new web3.eth.Contract(ABIs.router, this.config.router);
    const factoryAddress = await router.methods.factory().call();
    const mc = new Multicall({ web3Instance: web3, tryAggregate: true });

    let { results } = await mc.call([
      {
        reference: "pool",
        abi: ABIs.lp,
        contractAddress: poolAddress,
        calls: [
          { reference: "getReserves", methodName: "getReserves", methodParameters: [] },
          { reference: "token0", methodName: "token0", methodParameters: [] },
          { reference: "token1", methodName: "token1", methodParameters: [] },
        ],
      },
    ]);

    const r0 = new BN(results.pool.callsReturnContext.find((c) => c.reference === "getReserves")?.returnValues[0].hex, 16);
    const r1 = new BN(results.pool.callsReturnContext.find((c) => c.reference === "getReserves")?.returnValues[1].hex, 16);
    const token0 = this._token(web3, results.pool.callsReturnContext.find((c) => c.reference === "token0")?.returnValues[0]);
    const token1 = this._token(web3, results.pool.callsReturnContext.find((c) => c.reference === "token1")?.returnValues[0]);

    results = (
      await mc.call([
        {
          reference: "token0",
          abi: ABIs.erc20,
          contractAddress: token0.options.address,
          calls: [
            { reference: "decimals", methodName: "decimals", methodParameters: [] },
            { reference: "symbol", methodName: "symbol", methodParameters: [] },
          ],
        },
        {
          reference: "token1",
          abi: ABIs.erc20,
          contractAddress: token1.options.address,
          calls: [
            { reference: "decimals", methodName: "decimals", methodParameters: [] },
            { reference: "symbol", methodName: "symbol", methodParameters: [] },
          ],
        },
      ])
    ).results;

    const symbol0 = results.token0.callsReturnContext.find((c) => c.reference === "symbol")?.returnValues[0];
    const symbol1 = results.token1.callsReturnContext.find((c) => c.reference === "symbol")?.returnValues[0];
    const decimals0 = new BN(results.token0.callsReturnContext.find((c) => c.reference === "decimals")?.returnValues[0]);
    const decimals1 = new BN(results.token1.callsReturnContext.find((c) => c.reference === "decimals")?.returnValues[0]);
    const reserve0 = r0.div(new BN(10).pow(decimals0));
    const reserve1 = r1.div(new BN(10).pow(decimals1));
    let price0 = new BN(0);
    let price1 = new BN(0);

    if (this.bases.find((b) => b.address.toLowerCase() === token0.options.address.toLowerCase())?.stable) {
      price0 = new BN(1);
      price1 = reserve0.div(reserve1);
    } else if (this.bases.find((b) => b.address.toLowerCase() === token1.options.address.toLowerCase())?.stable) {
      price1 = new BN(1);
      price0 = reserve1.div(reserve0);
    } else {
      const allPairs = await mc.call([
        {
          reference: "factory",
          abi: ABIs.factory,
          contractAddress: factoryAddress,
          calls: this.bases
            .map((b) => ({ reference: `${b.name}/${symbol0}`, methodName: "getPair", methodParameters: [token0.options.address, b.address] }))
            .concat(this.bases.map((b) => ({ reference: `${b.name}/${symbol1}`, methodName: "getPair", methodParameters: [token1.options.address, b.address] }))),
        },
      ]);
      const filteredPairs = Array.from(new Set(allPairs.results.factory.callsReturnContext.map((c) => c.returnValues[0]))).filter(
        (p) => p !== "0x0000000000000000000000000000000000000000" && p.toLowerCase() !== poolAddress.toLowerCase()
      );
      const infos = await Promise.all(filteredPairs.map(async (p) => this._getPoolInfoCached(web3, p)));
      const sorted = infos.sort((a, b) => b.tvl - a.tvl);
      const top0 = sorted.find((i) => i.token0.toLowerCase() === token0.options.address.toLowerCase() || i.token1.toLowerCase() === token0.options.address.toLowerCase());
      const top1 = sorted.find((i) => i.token0.toLowerCase() === token1.options.address.toLowerCase() || i.token1.toLowerCase() === token1.options.address.toLowerCase());
      price0 = token0.options.address === top0?.token0 ? top0?.price0 : top0?.price1;
      price1 = token1.options.address === top1?.token0 ? top1?.price0 : top1?.price1;
      if (!price0) price0 = price1?.times(reserve1)?.div(reserve0);
      if (!price1) price1 = price0?.times(reserve0)?.div(reserve1);
    }

    return {
      tvl: reserve0.times(price0).plus(reserve1.times(price1)),
      name: symbol0 + "/" + symbol1,
      price0,
      price1,
      token0: token0.options.address,
      token1: token1.options.address,
      decimals0,
      decimals1,
      reserve0,
      reserve1,
    };
  }

  _token(web3, address) {
    return new web3.eth.Contract(ABIs.erc20, address);
  }
};
