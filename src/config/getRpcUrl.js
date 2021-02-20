import random from 'lodash/random';

// Array of available nodes to connect to
// const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
const testNodes = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/', 
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/',
];

const mainNode = [
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed1.ninicoin.io/',
  'https://bsc-dataseed2.defibit.io/',
  'https://bsc-dataseed3.defibit.io/',
];

const getRpcUrl = (chainId) => {
  if(chainId === '65') {
    const randomIndex = random(0, mainNode.length - 1);
    return mainNode[randomIndex];
  } else {
    const randomIndex = random(0, testNodes.length - 1);
    return testNodes[randomIndex];
  }
}

export default getRpcUrl;