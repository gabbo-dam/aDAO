import BigNumber from 'bignumber.js';
import { vaultContract } from './contracts';
import { callMethod, bnDivdedByDecimals, secondToDate, bnToDec } from './utils';
import { getLPBalance, getLPTotalSupply, getLPTVL } from './pancakev2pair';
import { getaDAOPrice } from '../subgraphs/api';

import { web3 } from './web3';

// Getters
export const getRewardPeriod = async () => {
    const result = await callMethod(vaultContract.contract.methods['_rewardPeriod'], []);
    return new BigNumber(result);
}

export const getContractStartTime = async () => {
    const result = await callMethod(vaultContract.contract.methods['_contractStartTime'], []);
    return new BigNumber(result);
}

export const getSwapReward = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['getSwapReward'], [address]);
    return { pending: new BigNumber(result.pending), available: new BigNumber(result.available) };
}

export const getaDAOReward = async (address) => {
    console.log(vaultContract)
    const result = await callMethod(vaultContract.contract.methods['get888Reward'], [address]);
    return { pending: new BigNumber(result.pending), available: new BigNumber(result.available) };
}

export const getTotalStakedAmount = async () => {
    try {
        const result = await callMethod(vaultContract.contract.methods['getTotalStakedAmount'], []);
        return new BigNumber(result);
    } catch {
        return new BigNumber(0);
    }
}

export const getMinimumDepositAmount = async () => {
    const result = await callMethod(vaultContract.contract.methods['_minDepositETHAmount'], []);
    return new BigNumber(result);
}

export const getUserTotalStakedAmount = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
    return bnDivdedByDecimals(new BigNumber(result.stakedAmount));
}

export const getStakedUserInfo = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
    const lockedTo = result.lockedTo;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const isLocked = currentTimestamp < lockedTo;
    let endOfLock = 0;

    if (isLocked) {
        const dateObject = new Date(lockedTo * 1000);
        endOfLock = dateObject.toLocaleString();
    }

    return { ...result, isLocked: isLocked, endOfLock: endOfLock, stakedAmount: new BigNumber(result.stakedAmount) };
}

export const getRestTimeForaDAORewards = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
    console.log(result)
    const blockCountFor2weeks = new BigNumber(await callMethod(vaultContract.contract.methods['_claimPeriodFor888Reward'], []));
    console.log(blockCountFor2weeks)
    const currentBlockNumber = new BigNumber(await web3.eth.getBlockNumber());
    console.log(currentBlockNumber)
    const restTime = new BigNumber(13.3).times(blockCountFor2weeks.minus(currentBlockNumber.minus(result.lastClimedBlockForaDAOReward)));
    console.log(restTime)
    return secondToDate(restTime.toNumber());
}

export const getRestTimeForSwapRewards = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
    const blockCountFor3months = new BigNumber(await callMethod(vaultContract.contract.methods['_claimPeriodForSwapReward'], []));
    const currentBlockNumber = new BigNumber(await web3.eth.getBlockNumber());
    const restTime = new BigNumber(13.3).times(blockCountFor3months.minus(currentBlockNumber.minus(result.lastClimedBlockForSwapReward)));
    return secondToDate(restTime.toNumber());
}

export const getIsEnalbledLock = async () => {
    const result = await callMethod(vaultContract.contract.methods['_enabledLock'], []);
    return result;
}

export const getBurnFee = async () => {
    const result = await callMethod(vaultContract.contract.methods['_burnFee'], []);
    return new BigNumber(result).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}

export const getEarlyUnstakeFee = async () => {
    const result = await callMethod(vaultContract.contract.methods['_earlyUnstakeFee'], []);
    return new BigNumber(result).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}

export const getLockPeriod = async () => {
    const result = await callMethod(vaultContract.contract.methods['_lockPeriod'], []);
    return new BigNumber(result);
}

export const getVaultGovernance = async () => {
    const result = await callMethod(vaultContract.contract.methods['governance'], []);
    return result;
}

export const getAllocPointForWBNB = async () => {
    const result = await callMethod(vaultContract.contract.methods['_allocPointForWBNB'], []);
    return new BigNumber(result).div(new BigNumber(10000));
}

export const getAllocPointForBTCB = async () => {
    const result = await callMethod(vaultContract.contract.methods['_allocPointForBTCB'], []);
    return new BigNumber(result).div(new BigNumber(10000));
}

export const getAllocPointForBIFI = async () => {
    const result = await callMethod(vaultContract.contract.methods['_allocPointForBIFI'], []);
    return new BigNumber(result).div(new BigNumber(10000));
}

export const getTVL = async () => {
    try {
        const stakedLpAmount = await getLPBalance(vaultContract.address);
        const LPTotalSupply = await getLPTotalSupply();

        if (LPTotalSupply.eq(new BigNumber(0))) {
            return new BigNumber(0);
        }
        const LPTVL = await getLPTVL();
        return new BigNumber(LPTVL * bnToDec(stakedLpAmount) / bnToDec(LPTotalSupply));
    } catch {
        return new BigNumber(0);
    }
}

export const getWinners = async () => {
    return await callMethod(vaultContract.contract.methods['getWinners'], []);
}

export const getCollectedLotteryAmount = async () => {
    const result = await callMethod(vaultContract.contract.methods['_collectedAmountForLottery'], []);
    return new BigNumber(result / 10);
}

export const getWinnersInfo = async () => {
    const winners = await callMethod(vaultContract.contract.methods['getWinners'], []);
    let winnersInfo = [];
    for (let i = 0; i < winners; i++) {
        const winner = await callMethod(vaultContract.contract.methods['winnerInfo'], [i]);
        if (winner !== '' && winner != null) {
            const dateObject = new Date(winner.timestamp * 1000);
            winnersInfo.push({
                address: winner.winner,
                amount: new BigNumber(winner.amount),
                timestamp: dateObject.toLocaleString()
            });
        }
    }
    return winnersInfo;
}

export const getLotteryFee = async () => {
    const fee = new BigNumber(await callMethod(vaultContract.contract.methods['_lotteryFee'], []));
    return new BigNumber(fee).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}

export const getLotteryLimit = async () => {
    const limit = new BigNumber(await callMethod(vaultContract.contract.methods['_lotteryLimit'], []));
    return new BigNumber(limit).div(new BigNumber(10).pow(6)).toString(10);
}

export const getLotteryTotalPaidOut = async () => {
    return new BigNumber(await callMethod(vaultContract.contract.methods['_lotteryPaidOut'], []));
}

export const getAPY = async () => {
    const stakedLpAmount = await getLPBalance(vaultContract.address);
    const LPTotalSupply = await getLPTotalSupply();
    const LPTVL = await getLPTVL();
    const aDAOPrice = await getaDAOPrice();

    if (LPTotalSupply.eq(new BigNumber(0))) {
        return 0;
    }
    const poolTvl = new BigNumber(LPTVL * (stakedLpAmount.div(LPTotalSupply).toNumber()));

    if (poolTvl.eq(new BigNumber(0))) {
        return 0;
    }

    const aDAOPerBlock = new BigNumber(await callMethod(vaultContract.contract.methods['get888PerBlockFor888Reward'],[]));
    const blockCountForYear = new BigNumber(2372500);
    
    return (1 + bnToDec(aDAOPerBlock.times(blockCountForYear).div(poolTvl)) * aDAOPrice) * 100;
}
