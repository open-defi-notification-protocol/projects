const RevaStakingPoolInfo = {
    abi: [{
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": false,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "bool", "name": "enabled", "type": "bool"}],
        "name": "CompoundingEnabled",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": true,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "Deposit",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": true,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}, {
            "indexed": false,
            "internalType": "uint256",
            "name": "withdrawalFee",
            "type": "uint256"
        }],
        "name": "EarlyWithdrawal",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": true,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "EmergencyWithdraw",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": true,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}, {
            "indexed": false,
            "internalType": "uint256",
            "name": "withdrawalFee",
            "type": "uint256"
        }],
        "name": "EmergencyWithdrawEarly",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
        }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
        "name": "OwnershipTransferred",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "internalType": "uint256",
            "name": "allocPoint",
            "type": "uint256"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "vRevaMultiplier",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "timeLocked", "type": "uint256"}],
        "name": "PoolAdded",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "uint256", "name": "earlyWithdrawalFee", "type": "uint256"}],
        "name": "SetEarlyWithdrawalFee",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "uint256", "name": "pid", "type": "uint256"}, {
            "indexed": false,
            "internalType": "uint256",
            "name": "allocPoint",
            "type": "uint256"
        }],
        "name": "SetPool",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "address", "name": "_revaAutoCompoundPool", "type": "address"}],
        "name": "SetRevaAutoCompoundPool",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "uint256", "name": "revaPerBlock", "type": "uint256"}],
        "name": "SetRevaPerBlock",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": true,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "VRevaBurned",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": true,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "VRevaMinted",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
            "indexed": true,
            "internalType": "uint256",
            "name": "pid",
            "type": "uint256"
        }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "Withdraw",
        "type": "event"
    }, {
        "inputs": [],
        "name": "EARLY_WITHDRAWAL_FEE_PRECISION",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "MAX_EARLY_WITHDRAWAL_FEE",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "accRevaFromFees",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "accWithdrawnRevaFromFees",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_allocPoint", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_vRevaMultiplier",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "_timeLocked", "type": "uint256"}],
        "name": "add",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }], "name": "depositToCompoundingPosition", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }, {
        "inputs": [],
        "name": "earlyWithdrawalFee",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}],
        "name": "emergencyWithdrawEarly",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }], "name": "enterCompoundingPosition", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }, {"internalType": "address", "name": "_user", "type": "address"}],
        "name": "exitCompoundingPosition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "_revaToken", "type": "address"}, {
            "internalType": "address",
            "name": "_vRevaToken",
            "type": "address"
        }, {"internalType": "address", "name": "_revaFeeReceiver", "type": "address"}, {
            "internalType": "uint256",
            "name": "_revaPerBlock",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "_startBlock", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_earlyWithdrawalFee",
            "type": "uint256"
        }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }, {
        "inputs": [],
        "name": "lastUpdatedRevaFeesBlock",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "massUpdatePools",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }],
        "name": "pendingReva",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "poolInfo",
        "outputs": [{"internalType": "uint256", "name": "totalSupply", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "allocPoint",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "vRevaMultiplier", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "timeLocked",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "lastRewardBlock", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "accRevaPerShare",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "accRevaPerShareFromFees",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "lastAccRevaFromFees", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "poolLength",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "revaAutoCompoundPool",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "revaFeeReceiver",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "revaPerBlock",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "revaToken",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_allocPoint",
            "type": "uint256"
        }], "name": "set", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_earlyWithdrawalFee", "type": "uint256"}],
        "name": "setEarlyWithdrawalFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "_revaAutoCompoundPool", "type": "address"}],
        "name": "setRevaAutoCompoundPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_revaPerBlock", "type": "uint256"}],
        "name": "setRevaPerBlock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "startBlock",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "totalAllocPoint",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}],
        "name": "updatePool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "userIsCompounding",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "userPoolInfo",
        "outputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "rewardDebt",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "rewardFeeDebt", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "timeDeposited",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "vRevaToken",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }], "name": "withdrawEarly", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }],
    address: "0x8B7b2a115201ACd7F95d874D6A9432FcEB9C466A",
};

