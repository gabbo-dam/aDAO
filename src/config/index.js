const { default: getRpcUrl } = require('./getRpcUrl');
require('dotenv').config();

// const web3Provider =
//   process.env.REACT_APP_NETWORK_ID === '56'
//     ? process.env.REACT_APP_MAIN_WEB3_PROVIDER
//     : process.env.REACT_APP_TEST_WEB3_PROVIDER;

const web3Provider = getRpcUrl('56');
const config = {
  web3Provider: web3Provider,
  networkId: '56', //   process.env.REACT_APP_NETWORK_ID
  contractAddress: {
    aDAO: {
      56: '0xBFb2857474A48b345dD1c2F67ba57C28caa630fA',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    vault: {
      56: '0x56589dCFd44273FaCfFaf55C113B21FD2169C22e',
      97: '0x6bC9271B45926317B4c07D0fFE1631dd811C16f3',
    },
    wbnb: {
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    btcb: {
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    bifi: {
      56: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    busd: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    aDAOBNBPair: {
      56: '0x16B2E4B83Cca634beB3902e592B0af71022d3C0f',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    btcbBNBPair: {
      56: '0x7561EEe90e24F3b348E1087A005F78B4c8453524',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    bifiBNBPair: {
      56: '0xd132d2c24f29ee8abb64a66559d1b7aa627bd7fd',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    busdBNBPair: {
      56: '0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
    pancakev2router: {
      56: '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F',
      97: '0xB5526B53050282474B3dEB5Aca92519bB7A60A33',
    },
  },
};

module.exports = config;
