const fetch = require("node-fetch");


class AccountHealth {

    static displayName = "Borrow Limit - Account Health";
    static description = "Get notified when the account under-collateralized borrowing relative to collateral ($) surpass borrow limit threshold (low health factor)";

    DEFAULT_BORROW_LIMIT = 66.7;
    BORROW_LIMIT_ACT_NOW_THRESHOLD = 95;


    // runs when class is initialized
    async onInit(args) {
    }


    // runs right before user subscribes to new notifications and populates subscription form
    async onSubscribeForm(args) {

        const accountInfo = await this.fetchAccountLendingInfo(args.address);

        if (accountInfo) {
            const currentBorrowLimit = this.calcBorrowLimit(accountInfo.health);
            let description = "Notify me when borrow limit exceeds this value.";
            if (currentBorrowLimit > this.BORROW_LIMIT_ACT_NOW_THRESHOLD) {
                description = "CAUTION: you are currently in risk of liquidation! ";
            }
            description += `Current Borrow Limit (~${currentBorrowLimit ? currentBorrowLimit.toFixed(2) : 0}%)`;
            const defaultLimit = Math.min(1.05 * Math.max(currentBorrowLimit, this.DEFAULT_BORROW_LIMIT),
                this.BORROW_LIMIT_ACT_NOW_THRESHOLD).toFixed(1);

            return [
                {
                    type: "input-number",
                    id: "borrow-limit",
                    label: "Borrow Limit",
                    default: defaultLimit,
                    description: description
                }
            ];

        } else {
            return [];
        }

    }

    // runs when endpoint's chain is extended - notification scanning happens here
    async onBlocks(args) {

        const accountInfo = await this.fetchAccountLendingInfo(args.address);

        if (!args.subscription) {
            return;
        }

        if (accountInfo) {

            const currentBorrowLimit = this.calcBorrowLimit(accountInfo.health);

            const borrowLimit = parseFloat(args.subscription["borrow-limit"]);

            if (currentBorrowLimit > borrowLimit) {

                const uniqueId = borrowLimit.toString();

                let notification;

                if (currentBorrowLimit > this.BORROW_LIMIT_ACT_NOW_THRESHOLD) {

                    notification = `Act now! You are under-collateralized and about to be liquidated. Current Borrow Limit (~${currentBorrowLimit.toFixed(2)}%).`

                } else {

                    notification = `Your Borrow Limit (~${currentBorrowLimit.toFixed(2)}%) surpassed the safety threshold (${borrowLimit.toFixed(2)}%).`;

                }

                return {
                    uniqueId: uniqueId,
                    notification: notification,
                };
            }
        }
        return [];
    }

    async fetchAccountLendingInfo(address) {

        const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending";

        const query = `
            {
                accounts(where: { id:"${address}"}) {
                  id
                  countLiquidated
                  countLiquidator
                  hasBorrowed
                  health
                  totalBorrowValueInUSD
                  totalCollateralValueInUSD
                }
         
            }
        `;

        const response = await fetch(SUBGRAPH_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query})
        });
        const accountInfo = (await response.json()).data.accounts[0];
        // console.log("Account info:\n", accountInfo);
        return accountInfo;
    }

    calcBorrowLimit(health) {
        let borrowLimit = 0;
        if (health > 0.001) {
            borrowLimit = (1 / health) * 100;
        }
        return borrowLimit;
    }

}


module.exports = AccountHealth