const RevaAutoCompoundPoolInfo = {
    abi: [{
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
        }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
        "name": "OwnershipTransferred",
        "type": "event"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}],
        "name": "balance",
        "outputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}],
        "name": "enterCompoundingPosition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}],
        "name": "exitCompoundingPosition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "_revaToken", "type": "address"}, {
            "internalType": "address",
            "name": "_vRevaToken",
            "type": "address"
        }, {"internalType": "address", "name": "_revaStakingPool", "type": "address"}],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }, {"internalType": "address", "name": "_user", "type": "address"}],
        "name": "notifyDeposited",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }],
        "name": "pendingReva",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "revaStakingPool",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "revaToken",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "totalPoolShares",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}],
        "name": "updatePool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "userPoolShares",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "vRevaToken",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }],
    address: "0xe8f1cda385a58ae1c1c1b71631da7ad6d137d3cb", // default - read from revaStakingPoolContract
};

const RevaultABI = [{
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "profitToReva", "type": "uint256"}],
    "name": "SetProfitToReva",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "profitToRevaStakers", "type": "uint256"}],
    "name": "SetProfitToRevaStakers",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address",
        "name": "zapAndDepositAddress",
        "type": "address"
    }],
    "name": "SetZapAndDeposit",
    "type": "event"
}, {
    "inputs": [],
    "name": "MAX_PROFIT_TO_REVA",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MAX_PROFIT_TO_REVA_STAKERS",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "PROFIT_DISTRIBUTION_PRECISION",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "_vaultAddress",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "_depositTokenAddress",
        "type": "address"
    }, {"internalType": "address", "name": "_nativeTokenAddress", "type": "address"}],
    "name": "addVault",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
    }],
    "name": "approvedDepositPayloads",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
    }],
    "name": "approvedHarvestPayloads",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
    }],
    "name": "approvedWithdrawPayloads",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_vid",
        "type": "uint256"
    }, {"internalType": "bytes", "name": "_depositPayload", "type": "bytes"}],
    "name": "depositToVault",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_vid",
        "type": "uint256"
    }, {"internalType": "bytes", "name": "_depositPayload", "type": "bytes"}, {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    }], "name": "depositToVaultFor", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    }],
    "name": "getUserVaultPrincipal",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "bytes",
        "name": "_payloadHarvest",
        "type": "bytes"
    }],
    "name": "harvestVault",
    "outputs": [{
        "internalType": "uint256",
        "name": "returnedTokenAmount",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "returnedRevaAmount", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "haveApprovedTokenToZap",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "_revaChefAddress",
        "type": "address"
    }, {"internalType": "address", "name": "_revaTokenAddress", "type": "address"}, {
        "internalType": "address",
        "name": "_revaUserProxyFactoryAddress",
        "type": "address"
    }, {"internalType": "address", "name": "_revaFeeReceiver", "type": "address"}, {
        "internalType": "address",
        "name": "_zap",
        "type": "address"
    }, {"internalType": "uint256", "name": "_profitToReva", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_profitToRevaStakers",
        "type": "uint256"
    }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "profitToReva",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "profitToRevaStakers",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_fromVid", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_toVid",
        "type": "uint256"
    }, {"internalType": "bytes", "name": "_withdrawPayload", "type": "bytes"}, {
        "internalType": "bytes",
        "name": "_depositAllPayload",
        "type": "bytes"
    }], "name": "rebalanceDepositAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_fromVid", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_toVid",
        "type": "uint256"
    }, {"internalType": "bytes", "name": "_withdrawPayload", "type": "bytes"}, {
        "internalType": "bytes",
        "name": "_depositAllPayload",
        "type": "bytes"
    }], "name": "rebalanceDepositAllAsWBNB", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_fromVid", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_toVid",
        "type": "uint256"
    }, {"internalType": "bytes", "name": "_withdrawPayload", "type": "bytes"}, {
        "internalType": "bytes",
        "name": "_depositLeftPayload",
        "type": "bytes"
    }, {"internalType": "bytes", "name": "_depositRightPayload", "type": "bytes"}],
    "name": "rebalanceDepositAllDynamicAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "revaChef",
    "outputs": [{"internalType": "contract IRevaChef", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "revaFeeReceiver",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "revaUserProxyFactory",
    "outputs": [{"internalType": "contract IRevaUserProxyFactory", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "bytes4",
        "name": "_methodSig",
        "type": "bytes4"
    }, {"internalType": "bool", "name": "_approved", "type": "bool"}],
    "name": "setDepositMethod",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "bytes4",
        "name": "_methodSig",
        "type": "bytes4"
    }, {"internalType": "bool", "name": "_approved", "type": "bool"}],
    "name": "setHarvestMethod",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_profitToReva", "type": "uint256"}],
    "name": "setProfitToReva",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_profitToRevaStakers", "type": "uint256"}],
    "name": "setProfitToRevaStakers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "bytes4",
        "name": "_methodSig",
        "type": "bytes4"
    }, {"internalType": "bool", "name": "_approved", "type": "bool"}],
    "name": "setWithdrawMethod",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_zapAndDeposit", "type": "address"}],
    "name": "setZapAndDeposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "userProxyContractAddress",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "userVaultPrincipal",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "name": "vaultExists",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "vaultLength",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "vaults",
    "outputs": [{
        "internalType": "address",
        "name": "vaultAddress",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "depositTokenAddress",
        "type": "address"
    }, {"internalType": "address", "name": "nativeTokenAddress", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "bytes",
        "name": "_withdrawPayload",
        "type": "bytes"
    }],
    "name": "withdrawFromVault",
    "outputs": [{
        "internalType": "uint256",
        "name": "returnedTokenAmount",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "returnedRevaAmount", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "tokenToWithdraw",
        "type": "address"
    }, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdrawToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "zap",
    "outputs": [{"internalType": "contract IZap", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "zapAndDeposit",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {"stateMutability": "payable", "type": "receive"}];

const Vaults =  {
    "bnb.bunny.venus": {
        "vaultId": "0",
        "address": "0x52cFa188A1468A521A98eaa798E715Fbb9eb38a3",
        "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "venus",
        "rewardTokens": {
            "underlying": [
                "bnb",
                "bunny"
            ],
            "revault": [
                "bnb",
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "venus"
        },
        "state": {
            "isPaused": false,
            "overrideApy": 0
        }
    },
    "busd.bunny.venus": {
        "vaultId": "1",
        "address": "0x0243A20B20ECa78ddEDF6b8ddb43a0286438A67A",
        "depositTokenAddress": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "busd",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "venus",
        "rewardTokens": {
            "underlying": [
                "busd",
                "bunny"
            ],
            "revault": [
                "busd",
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "venus"
        },
        "state": {
            "isPaused": false,
            "overrideApy": 0
        }
    },
    "cake.bunny.pancake": {
        "vaultId": "2",
        "address": "0xEDfcB78e73f7bA6aD2D829bf5D462a0924da28eD",
        "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "cake",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake",
                "bunny"
            ],
            "revault": [
                "cake",
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "cakeToCake"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake-bnb.bunny.pancake": {
        "vaultId": "3",
        "address": "0xA599d6b81eC4a5DDd8eCa85e3AAc31E006aF00AA",
        "depositTokenAddress": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "cake-bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake-bnb",
                "bunny"
            ],
            "revault": [
                "cake-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "flipToFlip"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd-bnb.bunny.pancake": {
        "vaultId": "4",
        "address": "0xE0aca387C6600b455CCFC32B253e2DB13b71ca62",
        "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "busd-bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "busd-bnb",
                "bunny"
            ],
            "revault": [
                "busd-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "flipToFlip"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "bnb.beefy.venus": {
        "vaultId": "5",
        "address": "0x6BE4741AB0aD233e4315a10bc783a7B923386b71",
        "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "bnb",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "venus",
        "rewardTokens": {
            "underlying": [
                "bnb"
            ],
            "revault": [
                "bnb",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "venusBNBV2",
            "apyKey": "venus-bnb"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake.beefy.pancake": {
        "vaultId": "6",
        "address": "0x97e5d50Fe0632A95b9cf1853E744E02f7D816677",
        "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "cake",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake"
            ],
            "revault": [
                "cake",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "cakeV2",
            "apyKey": "cake-cakev2"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake-bnb.beefy.pancake": {
        "vaultId": "7",
        "address": "0xb26642B6690E4c4c9A6dAd6115ac149c700C7dfE",
        "depositTokenAddress": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "cake-bnb",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake-bnb"
            ],
            "revault": [
                "cake-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "commonChefLP",
            "apyKey": "cakev2-cake-bnb"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd-bnb.beefy.pancake": {
        "vaultId": "8",
        "address": "0xAd61143796D90FD5A61d89D63a546C7dB0a70475",
        "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "busd-bnb",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "busd-bnb"
            ],
            "revault": [
                "busd-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "cakeLP",
            "apyKey": "cakev2-busd-bnb"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake-busd.beefy.pancake": {
        "vaultId": "9",
        "address": "0x1542885D6EeD4EE3AC1a110d3f159003a0774101",
        "depositTokenAddress": "0x804678fa97d91B974ec2af3c843270886528a9E6",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "cake-busd",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake-busd"
            ],
            "revault": [
                "cake-busd",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "cakeLP-dynamicWithdrawalFee",
            "apyKey": "cakev2-cake-busd"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake.autofarm.pancake": {
        "vaultId": "10",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "cake",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake"
            ],
            "revault": [
                "cake",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "7",
            "strategyType": "stratX",
            "strategyAddress": "0x1004a537a1c39ee9d38110bfe3042627c2cd5bbe"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake-bnb.autofarm.pancake": {
        "vaultId": "11",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "cake-bnb",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake-bnb"
            ],
            "revault": [
                "cake-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "243",
            "strategyType": "stratX2PCS",
            "strategyAddress": "0xda88d6f9cd5487d073fd18be88988b8479b5d28c"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd-bnb.autofarm.pancake": {
        "vaultId": "12",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "busd-bnb",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "busd-bnb"
            ],
            "revault": [
                "busd-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "244",
            "strategyType": "stratX2PCS",
            "strategyAddress": "0x5d3e61eb616b0ab2e8c6e8d1d98cbee8c7a089a2"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake-busd.autofarm.pancake": {
        "vaultId": "13",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0x804678fa97d91B974ec2af3c843270886528a9E6",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "cake-busd",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake-busd"
            ],
            "revault": [
                "cake-busd",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "381",
            "strategyType": "stratX2PCS",
            "strategyAddress": "0x3785f00457b663990e1ec9bd72ae7b2aa4130246"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "bnb.bunny.qubit": {
        "vaultId": "14",
        "address": "0x67c42b3dAC9526efCBFeeb2FC1C56Cf77F494e46",
        "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "qubit",
        "rewardTokens": {
            "underlying": [
                "qbt",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "qubit"
        },
        "state": {
            "isPaused": true,
            "overrideApy": false
        }
    },
    "busd.bunny.qubit": {
        "vaultId": "15",
        "address": "0x4FC359E39A99acFDF44c794eF702fab93067B2A6",
        "depositTokenAddress": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "busd",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "qubit",
        "rewardTokens": {
            "underlying": [
                "qbt",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "qubit"
        },
        "state": {
            "isPaused": true,
            "overrideApy": false
        }
    },
    "btcb.bunny.qubit": {
        "vaultId": "16",
        "address": "0xB9Cf0d36e82C2a1b46eD51e44dC0a4B0100D6d74",
        "depositTokenAddress": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "btcb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "qubit",
        "rewardTokens": {
            "underlying": [
                "qbt",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "qubit"
        },
        "state": {
            "isPaused": true,
            "overrideApy": false
        }
    },
    "eth.bunny.qubit": {
        "vaultId": "17",
        "address": "0x4b107b794c9Bbfd83E5Ac9E8Dd59F918510C5729",
        "depositTokenAddress": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "eth",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "qubit",
        "rewardTokens": {
            "underlying": [
                "qbt",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "qubit"
        },
        "state": {
            "isPaused": true,
            "overrideApy": false
        }
    },
    "bnb.acryptos.venus": {
        "vaultId": "18",
        "address": "0x6Fe6762E9314ad80803fef083c8bB16Af435a628",
        "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "bnb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "venus",
        "rewardTokens": {
            "underlying": [
                "bnb"
            ],
            "revault": [
                "bnb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd.acryptos.channels": {
        "vaultId": "19",
        "address": "0x14B197CA1A5Aef891e86E1EaE7A110c865c7DCec",
        "depositTokenAddress": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "busd",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "channels",
        "rewardTokens": {
            "underlying": [
                "busd"
            ],
            "revault": [
                "busd",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake.acryptos.pancake": {
        "vaultId": "20",
        "address": "0xB6eB654FBDc697edD73174a19B074BC67c00a0C0",
        "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "cake",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake"
            ],
            "revault": [
                "cake",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake-bnb.acryptos.pancake": {
        "vaultId": "21",
        "address": "0xe9861F3624B5F7012991ba2762CD1eAD4c622FF5",
        "depositTokenAddress": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "cake-bnb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake-bnb"
            ],
            "revault": [
                "cake-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd-bnb.acryptos.pancake": {
        "vaultId": "22",
        "address": "0x9Ce0E88c803672CE672b9b9e66c664B81499cE04",
        "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "busd-bnb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "busd-bnb"
            ],
            "revault": [
                "busd-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake-busd.acryptos.pancake": {
        "vaultId": "23",
        "address": "0x0551EA09C83FAFF84d83cfB1c75830EB1229fd31",
        "depositTokenAddress": "0x804678fa97d91B974ec2af3c843270886528a9E6",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "cake-busd",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake-busd"
            ],
            "revault": [
                "cake-busd",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb.acryptos.venus": {
        "vaultId": "24",
        "address": "0x0395fCC8E1a1E30A1427D4079aF6E23c805E3eeF",
        "depositTokenAddress": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "btcb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "venus",
        "rewardTokens": {
            "underlying": [
                "btcb"
            ],
            "revault": [
                "btcb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth.acryptos.venus": {
        "vaultId": "25",
        "address": "0x35cAdD2DAA782556B7fD90A98663BaCDb78d863e",
        "depositTokenAddress": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "eth",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "venus",
        "rewardTokens": {
            "underlying": [
                "eth"
            ],
            "revault": [
                "eth",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-bnb.bunny.pancake": {
        "vaultId": "26",
        "address": "0x285F793CE97079D4a5712E616AFBbb971Dbf1f1f",
        "depositTokenAddress": "0x61eb789d75a95caa3ff50ed7e47b96c132fec082",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "btcb-bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-bnb",
                "bunny"
            ],
            "revault": [
                "btcb-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "flipToFlip"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth-bnb.bunny.pancake": {
        "vaultId": "27",
        "address": "0x0d17e7B77C678C79C3ab5176e164FF0BCceb8EAa",
        "depositTokenAddress": "0x74E4716E431f45807DCF19f284c7aA99F18a4fbc",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "eth-bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "eth-bnb",
                "bunny"
            ],
            "revault": [
                "eth-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "flipToFlip"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-bnb.acryptos.pancake": {
        "vaultId": "28",
        "address": "0x1231082d043393f8990861521a10bdc911fedbbe",
        "depositTokenAddress": "0x61eb789d75a95caa3ff50ed7e47b96c132fec082",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "btcb-bnb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-bnb"
            ],
            "revault": [
                "btcb-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-busd.acryptos.pancake": {
        "vaultId": "29",
        "address": "0xbe627707f079e32A54d323BE0c61Da02a28bD0bd",
        "depositTokenAddress": "0xf45cd219aef8618a92baa7ad848364a158a24f33",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "btcb-busd",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-busd"
            ],
            "revault": [
                "btcb-busd",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth-bnb.acryptos.pancake": {
        "vaultId": "30",
        "address": "0x08234f020496ccceeb144f9637a566b936b0ee6f",
        "depositTokenAddress": "0x74E4716E431f45807DCF19f284c7aA99F18a4fbc",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "eth-bnb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "eth-bnb"
            ],
            "revault": [
                "eth-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-bnb.autofarm.pancake": {
        "vaultId": "31",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0x61eb789d75a95caa3ff50ed7e47b96c132fec082",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "btcb-bnb",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-bnb"
            ],
            "revault": [
                "btcb-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "246",
            "strategyType": "stratX2PCS",
            "strategyAddress": "0x0A26666667BdF4dD6BB7e0db2118f8Eb32BEF1eF"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-busd.autofarm.pancake": {
        "vaultId": "32",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0xf45cd219aef8618a92baa7ad848364a158a24f33",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "btcb-busd",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-busd"
            ],
            "revault": [
                "btcb-busd",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "354",
            "strategyType": "stratX2PCS",
            "strategyAddress": "0x1E29906e949C76E32ed2b230D6ce94Ef7E54ae03"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth-bnb.autofarm.pancake": {
        "vaultId": "33",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0x74E4716E431f45807DCF19f284c7aA99F18a4fbc",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "eth-bnb",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "eth-bnb"
            ],
            "revault": [
                "eth-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "247",
            "strategyType": "stratX2PCS",
            "strategyAddress": "0x0E13c91Df5D1BBaE1622141DB2A13E30bBFCe778"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-eth.autofarm.pancake": {
        "vaultId": "34",
        "address": "0x0895196562C7868C5Be92459FaE7f877ED450452",
        "depositTokenAddress": "0xd171b26e4484402de70e3ea256be5a2630d7e88d",
        "nativeTokenAddress": "0xa184088a740c695E156F91f5cC086a06bb78b827",
        "depositTokenSymbol": "btcb-eth",
        "nativeTokenSymbol": "auto",
        "vaultProvider": "autofarm",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-eth"
            ],
            "revault": [
                "btcb-eth",
                "reva"
            ]
        },
        "additionalData": {
            "pid": "406",
            "strategyType": "stratX2PCS",
            "strategyAddress": "0x15D12239E30c780b98f4a833148A0fa828Db5B2C"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-bnb.beefy.pancake": {
        "vaultId": "35",
        "address": "0xafe4f29578fbfe7be32b836cbeb81dab6574cc70",
        "depositTokenAddress": "0x61eb789d75a95caa3ff50ed7e47b96c132fec082",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "btcb-bnb",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-bnb"
            ],
            "revault": [
                "btcb-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "cakeLP",
            "apyKey": "cakev2-btcb-bnb"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-busd.beefy.pancake": {
        "vaultId": "36",
        "address": "0x40d21bcd71b0be8864ff3dd62373cffa4e151d6f",
        "depositTokenAddress": "0xf45cd219aef8618a92baa7ad848364a158a24f33",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "btcb-busd",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-busd"
            ],
            "revault": [
                "btcb-busd",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "cakeLP",
            "apyKey": "cakev2-btcb-busd"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-eth.beefy.pancake": {
        "vaultId": "37",
        "address": "0xEf43E54Bb4221106953951238FC301a1f8939490",
        "depositTokenAddress": "0xd171b26e4484402de70e3ea256be5a2630d7e88d",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "btcb-eth",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "btcb-eth"
            ],
            "revault": [
                "btcb-eth",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "cakeV2",
            "apyKey": "cakev2-btcb-eth"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth-bnb.beefy.pancake": {
        "vaultId": "38",
        "address": "0x0eb78598851d08218d54fce965ee2bf29c288fac",
        "depositTokenAddress": "0x74E4716E431f45807DCF19f284c7aA99F18a4fbc",
        "nativeTokenAddress": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
        "depositTokenSymbol": "eth-bnb",
        "nativeTokenSymbol": "bifi",
        "vaultProvider": "beefy",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "eth-bnb"
            ],
            "revault": [
                "eth-bnb",
                "reva"
            ]
        },
        "additionalData": {
            "strategyType": "cakeLP",
            "apyKey": "cakev2-eth-bnb"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "bnb.acryptos.atlantis": {
        "vaultId": "39",
        "address": "0x9978992538bD3e70c1Aff101dedd50E9E27CfbdE",
        "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "bnb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "atlantis",
        "rewardTokens": {
            "underlying": [
                "bnb"
            ],
            "revault": [
                "bnb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb.acryptos.atlantis": {
        "vaultId": "40",
        "address": "0x52525a9d0c562fc7b685efc754f496fEa055c006",
        "depositTokenAddress": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "btcb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "atlantis",
        "rewardTokens": {
            "underlying": [
                "btcb"
            ],
            "revault": [
                "btcb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd.acryptos.atlantis": {
        "vaultId": "41",
        "address": "0x17c9bBa4c84116472309d78B18fB038D4F15E0D6",
        "depositTokenAddress": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "busd",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "atlantis",
        "rewardTokens": {
            "underlying": [
                "busd"
            ],
            "revault": [
                "busd",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth.acryptos.atlantis": {
        "vaultId": "42",
        "address": "0xCF69F9e5558D1dafeC4373e3B569F53468bF6317",
        "depositTokenAddress": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "eth",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "atlantis",
        "rewardTokens": {
            "underlying": [
                "eth"
            ],
            "revault": [
                "eth",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "bnb.acryptos.channels": {
        "vaultId": "43",
        "address": "0x10137A821fD5aeA332F682F4CBAfC839E4373104",
        "depositTokenAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "bnb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "channels",
        "rewardTokens": {
            "underlying": [
                "bnb"
            ],
            "revault": [
                "bnb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb.acryptos.channels": {
        "vaultId": "44",
        "address": "0xFcf924f58fda91190b874547E08DFF069C6d5a48",
        "depositTokenAddress": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "btcb",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "channels",
        "rewardTokens": {
            "underlying": [
                "btcb"
            ],
            "revault": [
                "btcb",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth.acryptos.channels": {
        "vaultId": "45",
        "address": "0x5F9AAb778447010Ee0121E3460738CF8d1AEdF55",
        "depositTokenAddress": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "eth",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "channels",
        "rewardTokens": {
            "underlying": [
                "eth"
            ],
            "revault": [
                "eth",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd.acryptos.venus": {
        "vaultId": "46",
        "address": "0x532d5775cE71Cb967B78acbc290f80DF80A9bAa5",
        "depositTokenAddress": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "nativeTokenAddress": "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
        "depositTokenSymbol": "busd",
        "nativeTokenSymbol": "acs",
        "vaultProvider": "acryptos",
        "protocol": "venus",
        "rewardTokens": {
            "underlying": [
                "busd"
            ],
            "revault": [
                "busd",
                "reva"
            ]
        },
        "additionalData": {
            "farmAddress": "0xb1fa5d3c0111d8E9ac43A19ef17b281D5D4b474E"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "btcb-bnb.bunny.pancake.cake": {
        "vaultId": "47",
        "address": "0xac20925e6615ad6871987e199783Fa80Bf24EB39",
        "depositTokenAddress": "0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "btcb-bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "flipToCake"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "busd-bnb.bunny.pancake.cake": {
        "vaultId": "48",
        "address": "0x81fa6F9F4599c5316Cc53B782DE7c01EFf4f9551",
        "depositTokenAddress": "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "busd-bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "flipToCake"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "eth-bnb.bunny.pancake.cake": {
        "vaultId": "49",
        "address": "0x7D52a1697F2dF08E6fb2b5A88E0E8e4D7C11a921",
        "depositTokenAddress": "0x74E4716E431f45807DCF19f284c7aA99F18a4fbc",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "eth-bnb",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "pancake",
        "rewardTokens": {
            "underlying": [
                "cake",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "flipToCake"
        },
        "state": {
            "isPaused": false,
            "overrideApy": false
        }
    },
    "cake.bunny.qubit": {
        "vaultId": "50",
        "address": "0xDe80CE223C9f1D1db0BC8D5bDD88E03f6882eEA3",
        "depositTokenAddress": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        "nativeTokenAddress": "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        "depositTokenSymbol": "cake",
        "nativeTokenSymbol": "bunny",
        "vaultProvider": "bunny",
        "protocol": "qubit",
        "rewardTokens": {
            "underlying": [
                "qbt",
                "bunny"
            ],
            "revault": [
                "reva"
            ]
        },
        "additionalData": {
            "vaultType": "qubit"
        },
        "state": {
            "isPaused": true,
            "overrideApy": false
        }
    }
};

module.exports = {
    RevaStakingPoolInfo,
    RevaAutoCompoundPoolInfo,
    RevaultABI,
    Vaults
};
