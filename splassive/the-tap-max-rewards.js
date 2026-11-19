const BN = require('bignumber.js');
const ABIs = require('./abis.json');

const THETAP_ADDRESS = '0xd17a5D992567E2Fc2a3FE1c8BC58bF63D24E55E1';

class maxTapRewards {
  static displayName = 'The Tap Max Rewards';
  static description = 'Get notified when you reach the max rewards in The Tap';

  async onInit(args) {
    this.theTapContract = new args.web3.eth.Contract(
      ABIs.theTap,
      THETAP_ADDRESS
    );
  }

  async onSubscribeForm(args) {
    return [
      {
        id: 'allow-subscribe',
        label: 'This input makes sure the Subscribe button will be shown',
        type: 'hidden',
        value: true,
      },
    ];
  }
  async onBlocks(args) {
    const lastCheckin = (
      await this.theTapContract.methods.custody(args.address).call()
    ).last_checkin;
    if (Date.now() > lastCheckin * 1000 + 86400 * 1000 * 2) {
      const uniqueId = lastCheckin * 1000 + 86400 * 1000 * 2;

      return {
        uniqueId: uniqueId,
        notification:
          'You have reached your max rewards ! Compound or claim to keep Splashing !',
        link: 'https://splassive.com/thetap',
      };
    }

    return [];
  }
}

module.exports = maxTapRewards;
