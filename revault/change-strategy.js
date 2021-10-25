const fetch = (...args) => import('node-fetch').then(module => module.default(...args))

class ChangeStrategy {

  static displayName = "Change Strategy";
  static description = "Get notified when there is a better strategy";

  beefyApyUrl = "https://api.beefy.finance/apy/breakdown";
  autoApyUrl = "https://static.autofarm.network/bsc/farm_data.json";
  bunnyApyUrl = "https://us-central1-pancakebunny-finance.cloudfunctions.net/api-bunnyData";
  acryptosApyUrl = "https://api.unrekt.net/api/v1/acryptos-asset";

  vaults = [
    {
      "address": "0x52cFa188A1468A521A98eaa798E715Fbb9eb38a3",
      "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
      "depositTokenSymbol": "bnb",
      "nativeTokenSymbol": "bunny",
      "vaultProvider": "bunny",
      "additionalData": {
        "vid": "0"
      }
    },
    {
      "address": "0x0243A20B20ECa78ddEDF6b8ddb43a0286438A67A",
      "depositTokenAddress": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
      "depositTokenSymbol": "busd",
      "nativeTokenSymbol": "bunny",
      "vaultProvider": "bunny",
      "additionalData": {
        "vid": "1"
      }
    },
    {
      "address": "0xEDfcB78e73f7bA6aD2D829bf5D462a0924da28eD",
      "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
      "depositTokenSymbol": "cake",
      "nativeTokenSymbol": "bunny",
      "vaultProvider": "bunny",
      "additionalData": {
        "vid": "2"
      }
    },
    {
      "address": "0xA599d6b81eC4a5DDd8eCa85e3AAc31E006aF00AA",
      "depositTokenAddress": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
      "depositTokenSymbol": "cake-bnb",
      "nativeTokenSymbol": "bunny",
      "vaultProvider": "bunny",
      "additionalData": {
        "vid": "3"
      }
    },
    {
      "address": "0xE0aca387C6600b455CCFC32B253e2DB13b71ca62",
      "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
      "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
      "depositTokenSymbol": "busd-bnb",
      "nativeTokenSymbol": "bunny",
      "vaultProvider": "bunny",
      "additionalData": {
        "vid": "4"
      }
    },
    {
      "address": "0x6BE4741AB0aD233e4315a10bc783a7B923386b71",
      "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
      "depositTokenSymbol": "bnb",
      "nativeTokenSymbol": "beefy",
      "vaultProvider": "beefy",
      "additionalData": {
        "vid": "5",
        "strategyType": "venusBNBV2"
      }
    },
    {
      "address": "0x97e5d50Fe0632A95b9cf1853E744E02f7D816677",
      "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
      "depositTokenSymbol": "cake",
      "nativeTokenSymbol": "beefy",
      "vaultProvider": "beefy",
      "additionalData": {
        "vid": "6",
        "strategyType": "cakeV2"
      }
    },
    {
      "address": "0xb26642B6690E4c4c9A6dAd6115ac149c700C7dfE",
      "depositTokenAddress": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
      "depositTokenSymbol": "cake-bnb",
      "nativeTokenSymbol": "beefy",
      "vaultProvider": "beefy",
      "additionalData": {
        "vid": "7",
        "strategyType": "cakeLP"
      }
    },
    {
      "address": "0xAd61143796D90FD5A61d89D63a546C7dB0a70475",
      "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
      "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
      "depositTokenSymbol": "busd-bnb",
      "nativeTokenSymbol": "beefy",
      "vaultProvider": "beefy",
      "additionalData": {
        "vid": "8",
        "strategyType": "cakeLP"
      }
    },
    {
      "address": "0x1542885D6EeD4EE3AC1a110d3f159003a0774101",
      "depositTokenAddress": "0x804678fa97d91B974ec2af3c843270886528a9E6",
      "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
      "depositTokenSymbol": "cake-busd",
      "nativeTokenSymbol": "beefy",
      "vaultProvider": "beefy",
      "additionalData": {
        "vid": "9",
        "strategyType": "cakeLP-dynamicWithdrawalFee"
      }
    },
    {
      "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
      "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
      "depositTokenSymbol": "cake",
      "nativeTokenSymbol": "auto",
      "vaultProvider": "autofarm",
      "additionalData": {
        "vid": "10",
        "pid": "7",
        "strategyType": "stratX"
      }
    },
    {
      "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
      "depositTokenAddress": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
      "depositTokenSymbol": "cake-bnb",
      "nativeTokenSymbol": "auto",
      "vaultProvider": "autofarm",
      "additionalData": {
        "vid": "11",
        "pid": "243",
        "strategyType": "stratX2PCS"
      }
    },
    {
      "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
      "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
      "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
      "depositTokenSymbol": "busd-bnb",
      "nativeTokenSymbol": "auto",
      "vaultProvider": "autofarm",
      "additionalData": {
        "vid": "12",
        "pid": "244",
        "strategyType": "stratX2PCS"
      }
    },
    {
      "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
      "depositTokenAddress": "0x804678fa97d91B974ec2af3c843270886528a9E6",
      "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
      "depositTokenSymbol": "cake-busd",
      "nativeTokenSymbol": "auto",
      "vaultProvider": "autofarm",
      "additionalData": {
        "vid": "13",
        "pid": "381",
        "strategyType": "stratX2PCS"
      }
    }
  ];

