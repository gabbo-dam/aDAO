import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/pancakeswap/pancakeswap-v2',
  cache: new InMemoryCache()
});

export default client;