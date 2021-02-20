import BigNumber from 'bignumber.js';
import { $888BNBPairContract, wbnbContract } from './contracts';
import { callMethod, bnToDec } from './utils';
import { get$888Price, getBNBPrice } from '../subgraphs/api';

// Getters
export const getLPBalance = async (address) => {
  try {
    const result = await callMethod($888BNBPairContract.contract.methods['balanceOf'], [address]);
    return new BigNumber(result);
  } catch {
    return new BigNumber(0);
  }
}

export const getLPTotalSupply = async () => {
  try {
    const result = await callMethod($888BNBPairContract.contract.methods['totalSupply'], []);
    return new BigNumber(result);
  } catch (e) {
    // console.log('error :>> ', e.message);
    return new BigNumber(0);
  }
}

export const getPairBalances = async () => {
  try {
    const result = await callMethod($888BNBPairContract.contract.methods['getReserves'], []);
    const $888Balance = new BigNumber(result._reserve0);
    const ethBalance = new BigNumber(result._reserve1);
    return {'$888': $888Balance, 'eth': ethBalance};

  } catch (e) {
    // console.log('error :>> ', e.message);
    return {'$888': new BigNumber(0), 'eth': new BigNumber(0)};
  }
}

export const getAmountOut = async (pairContractObj, amountIn, isEthOut, decimals = 18) => {
  const result = await callMethod(pairContractObj.contract.methods['getReserves'], []);
  const token0 = await callMethod(pairContractObj.contract.methods['token0'], []);
  
  let tokenBalance = 0;
  let ethBalance = 0;

  if (token0.toLowerCase() === wbnbContract.address.toLowerCase()) {
    tokenBalance = bnToDec(new BigNumber(result._reserve1), decimals);
    ethBalance = bnToDec(new BigNumber(result._reserve0));
  } else {
    tokenBalance = bnToDec(new BigNumber(result._reserve0), decimals);
    ethBalance = bnToDec(new BigNumber(result._reserve1));
  }
  if (isEthOut) {
    return ethBalance * amountIn / tokenBalance;
  } else {
    return tokenBalance * amountIn / ethBalance;
  }
}

export const getLPTVL = async () => {
  try {
    const result = await callMethod($888BNBPairContract.contract.methods['getReserves'], []);
    const $888Balance = bnToDec(new BigNumber(result._reserve0));
    const ethBalance = bnToDec(new BigNumber(result._reserve1));
    const $888Price = await get$888Price();
    const ethPrice = await getBNBPrice();
    return $888Balance * $888Price + ethBalance * ethPrice;
  } catch {
    return 0;
  }
}
