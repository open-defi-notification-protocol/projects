const fetch = require('node-fetch');
const BN = require('bignumber.js');

const SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/notional-finance/mainnet-v2';

const SECONDS_IN_HOUR = 60 * 60;
const NOTIONAL_BALANCE_PRECISION = 1e8;

/**
 * Partial typing of "Currency" Notional V2 subgraph entity
 * @typedef Currency
 * @property {string} underlyingSymbol
 */

/**
 * Partial typing of "Asset" Notional V2 subgraph entity
 * @typedef Asset
 * @property {string} id
 * @property {string} maturity
 * @property {string} notional
 * @property {Currency} currency
 */

/**
 * Partial typing of "Account" Notional V2 subgraph entity
 * @typedef Account
 * @property {Asset[]} portfolio
 */

const amountFormatter = Intl.NumberFormat('en', { notation: 'compact' });

/**
 * Get notified when any of your debt position on Notional V2 is about to be settled.
 * https://docs.notional.finance/notional-v2/risk-and-collateralization/settlement
 */
class DebtSettlement {
  static displayName = 'Debt Settlement';
  static description =
    'Get notified when any of your debt position is about to be settled.';

  /**
   * Runs when class is initialized
   *
   * @param args
   * @returns {Promise<void>}
   */
  async onInit(args) {}

  /**
   * Runs right before user subscribes to new notifications and populates subscription form
   *
   * @param args
   * @returns {Promise<[{values: *[], id: string, label: string, type: string}, {default: number, description: string, id: string, label: string, type: string}]>}
   */
  async onSubscribeForm(args) {
    return [
      {
        type: 'input-number',
        id: 'time-buffer',
        label: 'Notification Time',
        default: 48,
        description: 'Notify me X hours before debt maturity date.',
      },
    ];
  }

  /**
   * Get debt positions for given account.
   * @param {string} address
   * @param {number} maxMaturity
   * @param {number|undefined} blockNumber
   * @returns {DebtPosition[]}
   */
  async getAccountSettlableDebtFromSubgraph(
    address,
    maxMaturity,
    blockNumber = undefined
  ) {
    const blockNumberStatement = blockNumber
      ? `, block: {number: ${blockNumber}}`
      : '';

    const query = `
      {
          account(id: "${address.toLowerCase()}"${blockNumberStatement}) {
              portfolio(where: {notional_lt: 0, assetType: fCash, maturity_lt: ${maxMaturity}}) {
                  id
                  currency {
                      underlyingSymbol
                  }
                  notional
                  maturity
              }
          }
      }`;
    const jsonEncodedResponse = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const response = await jsonEncodedResponse.json();

    if (!!response.data?.account?.portfolio) {
      /** @type {Account} */
      const account = response.data.account;

      return account.portfolio;
    }
    return [];
  }

  /**
   * Builds a notification message letting the user know that their account has debt that will mature soon.
   *
   * @param {Asset[]} debtPositions
   * @param {number} timeBufferHours
   * @returns {}
   */
  buildNotification(debtPositions, timeBufferHours) {
    if (debtPositions.length === 0) {
      return [];
    }
    const formattedPositions = [];
    const idParts = [];
    for (const debtPosition of debtPositions) {
      const {
        id,
        currency: { underlyingSymbol },
      } = debtPosition;
      idParts.push(id);

      const balance = new BN(debtPosition.notional).div(NOTIONAL_BALANCE_PRECISION);
      const formattedBalance = amountFormatter.format(balance.toString());

      const maturity = new Date(Number(debtPosition.maturity) * 1000);
      const formattedMaturityMonth = maturity.toLocaleString('en-us', {month: 'short'});
      const formattedMaturity = `${formattedMaturityMonth} ${maturity.getDate()} ${maturity.getFullYear()}`;

      formattedPositions.push(
        `${formattedBalance} ${underlyingSymbol} (${formattedMaturity})`
      );
    }
    return {
      uniqueId: idParts.join(''),
      notification: `Your account has debt that will mature in ${timeBufferHours} hours. Close these positions to avoid penalty: ${formattedPositions.join(
        ' | '
      )}`,
    };
  }

  /**
   * Runs when new blocks are added to the mainnet chain - notification scanning happens here
   *
   * @param args
   * @returns {Promise<*[]|{notification: string, uniqueId: string}>}
   */
  async onBlocks(args) {
    if (!args.subscription) {
      return;
    }

    const nowUnixTimestamp = Math.floor(Date.now() / 1000);

    const timeBufferHours = parseFloat(args.subscription['time-buffer']);

    // Verify whether debt expires after given time.
    const maturityThreshold =
      nowUnixTimestamp + timeBufferHours * SECONDS_IN_HOUR;

    const debtPositions = await this.getAccountSettlableDebtFromSubgraph(
      args.address,
      maturityThreshold
    );

    return this.buildNotification(debtPositions);
  }
};

module.exports = DebtSettlement;
