import BigNumber from 'bignumber.js';
// import { gql } from '@apollo/client';
// import client from './apollo';
import { aDAOBNBPairContract, busdBNBPairContract, wbnbContract } from '../aDAO/contracts';
import { getCirculatingSupply } from '../aDAO/token';
import { bnToDec, callMethod } from '../aDAO/utils';

// const GET_PAIR_PRICE = gql`
//   query GetExchangeRates {
//     pair(id: "${aDAOBNBPairContract.address}"){
//         token0Price
//         token1Price
//     }
//    }
// `;

const getaDAOPrice = async () => {
    let busdReserve = 0;
    let bnbReserve1 = 0;
    let dao888Reserve = 0;
    let bnbReserve2 = 0;
    let token0;

    token0 = await callMethod(busdBNBPairContract.contract.methods['token0'], []);
    if(token0 === wbnbContract.address) {
        let result = await callMethod(busdBNBPairContract.contract.methods['getReserves'], []);
        bnbReserve1 = bnToDec(new BigNumber(result._reserve0));
        busdReserve = bnToDec(new BigNumber(result._reserve1));
    } else {
        let result = await callMethod(busdBNBPairContract.contract.methods['getReserves'], []);
        busdReserve = bnToDec(new BigNumber(result._reserve0));
        bnbReserve1 = bnToDec(new BigNumber(result._reserve1));
    }

    token0 = await callMethod(aDAOBNBPairContract.contract.methods['token0'], []);
    if(token0 === wbnbContract.address) {
        let result = await callMethod(aDAOBNBPairContract.contract.methods['getReserves'], []);
        bnbReserve2 = bnToDec(new BigNumber(result._reserve0));
        dao888Reserve = bnToDec(new BigNumber(result._reserve1));
    } else {
        let result = await callMethod(aDAOBNBPairContract.contract.methods['getReserves'], []);
        dao888Reserve = bnToDec(new BigNumber(result._reserve0));
        bnbReserve2 = bnToDec(new BigNumber(result._reserve1));
    }

    if(bnbReserve1 <= 0 || dao888Reserve <= 0) return;

    // console.log('busdReserve :>> ', busdReserve);
    // console.log('bnbReserve1 :>> ', bnbReserve1);
    // console.log('bnbReserve2 :>> ', bnbReserve2);
    // console.log('dao888Reserve :>> ', dao888Reserve);
    
    const price = busdReserve * bnbReserve2 / bnbReserve1 / dao888Reserve;
    return price;
};

const getBNBPrice = async () => {
    let busdReserve = 0;
    let bnbReserve1 = 0;
    let token0;

    token0 = await callMethod(busdBNBPairContract.contract.methods['token0'], []);
    if(token0 === wbnbContract.address) {
        let result = await callMethod(busdBNBPairContract.contract.methods['getReserves'], []);
        bnbReserve1 = bnToDec(new BigNumber(result._reserve0));
        busdReserve = bnToDec(new BigNumber(result._reserve1));
    } else {
        let result = await callMethod(busdBNBPairContract.contract.methods['getReserves'], []);
        busdReserve = bnToDec(new BigNumber(result._reserve0));
        bnbReserve1 = bnToDec(new BigNumber(result._reserve1));
    }

    if(bnbReserve1 <= 0 || busdReserve <= 0) return;

    const price = busdReserve / bnbReserve1;
    return price;
};

const getMarketcap = async () => {
    const aDAOPrice = await getaDAOPrice();
    const curculatingSupply = bnToDec(await getCirculatingSupply());
    return (aDAOPrice * curculatingSupply);
};

export {
    getaDAOPrice,
    getBNBPrice,
    getMarketcap
}