  // runs when class is initialized
  async onInit(args) {
    const abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"profitToReva","type":"uint256"}],"name":"SetProfitToReva","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"profitToRevaStakers","type":"uint256"}],"name":"SetProfitToRevaStakers","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"zapAndDepositAddress","type":"address"}],"name":"SetZapAndDeposit","type":"event"},{"inputs":[],"name":"MAX_PROFIT_TO_REVA","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_PROFIT_TO_REVA_STAKERS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROFIT_DISTRIBUTION_PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_vaultAddress","type":"address"},{"internalType":"address","name":"_depositTokenAddress","type":"address"},{"internalType":"address","name":"_nativeTokenAddress","type":"address"}],"name":"addVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes4","name":"","type":"bytes4"}],"name":"approvedDepositPayloads","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes4","name":"","type":"bytes4"}],"name":"approvedHarvestPayloads","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes4","name":"","type":"bytes4"}],"name":"approvedWithdrawPayloads","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"bytes","name":"_depositPayload","type":"bytes"}],"name":"depositToVault","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"bytes","name":"_depositPayload","type":"bytes"},{"internalType":"address","name":"_user","type":"address"}],"name":"depositToVaultFor","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"getUserVaultPrincipal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"bytes","name":"_payloadHarvest","type":"bytes"}],"name":"harvestVault","outputs":[{"internalType":"uint256","name":"returnedTokenAmount","type":"uint256"},{"internalType":"uint256","name":"returnedRevaAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"haveApprovedTokenToZap","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_revaChefAddress","type":"address"},{"internalType":"address","name":"_revaTokenAddress","type":"address"},{"internalType":"address","name":"_revaUserProxyFactoryAddress","type":"address"},{"internalType":"address","name":"_revaFeeReceiver","type":"address"},{"internalType":"address","name":"_zap","type":"address"},{"internalType":"uint256","name":"_profitToReva","type":"uint256"},{"internalType":"uint256","name":"_profitToRevaStakers","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"profitToReva","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"profitToRevaStakers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fromVid","type":"uint256"},{"internalType":"uint256","name":"_toVid","type":"uint256"},{"internalType":"bytes","name":"_withdrawPayload","type":"bytes"},{"internalType":"bytes","name":"_depositAllPayload","type":"bytes"}],"name":"rebalanceDepositAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fromVid","type":"uint256"},{"internalType":"uint256","name":"_toVid","type":"uint256"},{"internalType":"bytes","name":"_withdrawPayload","type":"bytes"},{"internalType":"bytes","name":"_depositAllPayload","type":"bytes"}],"name":"rebalanceDepositAllAsWBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fromVid","type":"uint256"},{"internalType":"uint256","name":"_toVid","type":"uint256"},{"internalType":"bytes","name":"_withdrawPayload","type":"bytes"},{"internalType":"bytes","name":"_depositLeftPayload","type":"bytes"},{"internalType":"bytes","name":"_depositRightPayload","type":"bytes"}],"name":"rebalanceDepositAllDynamicAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revaChef","outputs":[{"internalType":"contract IRevaChef","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"revaFeeReceiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"revaUserProxyFactory","outputs":[{"internalType":"contract IRevaUserProxyFactory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"bytes4","name":"_methodSig","type":"bytes4"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setDepositMethod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"bytes4","name":"_methodSig","type":"bytes4"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setHarvestMethod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_profitToReva","type":"uint256"}],"name":"setProfitToReva","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_profitToRevaStakers","type":"uint256"}],"name":"setProfitToRevaStakers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"bytes4","name":"_methodSig","type":"bytes4"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setWithdrawMethod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_zapAndDeposit","type":"address"}],"name":"setZapAndDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userProxyContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userVaultPrincipal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"vaultExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vaultLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vaults","outputs":[{"internalType":"address","name":"vaultAddress","type":"address"},{"internalType":"address","name":"depositTokenAddress","type":"address"},{"internalType":"address","name":"nativeTokenAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vid","type":"uint256"},{"internalType":"bytes","name":"_withdrawPayload","type":"bytes"}],"name":"withdrawFromVault","outputs":[{"internalType":"uint256","name":"returnedTokenAmount","type":"uint256"},{"internalType":"uint256","name":"returnedRevaAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenToWithdraw","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"zap","outputs":[{"internalType":"contract IZap","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"zapAndDeposit","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];
    this.contract = new args.web3.eth.Contract(abi, "0x2642fa04bd1f7250be6539c5bDa36335333d9Ccd");
  }

  // runs right before user subscribes to new notifications and populates subscription form
  async onSubscribeForm(args) {
    const strategies = await this._getAllUserStrategies(args);
    return [
      { type: "input-select", id: "strategy", label: "Strategy", values: strategies },
    ];
  }

  // runs when new blocks are added to the mainnet chain - notification scanning happens here
  async onBlocks(args) {

    const userVault = this.vaults.find(v => parseInt(v.additionalData.vid) === parseInt(args.subscription["strategy"]));
    const promises = this.vaults.filter(v => v.depositTokenSymbol === userVault.depositTokenSymbol).map(v => this.getApy(v.additionalData.vid).then((apy) => {
      return {
        vaultProvider: v.vaultProvider,
        depositTokenSymbol: v.depositTokenSymbol,
        vid: v.additionalData.vid,
        apy
      }
    }));
    let result = await Promise.all(promises);
    const userVaultResult = result.find(r => parseInt(r.vid) === parseInt(args.subscription["strategy"]));
    result = result.filter(r => parseInt(r.vid) !== parseInt(args.subscription["strategy"]));
    result = result.sort((a, b) => parseFloat(a.apy) - parseFloat(b.apy))

    for (const vault of result) {
      if (parseFloat(userVaultResult.apy) < parseFloat(vault.apy)) {
        return [
          {
            //notification: `Go to revault.network and change your '${vault.depositTokenSymbol}' strategy to '${vault.vaultProvider}' and get ${vault.apy}% APY!`
            notification: `Your ${this.capitalWords(vault.depositTokenSymbol, "-")} position is currently making ${userVaultResult.apy}% APY, go to app.revault.network, rebalance your position to ${this.capitalWords(vault.vaultProvider)} and make ${vault.apy}%`
          }
        ]
      }
    }
    return [];
  }

  capitalWords(sentence, delimiter= " ") {
    const arr = sentence.split(delimiter).map(a => a.charAt(0).toUpperCase() + a.slice(1));
    return arr.join(delimiter);
  }

  async _getAllUserStrategies(args) {
    const strategies = [];
    const vaults = await this.contract.methods.vaultLength().call();
    for (let vid = 0; vid < vaults; vid++) {
      const principal = await this.contract.methods.getUserVaultPrincipal(this.vaults[vid].additionalData.vid, args.address).call();
      if (parseInt(principal) > 0) {
        strategies.push({
          value: vid,
          label: this.capitalWords(this.vaults.find(v => parseInt(v.additionalData.vid) === vid).depositTokenSymbol, "-")
        });
      }
    }
    return strategies;
  }

  async getApy(vaultId) {
    const vault = this.getVault(vaultId);
    if (vault.vaultProvider === "autofarm") {
      const apy = await this.getAutofarmApy(vault);
      return (100 * parseFloat(apy)).toFixed(2);
    } else if (vault.vaultProvider === "beefy") {
      const apy = await this.getBeefyApy(vault);
      return (100 * parseFloat(apy)).toFixed(2);
    } else if (vault.vaultProvider === "bunny") {
      const apy = await this.getBunnyApy(vault);
      return parseFloat(apy).toFixed(2);
    } else if (vault.vaultProvider === "acryptos") {
      const apy = await this.getAcryptosApy(vault);
      return apy.toFixed(2);
    }
  }

  getVault(vaultId) {
    let vault = this.vaults.find(
        (vault) => vault.additionalData.vid === vaultId.toString(),
    );
    if (!vault) throw new Error(`vault ID ${vaultId} not found`);
    return vault;
  }

  async getAutofarmApy(vault) {
    const res = await fetch(this.autoApyUrl, { mode: "cors" });
    const result = await res.json();
    const apyBreakdown = result.pools[vault.additionalData.pid];
    return apyBreakdown["APY_total"];
  }

  async getBeefyApy(vault) {
    const res = await fetch(this.beefyApyUrl, { mode: "cors", headers: { origin: "https://app.revault.network"} });
    const result = await res.json();
    if (
        vault.depositTokenSymbol === "bnb" ||
        vault.depositTokenSymbol === "busd"
    ) {
      const apyBreakdown = result[`venus-${vault.depositTokenSymbol}`];
      return apyBreakdown.totalApy;
    } else if (vault.depositTokenSymbol === "cake") {
      const apyBreakdown = result["cake-cakev2"];
      return apyBreakdown.totalApy;
    } else {
      const apyBreakdown = result[`cakev2-${vault.depositTokenSymbol}`];
      return apyBreakdown.totalApy;
    }
  }

  async getBunnyApy(vault) {
    const res = await fetch(this.bunnyApyUrl, { mode: "cors" });
    const result = await res.json();
    return result.apy[vault.address].apy;
  }

  async getAcryptosApy(vault) {
    const res = await fetch(this.acryptosApyUrl, { mode: "cors" });
    const result = await res.json();
    const info = result.assets[(vault.depositTokenSymbol).toUpperCase()];
    const apy = parseFloat(info.apyvault) + parseFloat(info.aprfarm);
    return apy;
  }

}

module.exports = ChangeStrategy;
