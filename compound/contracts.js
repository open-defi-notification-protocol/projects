const abi = {
    CompoundLens: [{
        "constant": false,
        "inputs": [{"internalType": "contract CToken", "name": "cToken", "type": "address"}, {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
        }],
        "name": "cTokenBalances",
        "outputs": [{
            "components": [{"internalType": "address", "name": "cToken", "type": "address"}, {
                "internalType": "uint256",
                "name": "balanceOf",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "borrowBalanceCurrent", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "balanceOfUnderlying",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "tokenBalance", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "tokenAllowance",
                "type": "uint256"
            }], "internalType": "struct CompoundLens.CTokenBalances", "name": "", "type": "tuple"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"internalType": "contract CToken[]", "name": "cTokens", "type": "address[]"}, {
            "internalType": "address payable",
            "name": "account",
            "type": "address"
        }],
        "name": "cTokenBalancesAll",
        "outputs": [{
            "components": [{"internalType": "address", "name": "cToken", "type": "address"}, {
                "internalType": "uint256",
                "name": "balanceOf",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "borrowBalanceCurrent", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "balanceOfUnderlying",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "tokenBalance", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "tokenAllowance",
                "type": "uint256"
            }], "internalType": "struct CompoundLens.CTokenBalances[]", "name": "", "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false, "inputs": [{"internalType": "contract CToken", "name": "cToken", "type": "address"}], "name": "cTokenMetadata", "outputs": [{
            "components": [{"internalType": "address", "name": "cToken", "type": "address"}, {
                "internalType": "uint256",
                "name": "exchangeRateCurrent",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "supplyRatePerBlock", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "borrowRatePerBlock",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "reserveFactorMantissa", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "totalBorrows",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "totalReserves", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "totalSupply",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "totalCash", "type": "uint256"}, {
                "internalType": "bool",
                "name": "isListed",
                "type": "bool"
            }, {"internalType": "uint256", "name": "collateralFactorMantissa", "type": "uint256"}, {
                "internalType": "address",
                "name": "underlyingAssetAddress",
                "type": "address"
            }, {"internalType": "uint256", "name": "cTokenDecimals", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "underlyingDecimals",
                "type": "uint256"
            }], "internalType": "struct CompoundLens.CTokenMetadata", "name": "", "type": "tuple"
        }], "payable": false, "stateMutability": "nonpayable", "type": "function"
    }, {
        "constant": false, "inputs": [{"internalType": "contract CToken[]", "name": "cTokens", "type": "address[]"}], "name": "cTokenMetadataAll", "outputs": [{
            "components": [{"internalType": "address", "name": "cToken", "type": "address"}, {
                "internalType": "uint256",
                "name": "exchangeRateCurrent",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "supplyRatePerBlock", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "borrowRatePerBlock",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "reserveFactorMantissa", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "totalBorrows",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "totalReserves", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "totalSupply",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "totalCash", "type": "uint256"}, {
                "internalType": "bool",
                "name": "isListed",
                "type": "bool"
            }, {"internalType": "uint256", "name": "collateralFactorMantissa", "type": "uint256"}, {
                "internalType": "address",
                "name": "underlyingAssetAddress",
                "type": "address"
            }, {"internalType": "uint256", "name": "cTokenDecimals", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "underlyingDecimals",
                "type": "uint256"
            }], "internalType": "struct CompoundLens.CTokenMetadata[]", "name": "", "type": "tuple[]"
        }], "payable": false, "stateMutability": "nonpayable", "type": "function"
    }, {
        "constant": false,
        "inputs": [{"internalType": "contract CToken", "name": "cToken", "type": "address"}],
        "name": "cTokenUnderlyingPrice",
        "outputs": [{
            "components": [{"internalType": "address", "name": "cToken", "type": "address"}, {
                "internalType": "uint256",
                "name": "underlyingPrice",
                "type": "uint256"
            }], "internalType": "struct CompoundLens.CTokenUnderlyingPrice", "name": "", "type": "tuple"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"internalType": "contract CToken[]", "name": "cTokens", "type": "address[]"}],
        "name": "cTokenUnderlyingPriceAll",
        "outputs": [{
            "components": [{"internalType": "address", "name": "cToken", "type": "address"}, {
                "internalType": "uint256",
                "name": "underlyingPrice",
                "type": "uint256"
            }], "internalType": "struct CompoundLens.CTokenUnderlyingPrice[]", "name": "", "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"internalType": "contract ComptrollerLensInterface", "name": "comptroller", "type": "address"}, {
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "getAccountLimits",
        "outputs": [{
            "components": [{"internalType": "contract CToken[]", "name": "markets", "type": "address[]"}, {
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "shortfall", "type": "uint256"}],
            "internalType": "struct CompoundLens.AccountLimits",
            "name": "",
            "type": "tuple"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"internalType": "contract Comp", "name": "comp", "type": "address"}, {"internalType": "address", "name": "account", "type": "address"}],
        "name": "getCompBalanceMetadata",
        "outputs": [{
            "components": [{"internalType": "uint256", "name": "balance", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }, {"internalType": "address", "name": "delegate", "type": "address"}],
            "internalType": "struct CompoundLens.CompBalanceMetadata",
            "name": "",
            "type": "tuple"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"internalType": "contract Comp", "name": "comp", "type": "address"}, {
            "internalType": "contract ComptrollerLensInterface",
            "name": "comptroller",
            "type": "address"
        }, {"internalType": "address", "name": "account", "type": "address"}],
        "name": "getCompBalanceMetadataExt",
        "outputs": [{
            "components": [{"internalType": "uint256", "name": "balance", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }, {"internalType": "address", "name": "delegate", "type": "address"}, {"internalType": "uint256", "name": "allocated", "type": "uint256"}],
            "internalType": "struct CompoundLens.CompBalanceMetadataExt",
            "name": "",
            "type": "tuple"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"internalType": "contract Comp", "name": "comp", "type": "address"}, {
            "internalType": "address",
            "name": "account",
            "type": "address"
        }, {"internalType": "uint32[]", "name": "blockNumbers", "type": "uint32[]"}],
        "name": "getCompVotes",
        "outputs": [{
            "components": [{"internalType": "uint256", "name": "blockNumber", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }], "internalType": "struct CompoundLens.CompVotes[]", "name": "", "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"internalType": "contract GovernorBravoInterface", "name": "governor", "type": "address"}, {
            "internalType": "uint256[]",
            "name": "proposalIds",
            "type": "uint256[]"
        }],
        "name": "getGovBravoProposals",
        "outputs": [{
            "components": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}, {
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            }, {"internalType": "uint256", "name": "eta", "type": "uint256"}, {
                "internalType": "address[]",
                "name": "targets",
                "type": "address[]"
            }, {"internalType": "uint256[]", "name": "values", "type": "uint256[]"}, {
                "internalType": "string[]",
                "name": "signatures",
                "type": "string[]"
            }, {"internalType": "bytes[]", "name": "calldatas", "type": "bytes[]"}, {
                "internalType": "uint256",
                "name": "startBlock",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "endBlock", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "forVotes",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "againstVotes", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "abstainVotes",
                "type": "uint256"
            }, {"internalType": "bool", "name": "canceled", "type": "bool"}, {"internalType": "bool", "name": "executed", "type": "bool"}],
            "internalType": "struct CompoundLens.GovBravoProposal[]",
            "name": "",
            "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"internalType": "contract GovernorBravoInterface", "name": "governor", "type": "address"}, {
            "internalType": "address",
            "name": "voter",
            "type": "address"
        }, {"internalType": "uint256[]", "name": "proposalIds", "type": "uint256[]"}],
        "name": "getGovBravoReceipts",
        "outputs": [{
            "components": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}, {
                "internalType": "bool",
                "name": "hasVoted",
                "type": "bool"
            }, {"internalType": "uint8", "name": "support", "type": "uint8"}, {"internalType": "uint96", "name": "votes", "type": "uint96"}],
            "internalType": "struct CompoundLens.GovBravoReceipt[]",
            "name": "",
            "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"internalType": "contract GovernorAlpha", "name": "governor", "type": "address"}, {
            "internalType": "uint256[]",
            "name": "proposalIds",
            "type": "uint256[]"
        }],
        "name": "getGovProposals",
        "outputs": [{
            "components": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}, {
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            }, {"internalType": "uint256", "name": "eta", "type": "uint256"}, {
                "internalType": "address[]",
                "name": "targets",
                "type": "address[]"
            }, {"internalType": "uint256[]", "name": "values", "type": "uint256[]"}, {
                "internalType": "string[]",
                "name": "signatures",
                "type": "string[]"
            }, {"internalType": "bytes[]", "name": "calldatas", "type": "bytes[]"}, {
                "internalType": "uint256",
                "name": "startBlock",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "endBlock", "type": "uint256"}, {
                "internalType": "uint256",
                "name": "forVotes",
                "type": "uint256"
            }, {"internalType": "uint256", "name": "againstVotes", "type": "uint256"}, {
                "internalType": "bool",
                "name": "canceled",
                "type": "bool"
            }, {"internalType": "bool", "name": "executed", "type": "bool"}], "internalType": "struct CompoundLens.GovProposal[]", "name": "", "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"internalType": "contract GovernorAlpha", "name": "governor", "type": "address"}, {
            "internalType": "address",
            "name": "voter",
            "type": "address"
        }, {"internalType": "uint256[]", "name": "proposalIds", "type": "uint256[]"}],
        "name": "getGovReceipts",
        "outputs": [{
            "components": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}, {
                "internalType": "bool",
                "name": "hasVoted",
                "type": "bool"
            }, {"internalType": "bool", "name": "support", "type": "bool"}, {"internalType": "uint96", "name": "votes", "type": "uint96"}],
            "internalType": "struct CompoundLens.GovReceipt[]",
            "name": "",
            "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }],
    Comptroller: [
        {
            "constant": true,
            "inputs": [],
            "name": "pendingAdmin",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newPendingAdmin",
                    "type": "address"
                }
            ],
            "name": "_setPendingAdmin",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "comptrollerImplementation",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "_acceptImplementation",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "pendingComptrollerImplementation",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newPendingImplementation",
                    "type": "address"
                }
            ],
            "name": "_setPendingImplementation",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "_acceptAdmin",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "oldPendingImplementation",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "newPendingImplementation",
                    "type": "address"
                }
            ],
            "name": "NewPendingImplementation",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "oldImplementation",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "newImplementation",
                    "type": "address"
                }
            ],
            "name": "NewImplementation",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "oldPendingAdmin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "newPendingAdmin",
                    "type": "address"
                }
            ],
            "name": "NewPendingAdmin",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "oldAdmin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "newAdmin",
                    "type": "address"
                }
            ],
            "name": "NewAdmin",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "error",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "info",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "detail",
                    "type": "uint256"
                }
            ],
            "name": "Failure",
            "type": "event"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "action",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "pauseState",
                    "type": "bool"
                }
            ],
            "name": "ActionPaused",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "action",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "pauseState",
                    "type": "bool"
                }
            ],
            "name": "ActionPaused",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "CompGranted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newSpeed",
                    "type": "uint256"
                }
            ],
            "name": "CompSpeedUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "contributor",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newSpeed",
                    "type": "uint256"
                }
            ],
            "name": "ContributorCompSpeedUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "compDelta",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "compBorrowIndex",
                    "type": "uint256"
                }
            ],
            "name": "DistributedBorrowerComp",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "supplier",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "compDelta",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "compSupplyIndex",
                    "type": "uint256"
                }
            ],
            "name": "DistributedSupplierComp",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "error",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "info",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "detail",
                    "type": "uint256"
                }
            ],
            "name": "Failure",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "MarketEntered",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "MarketExited",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                }
            ],
            "name": "MarketListed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newBorrowCap",
                    "type": "uint256"
                }
            ],
            "name": "NewBorrowCap",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "oldBorrowCapGuardian",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "newBorrowCapGuardian",
                    "type": "address"
                }
            ],
            "name": "NewBorrowCapGuardian",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "oldCloseFactorMantissa",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newCloseFactorMantissa",
                    "type": "uint256"
                }
            ],
            "name": "NewCloseFactor",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "oldCollateralFactorMantissa",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newCollateralFactorMantissa",
                    "type": "uint256"
                }
            ],
            "name": "NewCollateralFactor",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "oldLiquidationIncentiveMantissa",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newLiquidationIncentiveMantissa",
                    "type": "uint256"
                }
            ],
            "name": "NewLiquidationIncentive",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "oldPauseGuardian",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "newPauseGuardian",
                    "type": "address"
                }
            ],
            "name": "NewPauseGuardian",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "contract PriceOracle",
                    "name": "oldPriceOracle",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "contract PriceOracle",
                    "name": "newPriceOracle",
                    "type": "address"
                }
            ],
            "name": "NewPriceOracle",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract Unitroller",
                    "name": "unitroller",
                    "type": "address"
                }
            ],
            "name": "_become",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "_borrowGuardianPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "_grantComp",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "_mintGuardianPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newBorrowCapGuardian",
                    "type": "address"
                }
            ],
            "name": "_setBorrowCapGuardian",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "state",
                    "type": "bool"
                }
            ],
            "name": "_setBorrowPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "newCloseFactorMantissa",
                    "type": "uint256"
                }
            ],
            "name": "_setCloseFactor",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "newCollateralFactorMantissa",
                    "type": "uint256"
                }
            ],
            "name": "_setCollateralFactor",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "compSpeed",
                    "type": "uint256"
                }
            ],
            "name": "_setCompSpeed",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "contributor",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "compSpeed",
                    "type": "uint256"
                }
            ],
            "name": "_setContributorCompSpeed",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "newLiquidationIncentiveMantissa",
                    "type": "uint256"
                }
            ],
            "name": "_setLiquidationIncentive",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract CToken[]",
                    "name": "cTokens",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "newBorrowCaps",
                    "type": "uint256[]"
                }
            ],
            "name": "_setMarketBorrowCaps",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "state",
                    "type": "bool"
                }
            ],
            "name": "_setMintPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newPauseGuardian",
                    "type": "address"
                }
            ],
            "name": "_setPauseGuardian",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract PriceOracle",
                    "name": "newOracle",
                    "type": "address"
                }
            ],
            "name": "_setPriceOracle",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "bool",
                    "name": "state",
                    "type": "bool"
                }
            ],
            "name": "_setSeizePaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "bool",
                    "name": "state",
                    "type": "bool"
                }
            ],
            "name": "_setTransferPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                }
            ],
            "name": "_supportMarket",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "accountAssets",
            "outputs": [
                {
                    "internalType": "contract CToken",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "allMarkets",
            "outputs": [
                {
                    "internalType": "contract CToken",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "borrowAmount",
                    "type": "uint256"
                }
            ],
            "name": "borrowAllowed",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "borrowCapGuardian",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "borrowCaps",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "borrowGuardianPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "borrowAmount",
                    "type": "uint256"
                }
            ],
            "name": "borrowVerify",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "contract CToken",
                    "name": "cToken",
                    "type": "address"
                }
            ],
            "name": "checkMembership",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "holder",
                    "type": "address"
                },
                {
                    "internalType": "contract CToken[]",
                    "name": "cTokens",
                    "type": "address[]"
                }
            ],
            "name": "claimComp",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "holders",
                    "type": "address[]"
                },
                {
                    "internalType": "contract CToken[]",
                    "name": "cTokens",
                    "type": "address[]"
                },
                {
                    "internalType": "bool",
                    "name": "borrowers",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "suppliers",
                    "type": "bool"
                }
            ],
            "name": "claimComp",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "holder",
                    "type": "address"
                }
            ],
            "name": "claimComp",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "closeFactorMantissa",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "compAccrued",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "compBorrowState",
            "outputs": [
                {
                    "internalType": "uint224",
                    "name": "index",
                    "type": "uint224"
                },
                {
                    "internalType": "uint32",
                    "name": "block",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "compBorrowerIndex",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "compContributorSpeeds",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "compInitialIndex",
            "outputs": [
                {
                    "internalType": "uint224",
                    "name": "",
                    "type": "uint224"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "compRate",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "compSpeeds",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "compSupplierIndex",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "compSupplyState",
            "outputs": [
                {
                    "internalType": "uint224",
                    "name": "index",
                    "type": "uint224"
                },
                {
                    "internalType": "uint32",
                    "name": "block",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "comptrollerImplementation",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "cTokens",
                    "type": "address[]"
                }
            ],
            "name": "enterMarkets",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cTokenAddress",
                    "type": "address"
                }
            ],
            "name": "exitMarket",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "getAccountLiquidity",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getAllMarkets",
            "outputs": [
                {
                    "internalType": "contract CToken[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "getAssetsIn",
            "outputs": [
                {
                    "internalType": "contract CToken[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getBlockNumber",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getCompAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "cTokenModify",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "redeemTokens",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "borrowAmount",
                    "type": "uint256"
                }
            ],
            "name": "getHypotheticalAccountLiquidity",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isComptroller",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "lastContributorBlock",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cTokenBorrowed",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "cTokenCollateral",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "liquidator",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "repayAmount",
                    "type": "uint256"
                }
            ],
            "name": "liquidateBorrowAllowed",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cTokenBorrowed",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "cTokenCollateral",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "liquidator",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "actualRepayAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "seizeTokens",
                    "type": "uint256"
                }
            ],
            "name": "liquidateBorrowVerify",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cTokenBorrowed",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "cTokenCollateral",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "actualRepayAmount",
                    "type": "uint256"
                }
            ],
            "name": "liquidateCalculateSeizeTokens",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "liquidationIncentiveMantissa",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "markets",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isListed",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "collateralFactorMantissa",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isComped",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "maxAssets",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "minter",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "mintAmount",
                    "type": "uint256"
                }
            ],
            "name": "mintAllowed",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "mintGuardianPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "minter",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "actualMintAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "mintTokens",
                    "type": "uint256"
                }
            ],
            "name": "mintVerify",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "oracle",
            "outputs": [
                {
                    "internalType": "contract PriceOracle",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "pauseGuardian",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "pendingAdmin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "pendingComptrollerImplementation",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "redeemer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "redeemTokens",
                    "type": "uint256"
                }
            ],
            "name": "redeemAllowed",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "redeemer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "redeemAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "redeemTokens",
                    "type": "uint256"
                }
            ],
            "name": "redeemVerify",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "payer",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "repayAmount",
                    "type": "uint256"
                }
            ],
            "name": "repayBorrowAllowed",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "payer",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "actualRepayAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "borrowerIndex",
                    "type": "uint256"
                }
            ],
            "name": "repayBorrowVerify",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cTokenCollateral",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "cTokenBorrowed",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "liquidator",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "seizeTokens",
                    "type": "uint256"
                }
            ],
            "name": "seizeAllowed",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "seizeGuardianPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cTokenCollateral",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "cTokenBorrowed",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "liquidator",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "seizeTokens",
                    "type": "uint256"
                }
            ],
            "name": "seizeVerify",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "src",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "dst",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "transferTokens",
                    "type": "uint256"
                }
            ],
            "name": "transferAllowed",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "transferGuardianPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "cToken",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "src",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "dst",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "transferTokens",
                    "type": "uint256"
                }
            ],
            "name": "transferVerify",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "contributor",
                    "type": "address"
                }
            ],
            "name": "updateContributorRewards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
}

// from https://github.com/compound-finance/compound-js/blob/master/src/constants.ts
module.exports = {
    lens: {
        addr: '0xA6c8D1c55951e8AC44a0EaA959Be5Fd21cc07531',
        abi: abi.CompoundLens
    },
    comptroller: {
        addr: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
        abi: abi.Comptroller
    }
}
