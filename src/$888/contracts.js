/* eslint-disable quote-props */
/* eslint-disable max-len */
import { web3 } from './web3';
import config from '../config';

import $888ContractAbi from './abis/$888Contract.json';
import vaultContractAbi from './abis/vaultContract.json';
import pancakeV2PairContractAbi from './abis/$888BNBPairContract.json';
import wbnbContractAbi from './abis/wbnbContract.json';
import btcbContractAbi from './abis/btcbContract.json';
import bifiContractAbi from './abis/bifiContract.json';

const networkId = config.networkId;
console.log('networkId >>> ', networkId);

const $888ContractAddress = config.contractAddress.$888[networkId];
const I$888Contract = new web3.eth.Contract($888ContractAbi, $888ContractAddress);
console.log('$888ContractAddress >>>', $888ContractAddress);
console.log('I$888Contract >>> ', I$888Contract);

const vaultContractAddress = config.contractAddress.vault[networkId];
const IVaultContract = new web3.eth.Contract(
  vaultContractAbi,
  vaultContractAddress
);
console.log('vaultContractAddress >>>', vaultContractAddress);
console.log('IVaultContract >>>', IVaultContract);

const $888BNBPairContractAddress = config.contractAddress.$888BNBPair[networkId];
const I$888BNBPairContract = new web3.eth.Contract(
  pancakeV2PairContractAbi,
  $888BNBPairContractAddress
);
console.log('888BNBPairContractAddress >>>', $888BNBPairContractAddress);
console.log('I$888BNBPairContract >>>', I$888BNBPairContract);

const bifiBNBPairContractAddress = config.contractAddress.bifiBNBPair[networkId];
const IbifiBNBPairContract = new web3.eth.Contract(
  pancakeV2PairContractAbi,
  bifiBNBPairContractAddress
);
console.log('bifiBNBPairContractAddress >>>', bifiBNBPairContractAddress);
console.log('IbifiBNBPairContract >>>', IbifiBNBPairContract);

const btcbBNBPairContractAddress =
  config.contractAddress.btcbBNBPair[networkId];
const IbtcbBNBPairContract = new web3.eth.Contract(
  pancakeV2PairContractAbi,
  btcbBNBPairContractAddress
);
console.log('btcbBNBPairContractAddress >>>', btcbBNBPairContractAddress);
console.log('IbtcbBNBPairContract >>>', IbtcbBNBPairContract);

const wbnbContractAddress = config.contractAddress.wbnb[networkId];
const IWbnbContract = new web3.eth.Contract(
  wbnbContractAbi,
  wbnbContractAddress
);
console.log('wbnbContractAddress >>>', wbnbContractAddress);
console.log('IWbnbContract >>>', IWbnbContract);

const btcbContractAddress = config.contractAddress.btcb[networkId];
const IbtcbContract = new web3.eth.Contract(
  btcbContractAbi,
  btcbContractAddress
);
console.log('btcbContractAddress >>>', btcbContractAddress);
console.log('IbtcbContract >>>', IbtcbContract);

const bifiContractAddress = config.contractAddress.bifi[networkId];
const IbifiContract = new web3.eth.Contract(bifiContractAbi, bifiContractAddress);
console.log('bifiContractAddress >>>', bifiContractAddress);
console.log('IbifiContract >>>', IbifiContract);

const busdBNBPairContractAddress =
  config.contractAddress.busdBNBPair[networkId];
const IbusdBNBPairContract = new web3.eth.Contract(
  pancakeV2PairContractAbi,
  busdBNBPairContractAddress
);
console.log('busdBNBPairContractAddress >>>', busdBNBPairContractAddress);
console.log('IbusdBNBPairContract >>>', IbusdBNBPairContract);

const $888Contract = {
  address: $888ContractAddress,
  abi: $888ContractAbi,
  contract: I$888Contract,
  decimals: 18,
};

const vaultContract = {
  address: vaultContractAddress,
  abi: vaultContractAbi,
  contract: IVaultContract,
};

const $888BNBPairContract = {
  address: $888BNBPairContractAddress,
  abi: pancakeV2PairContractAbi,
  contract: I$888BNBPairContract,
  decimals: 18,
};

const bifiBNBPairContract = {
  address: bifiBNBPairContractAddress,
  abi: pancakeV2PairContractAbi,
  contract: IbifiBNBPairContract,
  decimals: 18,
};

const btcbBNBPairContract = {
  address: btcbBNBPairContractAddress,
  abi: pancakeV2PairContractAbi,
  contract: IbtcbBNBPairContract,
  decimals: 18,
};

const wbnbContract = {
  address: wbnbContractAddress,
  abi: wbnbContractAbi,
  contract: IWbnbContract,
  decimals: 18,
};

const btcbContract = {
  address: btcbContractAddress,
  abi: bifiContractAbi,
  contract: IbtcbContract,
  decimals: 8,
};

const bifiContract = {
  address: bifiContractAddress,
  abi: btcbContractAbi,
  contract: IbifiContract,
  decimals: 18,
};

const busdBNBPairContract = {
  address: busdBNBPairContractAddress,
  abi: pancakeV2PairContractAbi,
  contract: IbusdBNBPairContract,
  decimals: 18,
};

export {
  networkId,
  $888Contract,
  vaultContract,
  $888BNBPairContract,
  bifiBNBPairContract,
  btcbBNBPairContract,
  wbnbContract,
  btcbContract,
  bifiContract,
  busdBNBPairContract,
};
