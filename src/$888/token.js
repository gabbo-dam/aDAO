import BigNumber from 'bignumber.js';
import { $888Contract, vaultContract } from './contracts';
import { callMethod, bnDivdedByDecimals } from './utils';
import { getPairBalances, getLPTotalSupply } from './pancakev2pair.js';
import { getTotalStakedAmount } from './vault';

// Getters
export const checkAllowance = async (owner, spender) => {
  const result = await callMethod($888Contract.contract.methods['allowance'], [owner, spender]);
  return bnDivdedByDecimals(new BigNumber(result));
}

export const getBalance = async (address) => {
  const result = await callMethod($888Contract.contract.methods['balanceOf'], [address]);
  return new BigNumber(result);
}

export const getTransferFee = async () => {
  const result = await callMethod($888Contract.contract.methods['transferFee'], []);
  return result;
}

export const getVaultAddress = async () => {
  const result = await callMethod($888Contract.contract.methods['$888Vault'], []);
  return result;
}

export const getPaused = async () => {
  const result = await callMethod($888Contract.contract.methods['Paused'], []);
  return result;
}

export const getTokenGovernance = async () => {
  const result = await callMethod($888Contract.contract.methods['governance'], []);
  return result;
}

export const getTotalSupply  = async () => {
  return  new BigNumber(await callMethod($888Contract.contract.methods['totalSupply'], []));
}

export const getCirculatingSupply  = async () => {
  const result = new BigNumber(await callMethod($888Contract.contract.methods['totalSupply'], []));
  const pairTokenBalances = await getPairBalances();
  const LPTotalSupply = await getLPTotalSupply();
  const totalStakedAmount =  await getTotalStakedAmount();
  const $888AmountInVault = new BigNumber(await callMethod($888Contract.contract.methods['balanceOf'], [vaultContract.address]));
  
  if (LPTotalSupply.eq(new BigNumber(0))) {
    return result;
  }

  const locked$888 = pairTokenBalances['$888'].times(totalStakedAmount.div(LPTotalSupply));
  return result.minus(locked$888).minus($888AmountInVault);
}

export const Approve  = async (spender, amount) => {
  const result = await callMethod($888Contract.contract.methods['approve'], [spender, amount]);
  return result;
}


