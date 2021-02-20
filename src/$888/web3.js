import Web3 from 'web3';
import config from '../config';

let providerUrl = config.web3Provider;
console.log(providerUrl);
providerUrl = new Web3.providers.HttpProvider(config.web3Provider, { timeout: 10000 })
console.log(providerUrl);
const web3 = new Web3(window.ethereum || providerUrl);
console.log(web3);
export { Web3, providerUrl, web3 };
