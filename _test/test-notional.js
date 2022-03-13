const SECONDS_IN_HOUR = 60 * 60;
const HOURS_IN_MONTH = 24 * 30;

const TEST_BLOCK_NUMBER = 14282553; // 2022-02-26
const TEST_DATE = new Date(2022, 02, 25);
const TEST_UNIX_TIMESTAMP = Math.floor(TEST_DATE.getTime() / 1000);

/**
 * At block number 1428255, this account contains 
 * -2.6M USDC (Mar 28 2022)
 * -30 WBTC (Mar 28 2022)
 */
const ACCOUNT_WITH_DEBT = '0x0ac0eff6eb2c39a1f7474d4cc7fbc00615c151ba';

/**
 * Timestamp after Mar 28 2022
 */
const PAST_NEXT_MATURITY_UNIX_TIMESTAMP =
  TEST_UNIX_TIMESTAMP + SECONDS_IN_HOUR * HOURS_IN_MONTH * 2;

/**
 * Timestamp before Mar 28 2022
 */
const BEFORE_NEXT_MATURITY_UNIX_TIMESTAMP = TEST_UNIX_TIMESTAMP;

async function testDebtSettlement_withSettlableDebt_shouldBuildNotificationWithPositions() {
  const DebtSettlement = require('../notional/debt-settlement');
  const debtSettlement = new DebtSettlement();

  console.log(
    '\n\n########  testDebtSettlement_withSettlableDebt_shouldBuildNotificationWithPositions #######'
  );
  const debtPositions =
    await debtSettlement.getAccountSettlableDebtFromSubgraph(
      ACCOUNT_WITH_DEBT,
      PAST_NEXT_MATURITY_UNIX_TIMESTAMP,
      TEST_BLOCK_NUMBER
    );
  console.log('Account info:\n', ACCOUNT_WITH_DEBT, '\n');
  console.log('Account settlable positions:\n', JSON.stringify(debtPositions), '\n');

  const notification = debtSettlement.buildNotification(debtPositions);
  console.log('Notifications:\n', JSON.stringify(notification), '\n');

  const expectedPositions = [
    '-2.6M USDC (Mar 28 2022)',
    '-30 WBTC (Mar 28 2022)',
  ];
  for (const position of expectedPositions) {
    console.assert(notification.notification.includes(position));
  }
}

async function testDebtSettlement_withSettlableDebt_shouldNotNotifyAgainForSamePositions() {
  const DebtSettlement = require('../notional/debt-settlement');
  const debtSettlement = new DebtSettlement();

  console.log(
    '\n\n########  testDebtSettlement_withSettlableDebt_shouldBuildNotificationWithPositions #######'
  );
  const debtPositions =
    await debtSettlement.getAccountSettlableDebtFromSubgraph(
      ACCOUNT_WITH_DEBT,
      PAST_NEXT_MATURITY_UNIX_TIMESTAMP,
      TEST_BLOCK_NUMBER
    );
  console.log('Account info:\n', ACCOUNT_WITH_DEBT, '\n');
  console.log(
    'Account settlable positions:\n',
    JSON.stringify(debtPositions),
    '\n'
  );

  const notification = debtSettlement.buildNotification(debtPositions);
  console.log('Notifications:\n', JSON.stringify(notification), '\n');

  const assetId1 =
    '0x0ac0eff6eb2c39a1f7474d4cc7fbc00615c151ba:3:fCash:1648512000';
  const assetId2 =
    '0x0ac0eff6eb2c39a1f7474d4cc7fbc00615c151ba:4:fCash:1648512000';
  console.assert(notification.uniqueId.includes(assetId1));
  console.assert(notification.uniqueId.includes(assetId2));
}

async function testDebtSettlement_withNoSettlableDebt_shouldDoNothing() {
  const DebtSettlement = require('../notional/debt-settlement');
  const debtSettlement = new DebtSettlement();

  console.log(
    '\n\n########  testDebtSettlement_withNoSettlableDebt_shouldDoNothing #######'
  );
  const debtPositions =
    await debtSettlement.getAccountSettlableDebtFromSubgraph(
      ACCOUNT_WITH_DEBT,
      BEFORE_NEXT_MATURITY_UNIX_TIMESTAMP,
      TEST_BLOCK_NUMBER
    );
  console.log('Account info:\n', ACCOUNT_WITH_DEBT, '\n');
  console.log(
    'Account settlable positions:\n',
    JSON.stringify(debtPositions),
    '\n'
  );

  const notification = debtSettlement.buildNotification(debtPositions);
  console.log('Notifications:\n', JSON.stringify(notification), '\n');

  console.assert(notification instanceof Array);
  console.assert(notification.length === 0);
}

async function testFreeCollateral_withFreeCollateralAboveThreshold_shouldNotNotify() {
  const FreeCollateral = require('../notional/free-collateral');
  const freeCollateral = new FreeCollateral();


  console.log(
    '\n\n########  testFreeCollateral_withSufficientFreeCollateral_shouldNotNotify #######'
  );

  // Mock out account free collateral fetching and calculation.
  freeCollateral.getFreeCollateral = (accountId) => {
    return {
      debt: 100,
      collateral: 1000,
      freeCollateral: 900,
    };
  };

  const notification = await freeCollateral.onBlocks({subscription: {
    'free-collateral': 500,
    'address': '0x00000',
  }});
  console.log('Notifications:\n', JSON.stringify(notification), '\n');

  console.assert(notification instanceof Array);
  console.assert(notification.length === 0);
}

async function main() {
  console.log("%%% test debt settlement %%%");
  await testDebtSettlement_withSettlableDebt_shouldBuildNotificationWithPositions();
  await testDebtSettlement_withSettlableDebt_shouldNotNotifyAgainForSamePositions();
  await testDebtSettlement_withNoSettlableDebt_shouldDoNothing();
}

main();
