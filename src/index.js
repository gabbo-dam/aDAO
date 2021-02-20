import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import reportWebVitals from './reportWebVitals';
import './fonts/VT323-Regular.ttf'
import { UseWalletProvider } from 'use-wallet';
import bsc from '@binance-chain/bsc-use-wallet'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureStore()}>
      <UseWalletProvider
        chainId={56}
        connectors={{ bsc }}
      >
        <App />
      </UseWalletProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
