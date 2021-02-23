import BigNumber from 'bignumber.js';
import { aDAOContract, vaultContract } from './contracts';
import { callMethod, bnDivdedByDecimals } from './utils';
import { getPairBalances, getLPTotalSupply } from './pancakev2pair.js';
import { getTotalStakedAmount } from './vault';

// Getters
export const checkAllowance = async (owner, spender) => {
  const result = await callMethod(aDAOContract.contract.methods['allowance'], [owner, spender]);
  return bnDivdedByDecimals(new BigNumber(result));
}

export const getBalance = async (address) => {
  const result = await callMethod(aDAOContract.contract.methods['balanceOf'], [address]);
  return new BigNumber(result);
}

export const getTransferFee = async () => {
  const result = await callMethod(aDAOContract.contract.methods['transferFee'], []);
  return result;
}

export const getVaultAddress = async () => {
  const result = await callMethod(aDAOContract.contract.methods['aDAOVault'], []);
  return result;
}

export const getPaused = async () => {
  const result = await callMethod(aDAOContract.contract.methods['Paused'], []);
  return result;
}

export const getTokenGovernance = async () => {
  const result = await callMethod(aDAOContract.contract.methods['governance'], []);
  return result;
}

export const getTotalSupply  = async () => {
  return  new BigNumber(await callMethod(aDAOContract.contract.methods['totalSupply'], []));
}

export const getCirculatingSupply  = async () => {
  const result = new BigNumber(await callMethod(aDAOContract.contract.methods['totalSupply'], []));
  const pairTokenBalances = await getPairBalances();
  const LPTotalSupply = await getLPTotalSupply();
  const totalStakedAmount =  await getTotalStakedAmount();
  const aDAOAmountInVault = new BigNumber(await callMethod(aDAOContract.contract.methods['balanceOf'], [vaultContract.address]));
  
  if (LPTotalSupply.eq(new BigNumber(0))) {
    return result;
  }

  const lockedaDAO = pairTokenBalances['aDAO'].times(totalStakedAmount.div(LPTotalSupply));
  return result.minus(lockedaDAO).minus(aDAOAmountInVault);
}

export const Approve  = async (spender, amount) => {
  const result = await callMethod(aDAOContract.contract.methods['approve'], [spender, amount]);
  return result;
}


