import BigNumber from 'bignumber.js';
// import { gql } from '@apollo/client';
// import client from './apollo';
import { $888BNBPairContract, busdBNBPairContract } from '../$888/contracts';
import { getCirculatingSupply } from '../$888/token';
import { bnToDec, callMethod } from '../$888/utils';

// const GET_PAIR_PRICE = gql`
//   query GetExchangeRates {
//     pair(id: "${$888BNBPairContract.address}"){
//         token0Price
//         token1Price
//     }
//    }
// `;

const get$888Price = async () => {
    const result1 = await callMethod(busdBNBPairContract.contract.methods['getReserves'], []);
    const result2 = await callMethod($888BNBPairContract.contract.methods['getReserves'], []);
    const $888Balance = bnToDec(new BigNumber(result2._reserve0));
    const ethBalanceFor$888 = bnToDec(new BigNumber(result2._reserve1));
    const busdBalance = bnToDec(new BigNumber(result1._reserve0), 6);
    const ethBalanceForBusd = bnToDec(new BigNumber(result1._reserve1));

    const price = busdBalance / ethBalanceForBusd * ethBalanceFor$888 / $888Balance;
    return price;
};

const getBNBPrice = async () => {
    const result1 = await callMethod(busdBNBPairContract.contract.methods['getReserves'], []);
    const busdBalance = bnToDec(new BigNumber(result1._reserve0), 6);
    const ethBalance = bnToDec(new BigNumber(result1._reserve1));
    const price = busdBalance / ethBalance;

    return price;
};

const getMarketcap = async () => {
    const $888Price = await get$888Price();
    const curculatingSupply = bnToDec(await getCirculatingSupply());
    return ($888Price * curculatingSupply);
};

export {
    get$888Price,
    getBNBPrice,
    getMarketcap
}